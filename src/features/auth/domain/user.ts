import crypto from 'crypto';

export interface UserProps {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User {
    public readonly id: string;
    public readonly name: string;
    public readonly email: string;
    public readonly passwordHash: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(props: UserProps) {
        this.id = props.id || crypto.randomUUID();
        this.name = props.name;
        this.email = props.email;
        this.passwordHash = props.passwordHash;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
}
