import { HealthMetric } from './health_metric';

export interface HealthMetricRepository {
    save(metric: HealthMetric): Promise<void>;
    findByUserId(userId: string): Promise<HealthMetric[]>;
    findById(id: string): Promise<HealthMetric | null>;
    delete(id: string): Promise<void>;
}
