import { HealthMetric, HealthMetricType } from '../domain/health_metric';
import { HealthMetricRepository } from '../domain/health_metric.repository';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/app-error';

export class HealthService {
    constructor(private healthMetricRepository: HealthMetricRepository) { }

    async addMetric(data: {
        userId: string;
        type: HealthMetricType;
        value?: number;
        systolic?: number;
        diastolic?: number;
        measuredAt: Date;
    }): Promise<HealthMetric> {
        const metric = new HealthMetric(data);
        await this.healthMetricRepository.save(metric);
        return metric;
    }

    async getMetricsByUser(userId: string): Promise<HealthMetric[]> {
        return this.healthMetricRepository.findByUserId(userId);
    }

    async deleteMetric(metricId: string, userId: string): Promise<void> {
        const metric = await this.healthMetricRepository.findById(metricId);
        if (!metric) {
            throw new NotFoundError('Metric not found');
        }

        if (metric.userId !== userId) {
            throw new ForbiddenError('You can only delete your own metrics');
        }

        await this.healthMetricRepository.delete(metricId);
    }
}
