import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserStatusGuard } from 'src/common/guards/user-status/user-status.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { type AuthRequest } from 'src/auth/types/auth-request.type';
import {
  ReportCommentDto,
  ReportedCommentActionDto,
  ReportedCommentQueryDto,
  UpdateCommentDto,
} from '@repo/schemas';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateComment(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: AuthRequest,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.commentsService.updateComment(
      id,
      updateCommentDto,
      req.user.id,
      image,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async deleteComment(@Param('id') id: number, @Request() req: AuthRequest) {
    return await this.commentsService.deleteComment(id, req.user);
  }

  @Post(':id/report')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async reportComment(
    @Param('id') id: number,
    @Request() req: AuthRequest,
    @Body() reportCommentDto: ReportCommentDto,
  ) {
    return await this.commentsService.reportComment(
      id,
      req.user.id,
      reportCommentDto,
    );
  }

  @Roles('admin')
  @Get('reports')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async getReportedComments(
    @Query() reportedCommentQuery: ReportedCommentQueryDto,
  ) {
    return await this.commentsService.getReportedComments(reportedCommentQuery);
  }

  @Roles('admin')
  @Get('reports/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async getReportedCommentDetails(@Param('id') id: number) {
    return await this.commentsService.getReportedCommentDetails(id);
  }

  @Roles('admin')
  @Patch('reports/:id/action')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async handleReportedCommentAction(
    @Param('id') id: number,
    @Body() actionDto: ReportedCommentActionDto,
    @Request() req: AuthRequest,
  ) {
    return await this.commentsService.handleReportedCommentAction(
      id,
      actionDto,
      req.user.id,
    );
  }

  @Roles('admin')
  @Delete('reports/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async deleteReportedComment(@Param('id') id: number) {
    return await this.commentsService.deleteReportedComment(id);
  }
}
