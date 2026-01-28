import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './shared/presentation/middlewares/error.middleware';
import { createAuthRouter } from './features/auth/presentation/auth.router';
import { AuthController } from './features/auth/presentation/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { PgUserRepository } from './features/auth/infrastructure/pg-user.repository';
import { createHealthRouter } from './features/health_metrics/presentation/health.router';
import { HealthController } from './features/health_metrics/presentation/health.controller';
import { HealthService } from './features/health_metrics/application/health.service';
import { PgHealthMetricRepository } from './features/health_metrics/infrastructure/pg-health.repository';
import { PdfService } from './shared/infrastructure/services/pdf.service';

import { createReminderRouter } from './features/health_metrics/presentation/reminder.router';
import { ReminderController } from './features/health_metrics/presentation/reminder.controller';
import { ReminderService } from './features/health_metrics/application/reminder.service';
import { PgReminderRepository } from './features/health_metrics/infrastructure/pg-reminder.repository';
import { SchedulerService } from './features/health_metrics/infrastructure/scheduler.service';
import { ConsoleNotificationProvider } from './shared/infrastructure/services/notification.service';

export const createApp = () => {
    const app = express();

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Dependencies Injection
    const userRepository = new PgUserRepository();
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    const healthRepository = new PgHealthMetricRepository();
    const pdfService = new PdfService();
    const healthService = new HealthService(healthRepository, userRepository, pdfService);
    const healthController = new HealthController(healthService);

    const notificationProvider = new ConsoleNotificationProvider();
    const reminderRepository = new PgReminderRepository();
    const schedulerService = new SchedulerService(reminderRepository, notificationProvider);
    const reminderService = new ReminderService(reminderRepository, schedulerService);
    const reminderController = new ReminderController(reminderService);

    // Routes
    app.use('/auth', createAuthRouter(authController));
    app.use('/metrics', createHealthRouter(healthController, authService));
    app.use('/reminders', createReminderRouter(reminderController));

    // Health check
    app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

    // Error handling
    app.use(errorMiddleware);

    return { app, schedulerService };
};
