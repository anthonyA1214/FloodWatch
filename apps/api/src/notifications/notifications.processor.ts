import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsService } from './notifications.service';
import {
  NOTIFICATIONS_QUEUE,
  NOTIFICATION_JOBS,
  NotificationJobData,
} from './notifications.types';

@Processor(NOTIFICATIONS_QUEUE, { concurrency: 10 })
export class NotificationsProcessor extends WorkerHost {
  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  async process(job: Job<NotificationJobData>) {
    switch (job.name) {
      case NOTIFICATION_JOBS.SEND:
        await this.notificationsService.create(job.data);
        break;
      default:
        throw new Error(`Unknown notification job: ${job.name}`);
    }
  }
}
