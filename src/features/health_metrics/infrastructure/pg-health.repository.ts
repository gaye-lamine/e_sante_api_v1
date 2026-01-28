import { HealthMetric, HealthMetricType } from '../domain/health_metric';
import { HealthMetricRepository } from '../domain/health_metric.repository';
import { pool } from '../../../shared/infrastructure/database/database';

export class PgHealthMetricRepository implements HealthMetricRepository {
    async save(metric: HealthMetric): Promise<void> {
        const query = `
            INSERT INTO health_metrics (id, user_id, type, value, systolic, diastolic, measured_at, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
                type = EXCLUDED.type,
                value = EXCLUDED.value,
                systolic = EXCLUDED.systolic,
                diastolic = EXCLUDED.diastolic,
                measured_at = EXCLUDED.measured_at,
                updated_at = EXCLUDED.updated_at
        `;
        const values = [
            metric.id,
            metric.userId,
            metric.type,
            metric.value,
            metric.systolic,
            metric.diastolic,
            metric.measuredAt,
            metric.createdAt,
            metric.updatedAt
        ];
        await pool.query(query, values);
    }

    async findByUserId(userId: string): Promise<HealthMetric[]> {
        const result = await pool.query('SELECT * FROM health_metrics WHERE user_id = $1 ORDER BY measured_at DESC', [userId]);
        return result.rows.map(row => this.mapToDomain(row));
    }

    async findById(id: string): Promise<HealthMetric | null> {
        const result = await pool.query('SELECT * FROM health_metrics WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        return this.mapToDomain(result.rows[0]);
    }

    async delete(id: string): Promise<void> {
        await pool.query('DELETE FROM health_metrics WHERE id = $1', [id]);
    }

    private mapToDomain(row: any): HealthMetric {
        return new HealthMetric({
            id: row.id,
            userId: row.user_id,
            type: row.type as HealthMetricType,
            value: row.value ? parseFloat(row.value) : undefined,
            systolic: row.systolic ? parseFloat(row.systolic) : undefined,
            diastolic: row.diastolic ? parseFloat(row.diastolic) : undefined,
            measuredAt: row.measured_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}
