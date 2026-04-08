import { Inject, Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle-connection';
import { notifications } from 'src/drizzle/schemas/notifications.schema';
import { type DrizzleDB } from 'src/drizzle/types/drizzle';

@Injectable()
export class NotificationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(userId: number) {
    return this.db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async unreadCount(userId: number) {
    const [result] = await this.db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, userId),
          eq(notifications.isRead, false),
        ),
      );
    return { count: result.count };
  }

  async markAllRead(userId: number) {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.recipientId, userId),
          eq(notifications.isRead, false),
        ),
      );
  }

  async markOneRead(notificationId: number, userId: number) {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.recipientId, userId),
        ),
      );
  }

  async create(dto: typeof notifications.$inferInsert) {
    const [created] = await this.db
      .insert(notifications)
      .values(dto)
      .returning();
    return created;
  }
}
