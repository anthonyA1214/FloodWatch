import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ImagesModule } from 'src/images/images.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [DrizzleModule, ImagesModule, CloudinaryModule, NotificationsModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
