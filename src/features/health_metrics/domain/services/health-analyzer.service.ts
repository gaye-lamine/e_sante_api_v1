import { HealthMetric, HealthMetricType } from '../health_metric';

export type Trend = 'stable' | 'increasing' | 'decreasing' | 'unknown';

export interface HealthInsight {
    type: HealthMetricType;
    average: number | { systolic: number; diastolic: number };
    trend: Trend;
    deltaPercentage?: number;
    message: string;
}

export class HealthAnalyzer {
    analyze(metrics: HealthMetric[], type: HealthMetricType): HealthInsight {
        const filtered = metrics
            .filter(m => m.type === type)
            .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime());

        if (filtered.length === 0) {
            return {
                type,
                average: 0,
                trend: 'unknown',
                message: `No data available for ${type}`
            };
        }

        if (type === 'blood_pressure') {
            return this.analyzeBloodPressure(filtered);
        }

        return this.analyzeScalarMetric(filtered, type);
    }

    private analyzeScalarMetric(metrics: HealthMetric[], type: HealthMetricType): HealthInsight {
        const values = metrics.map(m => m.value || 0);
        const average = values.reduce((a, b) => a + b, 0) / values.length;

        let trend: Trend = 'stable';
        let deltaPercentage: number | undefined;

        if (metrics.length >= 2) {
            const latest = metrics[0].value || 0;
            const previous = metrics[1].value || 0;

            if (latest > previous) trend = 'increasing';
            else if (latest < previous) trend = 'decreasing';

            if (previous !== 0) {
                deltaPercentage = ((latest - previous) / previous) * 100;
            }
        }

        return {
            type,
            average: parseFloat(average.toFixed(2)),
            trend,
            deltaPercentage: deltaPercentage !== undefined ? parseFloat(deltaPercentage.toFixed(2)) : undefined,
            message: this.generateMessage(type, trend, deltaPercentage)
        };
    }

    private analyzeBloodPressure(metrics: HealthMetric[]): HealthInsight {
        const systolics = metrics.map(m => m.systolic || 0);
        const diastolics = metrics.map(m => m.diastolic || 0);

        const avgSystolic = systolics.reduce((a, b) => a + b, 0) / systolics.length;
        const avgDiastolic = diastolics.reduce((a, b) => a + b, 0) / diastolics.length;

        let trend: Trend = 'stable';
        if (metrics.length >= 2) {
            const latestSys = metrics[0].systolic || 0;
            const prevSys = metrics[1].systolic || 0;
            if (latestSys > prevSys) trend = 'increasing';
            else if (latestSys < prevSys) trend = 'decreasing';
        }

        return {
            type: 'blood_pressure',
            average: {
                systolic: parseFloat(avgSystolic.toFixed(2)),
                diastolic: parseFloat(avgDiastolic.toFixed(2))
            },
            trend,
            message: `Your average blood pressure is ${avgSystolic.toFixed(0)}/${avgDiastolic.toFixed(0)}. The trend is ${trend}.`
        };
    }

    private generateMessage(type: string, trend: Trend, delta?: number): string {
        const direction = trend === 'increasing' ? 'up' : trend === 'decreasing' ? 'down' : 'stable';
        const deltaText = delta !== undefined ? ` by ${Math.abs(delta).toFixed(1)}%` : '';
        return `Your ${type} trend is ${direction}${deltaText} compared to the last measurement.`;
    }
}
