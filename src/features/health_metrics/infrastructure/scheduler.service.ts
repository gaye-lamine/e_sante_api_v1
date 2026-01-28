import * as cron from 'node-cron';
import { ReminderRepository } from '../domain/reminder.repository';

export class SchedulerService {
    private jobs: Map<string, any> = new Map();

    constructor(private reminderRepository: ReminderRepository) { }

    async initialize() {
        console.log('⏳ Initializing Scheduler Service...');
        const enabledReminders = await this.reminderRepository.findAllEnabled();

        for (const reminder of enabledReminders) {
            this.scheduleReminder(reminder.id, reminder.cronSchedule, () => {
                this.executeReminder(reminder.id, reminder.userId, reminder.metricType);
            });
        }

        console.log(`✅ Scheduler initialized with ${enabledReminders.length} active reminders`);
    }

    scheduleReminder(id: string, schedule: string, task: () => void) {
        // Stop existing task if any
        this.stopReminder(id);

        try {
            const job = cron.schedule(schedule, task);
            this.jobs.set(id, job);
        } catch (error) {
            console.error(`❌ Failed to schedule reminder ${id}:`, error);
        }
    }

    stopReminder(id: string) {
        const job = this.jobs.get(id);
        if (job) {
            job.stop();
            this.jobs.delete(id);
        }
    }

    private async executeReminder(id: string, userId: string, metricType: string) {
        // Staff Engineer approach: Decouple notification logic
        // For V2.1, we just log to console. Future: call NotificationService
        console.log(`[REMINDER] [USER:${userId}] It is time to measure your ${metricType}! (ID: ${id})`);
    }
}
