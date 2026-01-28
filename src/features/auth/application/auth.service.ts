import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';
import { AppError, UnauthorizedError, ValidationError } from '../../../shared/errors/app-error';

export class AuthService {
    private readonly jwtSecret = process.env.JWT_SECRET || 'secret';

    constructor(private userRepository: UserRepository) { }

    async register(name: string, email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('Email already in use');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, passwordHash });

        await this.userRepository.save(user);

        const token = this.generateToken(user.id);

        const { passwordHash: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = this.generateToken(user.id);

        const { passwordHash: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    private generateToken(userId: string): string {
        return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '1d' });
    }

    verifyToken(token: string): { userId: string } {
        try {
            return jwt.verify(token, this.jwtSecret) as { userId: string };
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    }
}
