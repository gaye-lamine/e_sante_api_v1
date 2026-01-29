import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../application/health.service';

export class HealthController {
    constructor(private healthService: HealthService) { }

    addMetric = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const { type, value, systolic, diastolic, measuredAt } = req.body;
            const metric = await this.healthService.addMetric({
                userId,
                type,
                value,
                systolic,
                diastolic,
                measuredAt: new Date(measuredAt),
            });
            return res.status(201).json({
                status: 'success',
                data: metric,
            });
        } catch (error) {
            next(error);
        }
    };

    getMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const metrics = await this.healthService.getMetricsByUser(userId);
            return res.status(200).json({
                status: 'success',
                data: metrics,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteMetric = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            await this.healthService.deleteMetric(id, userId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    getInsights = async (req: Request, res: Response, Next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const insights = await this.healthService.getHealthInsights(userId);
            res.json(insights);
        } catch (error) {
            Next(error);
        }
    };

    exportReport = async (req: Request, res: Response, Next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const buffer = await this.healthService.exportHealthReport(userId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=health_report_${userId}.pdf`);
            res.send(buffer);
        } catch (error) {
            Next(error);
        }
    };
}
