import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ImagesModule } from 'src/images/images.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { GeocoderModule } from 'src/geocoder/geocoder.module';
import { CommentsModule } from 'src/comments/comments.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    DrizzleModule,
    ImagesModule,
    CloudinaryModule,
    GeocoderModule,
    CommentsModule,
    NotificationsModule,
    MailerModule,
  ],
  providers: [ReportsService],
  exports: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
