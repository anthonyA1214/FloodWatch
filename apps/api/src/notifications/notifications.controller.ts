import {
  Controller,
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
  findAll(@Request() req: AuthRequest) {
    return this.notificationsService.findAll(req.user.id);
  }

  // GET /me/notifications/unread-count
  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  unreadCount(@Request() req: AuthRequest) {
    return this.notificationsService.unreadCount(req.user.id);
  }

  // PATCH /me/notifications/read-all  👈 must be ABOVE :id route or NestJS reads "read-all" as an :id
  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  markAllRead(@Request() req: AuthRequest) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  // PATCH /me/notifications/:id/read
  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  markOneRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    return this.notificationsService.markOneRead(id, req.user.id);
  }
}
