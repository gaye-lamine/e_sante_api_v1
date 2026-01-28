import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';
import { pool } from '../../../shared/infrastructure/database/database';

export class PgUserRepository implements UserRepository {
    async save(user: User): Promise<void> {
        const query = `
            INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                password_hash = EXCLUDED.password_hash,
                updated_at = EXCLUDED.updated_at
        `;
        const values = [
            user.id,
            user.name,
            user.email,
            user.passwordHash,
            user.createdAt,
            user.updatedAt
        ];
        await pool.query(query, values);
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.password_hash,
            createdAt: row.created_at,
            updated_at: row.updated_at
        } as any); // Type mapping adjust for domain constructor
    }

    async findById(id: string): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.password_hash,
            createdAt: row.created_at,
            updated_at: row.updated_at
        } as any);
    }
}
