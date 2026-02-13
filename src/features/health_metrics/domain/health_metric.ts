import crypto from 'crypto';
import { ValidationError } from '../../../shared/errors/app-error';

export type HealthMetricType = 'weight' | 'blood_pressure' | 'glucose';

export interface HealthMetricProps {
    id?: string;
    userId: string;
    type: HealthMetricType;
    value?: number;
    systolic?: number;
    diastolic?: number;
    measuredAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class HealthMetric {
    public readonly id: string;
    public readonly userId: string;
    public readonly type: HealthMetricType;
    public readonly value?: number;
    public readonly systolic?: number;
    public readonly diastolic?: number;
    public readonly measuredAt: Date;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(props: HealthMetricProps) {
        this.validate(props);
        this.id = props.id || crypto.randomUUID();
        this.userId = props.userId;
        this.type = props.type;
        this.value = props.value;
        this.systolic = props.systolic;
        this.diastolic = props.diastolic;
        this.measuredAt = props.measuredAt;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private validate(props: HealthMetricProps) {
        if (props.type === 'weight' && (!props.value || props.value <= 0)) {
            throw new ValidationError('Le poids doit être supérieur à 0');
        }
        if (props.type === 'glucose' && (!props.value || props.value <= 0)) {
            throw new ValidationError('Le taux de glucose doit être supérieur à 0');
        }
        if (props.type === 'blood_pressure') {
            if (!props.systolic || props.systolic <= 0) {
                throw new ValidationError('La pression systolique doit être supérieure à 0');
            }
            if (!props.diastolic || props.diastolic <= 0) {
                throw new ValidationError('La pression diastolique doit être supérieure à 0');
            }
        }
    }
}
