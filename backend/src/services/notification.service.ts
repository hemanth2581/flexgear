// backend/src/services/notification.service.ts
import { NotificationModel } from '../models/Notification';

export class NotificationService {
  static async getUserNotifications(userId: string) {
    return await NotificationModel.getByUserId(userId);
  }

  static async markNotificationRead(id: string) {
    return await NotificationModel.markAsRead(id);
  }
}
