import { HealthService } from '../health.service';
import { InMemoryHealthMetricRepository } from '../../infrastructure/in-memory-health.repository';
import { ValidationError, ForbiddenError } from '../../../../shared/errors/app-error';

describe('HealthService', () => {
    let healthService: HealthService;
    let healthRepository: InMemoryHealthMetricRepository;

    beforeEach(() => {
        healthRepository = new InMemoryHealthMetricRepository();
        healthService = new HealthService(healthRepository);
    });

    it('should add a valid weight metric', async () => {
        const metric = await healthService.addMetric({
            userId: 'user1',
            type: 'weight',
            value: 75,
            measuredAt: new Date(),
        });
        expect(metric.value).toBe(75);
    });

    it('should throw ValidationError for weight <= 0', async () => {
        await expect(healthService.addMetric({
            userId: 'user1',
            type: 'weight',
            value: 0,
            measuredAt: new Date(),
        })).rejects.toThrow();
    });

    it('should allow user to delete their own metric', async () => {
        const metric = await healthService.addMetric({
            userId: 'user1',
            type: 'glucose',
            value: 110,
            measuredAt: new Date(),
        });

        await expect(healthService.deleteMetric(metric.id, 'user1')).resolves.not.toThrow();
    });

    it('should not allow user to delete someone else metric', async () => {
        const metric = await healthService.addMetric({
            userId: 'user1',
            type: 'glucose',
            value: 110,
            measuredAt: new Date(),
        });

        await expect(healthService.deleteMetric(metric.id, 'user2')).rejects.toThrow();
    });
});
