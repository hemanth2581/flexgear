// backend/src/jobs/scheduledJobs.ts
import { RentalModel } from '../models/Rental';
import { NotificationModel } from '../models/Notification';
import { DepositModel } from '../models/Deposit';

export class ScheduledJobsEngine {
  /**
   * Run all daily maintenance and automated reminder workflows.
   */
  static async runDailyJobs(): Promise<{
    overdueRentalsProcessed: number;
    remindersSent: number;
    pendingRefundsReviewed: number;
  }> {
    console.log('[FlexGear Cron] Running automated daily scheduled background jobs...');
    
    let overdueRentalsProcessed = 0;
    let remindersSent = 0;
    let pendingRefundsReviewed = 0;

    try {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const todayStr = now.toISOString().split('T')[0];

      // 1. Scan for Overdue Active Rentals
      const allRentals = await RentalModel.getAll();
      for (const rental of allRentals) {
        const orderId = rental.rental_number || rental.id;
        if (rental.status === 'ACTIVE' && rental.end_date < todayStr) {
          console.warn(`[FlexGear Cron] Rental ${orderId} is OVERDUE (Ended: ${rental.end_date})`);
          await NotificationModel.create({
            user_id: rental.user_id,
            type: 'RETURN_REMINDER',
            title: '⚠️ URGENT: Rental Overdue for Return',
            message: `Your booking #${orderId} ended on ${rental.end_date}. Please return gear to your assigned FlexGear Hub immediately to avoid late fees.`,
          });
          overdueRentalsProcessed++;
        }

        // 2. Rental Starting Tomorrow Reminder
        if (rental.status === 'CONFIRMED' && rental.start_date === tomorrowStr) {
          await NotificationModel.create({
            user_id: rental.user_id,
            type: 'RENTAL_UPDATE',
            title: '🎬 Shoot Prep: Your Rental Starts Tomorrow!',
            message: `Gear for booking #${orderId} is being prepped in the vault. Pickup/Delivery scheduled for ${rental.start_date}.`,
          });
          remindersSent++;
        }
      }

      // 3. Scan for Pending Security Deposit Releases
      const deposits = await DepositModel.getAll();
      for (const deposit of deposits) {
        if (deposit.status === 'HELD') {
          pendingRefundsReviewed++;
        }
      }

      console.log(`[FlexGear Cron] Finished: ${overdueRentalsProcessed} overdue flagged, ${remindersSent} reminders dispatched, ${pendingRefundsReviewed} deposits under review.`);
    } catch (err) {
      console.error('[FlexGear Cron] Error executing background jobs:', err);
    }

    return { overdueRentalsProcessed, remindersSent, pendingRefundsReviewed };
  }
}
