import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../../shared/presentation/middlewares/validate.middleware';

export const createAuthRouter = (authController: AuthController): Router => {
    const router = Router();

    const registerSchema = z.object({
        body: z.object({
            name: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(6),
        }),
    });

    const loginSchema = z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string(),
        }),
    });

    router.post('/register', validateRequest(registerSchema), authController.register);
    router.post('/login', validateRequest(loginSchema), authController.login);

    return router;
};
