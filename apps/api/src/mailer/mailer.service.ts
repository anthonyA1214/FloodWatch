import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor(private readonly nestMailerService: NestMailerService) {}

  async sendOtpEmail(to: string, otp: string) {
    await this.nestMailerService.sendMail({
      to,
      subject: `${otp} is your password reset code`,
      template: 'otp',
      context: {
        otp,
      },
    });
  }

  async sendFloodNearYouEmail(
    to: string,
    options: { location: string; severity: string },
  ) {
    const { location, severity } = options;

    await this.nestMailerService.sendMail({
      to,
      subject: `Flood reported near your area (${severity})`,
      template: 'flood-near-you',
      context: {
        location,
        severity,
      },
    });
  }

  async sendGenericFloodAlertEmail(
    to: string,
    options: { location: string; severity: string },
  ) {
    const { location, severity } = options;

    await this.nestMailerService.sendMail({
      to,
      subject: `New flood reported on FloodWatch (${severity})`,
      template: 'flood-generic',
      context: {
        location,
        severity,
      },
    });
  }

  async sendAdminFloodAlertEmail(
    to: string,
    options: { location: string; severity: string },
  ) {
    const { location, severity } = options;

    await this.nestMailerService.sendMail({
      to,
      subject: `[Admin] New flood report (${severity})`,
      template: 'admin-flood',
      context: {
        location,
        severity,
      },
    });
  }

  async sendReportVerifiedEmail(
    to: string,
    options: { location: string; severity: string },
  ) {
    const { location, severity } = options;

    await this.nestMailerService.sendMail({
      to,
      subject: `Your flood report has been verified (${severity})`,
      template: 'report-verified',
      context: {
        location,
        severity,
      },
    });
  }

  async sendAccountBlockedEmail(to: string) {
    await this.nestMailerService.sendMail({
      to,
      subject: 'Your FloodWatch account has been blocked',
      template: 'account-blocked',
      context: {},
    });
  }
}
