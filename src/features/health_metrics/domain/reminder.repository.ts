import { Reminder } from './reminder';

export interface ReminderRepository {
    save(reminder: Reminder): Promise<void>;
    findByUserId(userId: string): Promise<Reminder[]>;
    findById(id: string): Promise<Reminder | null>;
    delete(id: string): Promise<void>;
    findAllEnabled(): Promise<Reminder[]>;
}
