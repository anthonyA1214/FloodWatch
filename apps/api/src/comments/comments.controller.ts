import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { ReportCommentDto, UpdateCommentDto } from '@repo/schemas';

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
}
