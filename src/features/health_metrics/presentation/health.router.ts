import { Router } from 'express';
import { z } from 'zod';
import { HealthController } from './health.controller';
import { validateRequest } from '../../../shared/presentation/middlewares/validate.middleware';
import { authMiddleware } from '../../../shared/presentation/middlewares/auth.middleware';
import { AuthService } from '../../auth/application/auth.service';

export const createHealthRouter = (healthController: HealthController, authService: AuthService): Router => {
    const router = Router();

    const addMetricSchema = z.object({
        body: z.object({
            type: z.enum(['weight', 'blood_pressure', 'glucose']),
            value: z.number().optional(),
            systolic: z.number().optional(),
            diastolic: z.number().optional(),
            measuredAt: z.string().datetime(),
        }),
    });

    router.use(authMiddleware(authService));

    router.post('/', validateRequest(addMetricSchema), healthController.addMetric);
    router.get('/', healthController.getMetrics);
    router.get('/insights', healthController.getInsights);
    router.get('/export', healthController.exportReport);
    router.delete('/:id', healthController.deleteMetric);

    return router;
};
