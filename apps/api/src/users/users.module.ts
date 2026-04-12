import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UsersController } from './users.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ImagesModule } from 'src/images/images.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [DrizzleModule, CloudinaryModule, ImagesModule, MailerModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
