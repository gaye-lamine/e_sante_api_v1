import { HealthMetric } from '../domain/health_metric';
import { HealthMetricRepository } from '../domain/health_metric.repository';

export class InMemoryHealthMetricRepository implements HealthMetricRepository {
    private metrics: HealthMetric[] = [];

    async save(metric: HealthMetric): Promise<void> {
        const index = this.metrics.findIndex((m) => m.id === metric.id);
        if (index !== -1) {
            this.metrics[index] = metric;
        } else {
            this.metrics.push(metric);
        }
    }

    async findByUserId(userId: string): Promise<HealthMetric[]> {
        return this.metrics.filter((m) => m.userId === userId);
    }

    async findById(id: string): Promise<HealthMetric | null> {
        return this.metrics.find((m) => m.id === id) || null;
    }

    async delete(id: string): Promise<void> {
        this.metrics = this.metrics.filter((m) => m.id !== id);
    }
}
