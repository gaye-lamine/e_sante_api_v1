import crypto from 'crypto';
import { ValidationError } from '../../../shared/errors/app-error';

export type ReminderType = 'measurement' | 'medication' | 'follow_up';

export interface ReminderProps {
    id?: string;
    userId: string;
    metricType: string;
    cronSchedule: string;
    isEnabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Reminder {
    public readonly id: string;
    public readonly userId: string;
    public readonly metricType: string;
    public readonly cronSchedule: string;
    public readonly isEnabled: boolean;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(props: ReminderProps) {
        this.validate(props);
        this.id = props.id || crypto.randomUUID();
        this.userId = props.userId;
        this.metricType = props.metricType;
        this.cronSchedule = props.cronSchedule;
        this.isEnabled = props.isEnabled !== undefined ? props.isEnabled : true;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private validate(props: ReminderProps) {
        if (!props.userId) {
            throw new ValidationError('L\'ID utilisateur est requis pour un rappel');
        }
        if (!props.metricType) {
            throw new ValidationError('Le type de mesure est requis pour un rappel');
        }
        if (!props.cronSchedule) {
            throw new ValidationError('La planification est requise');
        }

        // Basic cron validation (5 or 6 parts)
        const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
        // Simple validation for the sake of the MVP domain rules
        if (props.cronSchedule.split(' ').length < 5) {
            throw new ValidationError('Format de planification invalide');
        }
    }
}
