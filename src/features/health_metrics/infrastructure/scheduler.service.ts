import * as cron from 'node-cron';
import { ReminderRepository } from '../domain/reminder.repository';
import { NotificationProvider } from '../../../shared/infrastructure/services/notification.service';

export class SchedulerService {
    private jobs: Map<string, any> = new Map();

    constructor(
        private reminderRepository: ReminderRepository,
        private notificationProvider: NotificationProvider
    ) { }

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
        await this.notificationProvider.send({
            userId,
            title: 'Rappel Santé',
            message: `Il est temps de prendre votre mesure : ${metricType}`,
            metadata: { reminderId: id, type: metricType }
        });
    }
}
