import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../features/auth/application/auth.service';
import { UnauthorizedError } from '../../errors/app-error';

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string };
        }
    }
}

export const authMiddleware = (authService: AuthService) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Missing or malformed token');
        }

        const token = authHeader.split(' ')[1];
        try {
            const payload = authService.verifyToken(token);
            req.user = payload;
            next();
        } catch (error) {
            next(error);
        }
    };
};
