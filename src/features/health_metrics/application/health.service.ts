import { HealthMetric, HealthMetricType } from '../domain/health_metric';
import { HealthMetricRepository } from '../domain/health_metric.repository';
import { HealthAnalyzer, HealthInsight } from '../domain/services/health-analyzer.service';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/app-error';
import { UserRepository } from '../../auth/domain/user.repository';
import { PdfService } from '../../../shared/infrastructure/services/pdf.service';

export class HealthService {
    private analyzer: HealthAnalyzer;

    constructor(
        private healthRepository: HealthMetricRepository,
        private userRepository: UserRepository,
        private pdfService: PdfService
    ) {
        this.analyzer = new HealthAnalyzer();
    }

    async addMetric(data: {
        userId: string;
        type: HealthMetricType;
        value?: number;
        systolic?: number;
        diastolic?: number;
        measuredAt: Date;
    }): Promise<HealthMetric> {
        const metric = new HealthMetric(data);
        await this.healthRepository.save(metric);
        return metric;
    }

    async getMetricsByUser(userId: string): Promise<HealthMetric[]> {
        return this.healthRepository.findByUserId(userId);
    }

    async deleteMetric(id: string, userId: string): Promise<void> {
        const metric = await this.healthRepository.findById(id);
        if (!metric) {
            throw new NotFoundError('Mesure non trouvée');
        }

        if (metric.userId !== userId) {
            throw new ForbiddenError('Vous ne pouvez supprimer que vos propres mesures');
        }

        await this.healthRepository.delete(id);
    }

    async getHealthInsights(userId: string): Promise<HealthInsight[]> {
        const metrics = await this.healthRepository.findByUserId(userId);
        const types: HealthMetricType[] = ['weight', 'blood_pressure', 'glucose'];

        return types.map(type => this.analyzer.analyze(metrics, type));
    }

    async exportHealthReport(userId: string): Promise<Buffer> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError('Utilisateur non trouvé');

        const metrics = await this.healthRepository.findByUserId(userId);
        const insights = await this.getHealthInsights(userId);

        return this.pdfService.generateHealthReport(user, metrics, insights);
    }
}
