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
    const healthService = new HealthService(healthRepository);
    const healthController = new HealthController(healthService);

    // Routes
    app.use('/auth', createAuthRouter(authController));
    app.use('/metrics', createHealthRouter(healthController, authService));

    // Health check
    app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

    // Error handling
    app.use(errorMiddleware);

    return app;
};
