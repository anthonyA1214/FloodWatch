import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserStatusGuard } from 'src/common/guards/user-status/user-status.guard';
import {
  CommentQueryDto,
  CreateCommentDto,
  CreateFloodAlertDto,
  createFloodAlertSchema,
  ReportFloodAlertDto,
  reportFloodAlertSchema,
  ReportListQueryDto,
  ReportQueryDto,
  VoteDto,
} from '@repo/schemas';
import { type AuthRequest } from 'src/auth/types/auth-request.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentsService } from 'src/comments/comments.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  CreateFloodAlertWithImageDto,
  ReportFloodAlertWithImageDto,
} from './dtos/reports.swagger.dto';
import { CreateCommentWithImageDto } from 'src/comments/dtos/comments.swagger.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private commentsService: CommentsService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getReportMapPins() {
    return await this.reportsService.getReportMapPins();
  }

  @Roles('admin')
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async getAllReports(@Query() reportQuery: ReportQueryDto) {
    return await this.reportsService.getAllReports(reportQuery);
  }

  @Public()
  @Get('list')
  @HttpCode(HttpStatus.OK)
  async getReportList(@Query() reportListQuery: ReportListQueryDto) {
    return await this.reportsService.getReportList(reportListQuery);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getReportDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.reportsService.getReportDetail(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ReportFloodAlertWithImageDto })
  async createReport(
    @Request() req: AuthRequest,
    @Body() createFloodAlertDto: ReportFloodAlertDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsed = reportFloodAlertSchema.safeParse(createFloodAlertDto);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        issues: parsed.error.issues,
      });
    }

    return await this.reportsService.createReport(
      req.user.id,
      createFloodAlertDto,
      image,
    );
  }

  @Roles('admin')
  @Post('admin/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFloodAlertWithImageDto })
  async createReportAdmin(
    @Request() req: AuthRequest,
    @Body() createFloodAlertDto: CreateFloodAlertDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsed = createFloodAlertSchema.safeParse(createFloodAlertDto);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        issues: parsed.error.issues,
      });
    }

    return await this.reportsService.createReportAdmin(
      req.user.id,
      createFloodAlertDto,
      image,
    );
  }

  @Roles('admin')
  @Patch(':id/verify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async verifyReportStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    return await this.reportsService.verifyReportStatus(id, req.user.id);
  }

  @Roles('admin')
  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async deleteReport(@Param('id', ParseIntPipe) id: number) {
    return await this.reportsService.deleteReport(id);
  }

  @Public()
  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard, UserStatusGuard)
  @SkipThrottle({ global: true }) // bypass the 10/min global
  @Throttle({ getComments: { ttl: 60000, limit: 30 } }) // apply 30/min instead
  async getComments(
    @Param('id', ParseIntPipe) id: number,
    @Query() commentQueryDto: CommentQueryDto,
    @Request() req: AuthRequest,
  ) {
    return await this.commentsService.getComments(
      id,
      commentQueryDto,
      req.user?.id,
    );
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCommentWithImageDto })
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: AuthRequest,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.commentsService.addComment(
      id,
      createCommentDto,
      req.user.id,
      image,
    );
  }

  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async voteReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() voteDto: VoteDto,
    @Request() req: AuthRequest,
  ) {
    return await this.reportsService.voteReport(
      id,
      req.user.id,
      voteDto.action,
    );
  }

  @Get(':id/my-vote')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async getMyVote(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    return await this.reportsService.getMyVote(id, req.user.id);
  }
}
