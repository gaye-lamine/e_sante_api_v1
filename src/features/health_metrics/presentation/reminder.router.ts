import { Router } from 'express';
import { ReminderController } from '../presentation/reminder.controller';
import { authMiddleware } from '../../../shared/presentation/middlewares/auth.middleware';
import { validateRequest } from '../../../shared/presentation/middlewares/validate.middleware';
import { z } from 'zod';

const reminderSchema = z.object({
    body: z.object({
        metricType: z.enum(['weight', 'blood_pressure', 'glucose', 'medication', 'follow_up']),
        cronSchedule: z.string().min(5),
    })
});

export const createReminderRouter = (controller: ReminderController) => {
    const router = Router();

    router.use(authMiddleware);

    router.post('/', validateRequest(reminderSchema), controller.create);
    router.get('/', controller.getByUser);
    router.delete('/:id', controller.delete);
    router.patch('/:id/toggle', controller.toggle);

    return router;
};
