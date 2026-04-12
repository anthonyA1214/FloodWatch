import {
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { setAuthCookies } from '../utils/auth-util';
import { Public } from '../../common/decorators/public.decorator';
import { GoogleAuthGuard } from '../guards/google-auth/google-auth.guard';
import { type GoogleRequest } from '../types/google-request.type';
import { ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';
import { type Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { GoogleLinkAuthGuard } from '../guards/google-link-auth/google-link-auth.guard';
import { type GoogleLinkRequest } from '../types/google-link-request.type';
import { UserStatusGuard } from 'src/common/guards/user-status/user-status.guard';

@Controller('auth/google')
export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get('')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Public()
  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Request() req: GoogleRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const frontendURL = this.configService.getOrThrow<string>('FRONTEND_URL');
    const existingToken = req.cookies?.['access_token'] as string | undefined;

    if (existingToken) {
      const payload = JSON.parse(
        Buffer.from(existingToken.split('.')[1], 'base64url').toString(),
      ) as { role: string };
      return res.redirect(
        `${frontendURL}${payload?.role === 'admin' ? '/admin' : '/map'}`,
      );
    }

    const { access_token, refresh_token, deviceId, user } =
      await this.googleService.handleGoogleLogin(req.user);

    if (user.status === 'blocked')
      return res.redirect(
        this.configService.getOrThrow('FRONTEND_URL') + '/auth/login',
      );

    const isProduction =
      this.configService.getOrThrow('NODE_ENV') === 'production';
    setAuthCookies(res, access_token, refresh_token, deviceId, isProduction);

    if (user.role === 'admin') res.redirect(`${frontendURL}/admin`);
    else res.redirect(`${frontendURL}/map`);
  }

  @Get('link')
  @UseGuards(JwtAuthGuard, GoogleLinkAuthGuard, UserStatusGuard)
  async linkGoogleAccount() {}

  @Get('link/callback')
  @UseGuards(JwtAuthGuard, GoogleLinkAuthGuard)
  async linkGoogleAccountCallback(
    @Request() req: GoogleLinkRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await this.googleService.linkGoogleAccount(req.user, req.google);

      const frontendURL = this.configService.getOrThrow<string>('FRONTEND_URL');
      if (req.user.role === 'admin')
        res.redirect(`${frontendURL}/admin/settings?linked=success`);
      else res.redirect(`${frontendURL}/map?linked=success`);
    } catch (error) {
      const frontendURL = this.configService.getOrThrow<string>('FRONTEND_URL');

      let errorMessage = 'unknown_error';
      if (error instanceof ConflictException) {
        if (error.message.includes('email must match')) {
          errorMessage = 'email_mismatch';
        } else if (error.message.includes('already linked')) {
          errorMessage = 'already_linked';
        }
      } else if (error instanceof NotFoundException) {
        errorMessage = 'user_not_found';
      }

      if (req.user.role === 'admin')
        res.redirect(
          `${frontendURL}/admin/settings?linked=error&reason=${errorMessage}`,
        );
      else
        res.redirect(`${frontendURL}/map?linked=error&reason=${errorMessage}`);
    }
  }
}
