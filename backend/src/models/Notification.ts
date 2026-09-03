// backend/src/models/Notification.ts
export interface NotificationEntity {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'RENTAL_UPDATE' | 'PAYMENT_SUCCESS' | 'DEPOSIT_REFUND' | 'RETURN_REMINDER' | 'DAMAGE_ALERT';
  link_url?: string | null;
  is_read: boolean;
  created_at: string;
}

export const mockNotifications: NotificationEntity[] = [
  {
    id: 'notif-01',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Rental Active: Sony FX3 Camera',
    message: 'Your shoot is currently active. Return is scheduled for Sep 4th, 2026.',
    type: 'RENTAL_UPDATE',
    link_url: '/rentals',
    is_read: false,
    created_at: new Date().toISOString(),
  },
];

export class NotificationModel {
  static async getByUserId(userId: string): Promise<NotificationEntity[]> {
    return mockNotifications.filter((n) => n.user_id === userId);
  }

  static async markAsRead(id: string): Promise<void> {
    const n = mockNotifications.find((notif) => notif.id === id);
    if (n) n.is_read = true;
  }

  static async create(data: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const notif: NotificationEntity = {
      id: `notif-${Date.now()}`,
      user_id: data.user_id!,
      title: data.title || 'Notification',
      message: data.message || '',
      type: data.type || 'INFO',
      link_url: data.link_url || null,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    mockNotifications.unshift(notif);
    return notif;
  }
}
