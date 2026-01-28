import { AuthService } from '../auth.service';
import { InMemoryUserRepository } from '../../infrastructure/in-memory-user.repository';
import { ValidationError, UnauthorizedError } from '../../../../shared/errors/app-error';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: InMemoryUserRepository;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        authService = new AuthService(userRepository);
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const result = await authService.register('Lamine Gaye', 'lamine@example.com', 'password123');
            expect(result.user.email).toBe('lamine@example.com');
            expect(result.token).toBeDefined();
        });

        it('should throw ValidationError if email is already in use', async () => {
            await authService.register('Lamine Gaye', 'lamine@example.com', 'password123');
            await expect(authService.register('Another', 'lamine@example.com', 'password123'))
                .rejects.toThrow();
        });
    });

    describe('login', () => {
        it('should login with valid credentials', async () => {
            await authService.register('Lamine Gaye', 'lamine@example.com', 'password123');
            const result = await authService.login('lamine@example.com', 'password123');
            expect(result.user.email).toBe('lamine@example.com');
            expect(result.token).toBeDefined();
        });

        it('should throw UnauthorizedError with invalid credentials', async () => {
            await authService.register('Lamine Gaye', 'lamine@example.com', 'password123');
            await expect(authService.login('lamine@example.com', 'wrongpassword'))
                .rejects.toThrow();
        });
    });
});
