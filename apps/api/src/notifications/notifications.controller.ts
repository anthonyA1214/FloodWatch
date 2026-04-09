import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserStatusGuard } from 'src/common/guards/user-status/user-status.guard';
import { type AuthRequest } from 'src/auth/types/auth-request.type';

@Controller('me/notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // GET /me/notifications
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async findAll(@Request() req: AuthRequest) {
    return await this.notificationsService.findAll(req.user.id);
  }

  // GET /me/notifications/unread-count
  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async unreadCount(@Request() req: AuthRequest) {
    return await this.notificationsService.unreadCount(req.user.id);
  }

  // PATCH /me/notifications/read-all
  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async markAllRead(@Request() req: AuthRequest) {
    return await this.notificationsService.markAllRead(req.user.id);
  }

  // PATCH /me/notifications/:id/read
  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async markOneRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    return await this.notificationsService.markOneRead(id, req.user.id);
  }

  // DELETE /me/notifications/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    return await this.notificationsService.deleteOne(id, req.user.id);
  }
}
