import { Reminder } from '../domain/reminder';
import { ReminderRepository } from '../domain/reminder.repository';
import { pool } from '../../../shared/infrastructure/database/database';

export class PgReminderRepository implements ReminderRepository {
    async save(reminder: Reminder): Promise<void> {
        const query = `
            INSERT INTO reminders (id, user_id, metric_type, cron_schedule, is_enabled, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                metric_type = EXCLUDED.metric_type,
                cron_schedule = EXCLUDED.cron_schedule,
                is_enabled = EXCLUDED.is_enabled,
                updated_at = EXCLUDED.updated_at
        `;
        const values = [
            reminder.id,
            reminder.userId,
            reminder.metricType,
            reminder.cronSchedule,
            reminder.isEnabled,
            reminder.createdAt,
            reminder.updatedAt
        ];
        await pool.query(query, values);
    }

    async findByUserId(userId: string): Promise<Reminder[]> {
        const result = await pool.query('SELECT * FROM reminders WHERE user_id = $1', [userId]);
        return result.rows.map(row => this.mapToDomain(row));
    }

    async findById(id: string): Promise<Reminder | null> {
        const result = await pool.query('SELECT * FROM reminders WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        return this.mapToDomain(result.rows[0]);
    }

    async delete(id: string): Promise<void> {
        await pool.query('DELETE FROM reminders WHERE id = $1', [id]);
    }

    async findAllEnabled(): Promise<Reminder[]> {
        const result = await pool.query('SELECT * FROM reminders WHERE is_enabled = true');
        return result.rows.map(row => this.mapToDomain(row));
    }

    private mapToDomain(row: any): Reminder {
        return new Reminder({
            id: row.id,
            userId: row.user_id,
            metricType: row.metric_type,
            cronSchedule: row.cron_schedule,
            isEnabled: row.is_enabled,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}
