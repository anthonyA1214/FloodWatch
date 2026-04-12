import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATIONS_QUEUE } from './notifications.types';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    DrizzleModule,
    BullModule.registerQueue({ name: NOTIFICATIONS_QUEUE }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [NotificationsService, BullModule],
})
export class NotificationsModule {}
