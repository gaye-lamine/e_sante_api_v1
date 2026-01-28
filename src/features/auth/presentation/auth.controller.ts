import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../application/auth.service';

export class AuthController {
    constructor(private authService: AuthService) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.register(name, email, password);
            return res.status(201).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            return res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
