import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import BrevoTransport from 'nodemailer-brevo-transport';
@Module({
  imports: [
    NestMailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // transport: new BrevoTransport({
        //   apiKey: configService.getOrThrow('BREVO_API_KEY'),
        // }),
        // Using SMTP transport as an alternative to BrevoTransport
        transport: {
          host: configService.getOrThrow('EMAIL_HOST'),
          port: Number(configService.getOrThrow('EMAIL_PORT')),
          auth: {
            user: configService.getOrThrow('EMAIL_USERNAME'),
            pass: configService.getOrThrow('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"FloodWatch" <anthonyamiluddin1@gmail.com>', // sender address - verified only
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
