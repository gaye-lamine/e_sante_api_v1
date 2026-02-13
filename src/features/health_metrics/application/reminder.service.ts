import { Reminder, ReminderProps } from '../domain/reminder';
import { ReminderRepository } from '../domain/reminder.repository';
import { SchedulerService } from '../infrastructure/scheduler.service';

export class ReminderService {
    constructor(
        private reminderRepository: ReminderRepository,
        private schedulerService: SchedulerService
    ) { }

    async createReminder(props: ReminderProps): Promise<Reminder> {
        const reminder = new Reminder(props);
        await this.reminderRepository.save(reminder);

        this.schedulerService.scheduleReminder(reminder.id, reminder.cronSchedule, () => {
            console.log(`[TRIGGERED] Reminder ${reminder.id} for user ${reminder.userId}`);
        });

        return reminder;
    }

    async getRemindersByUser(userId: string): Promise<Reminder[]> {
        return this.reminderRepository.findByUserId(userId);
    }

    async deleteReminder(id: string, userId: string): Promise<void> {
        const reminder = await this.reminderRepository.findById(id);
        if (!reminder) {
            throw new Error('Rappel non trouvé');
        }
        if (reminder.userId !== userId) {
            throw new Error('Non autorisé à supprimer ce rappel');
        }
        await this.reminderRepository.delete(id);
    }

    async toggleReminder(id: string, userId: string): Promise<Reminder> {
        const reminder = await this.reminderRepository.findById(id);
        if (!reminder) {
            throw new Error('Rappel non trouvé');
        }
        if (reminder.userId !== userId) {
            throw new Error('Non autorisé à modifier ce rappel');
        }

        const updatedReminder = new Reminder({
            ...reminder,
            isEnabled: !reminder.isEnabled,
            updatedAt: new Date()
        });

        await this.reminderRepository.save(updatedReminder);
        return updatedReminder;
    }
}
