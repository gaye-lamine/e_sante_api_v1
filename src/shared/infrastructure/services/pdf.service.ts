import PDFDocument from 'pdfkit';
import { User } from '../../../features/auth/domain/user';
import { HealthMetric } from '../../../features/health_metrics/domain/health_metric';
import { HealthInsight } from '../../../features/health_metrics/domain/services/health-analyzer.service';

export class PdfService {
    async generateHealthReport(user: User, metrics: HealthMetric[], insights: HealthInsight[]): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));

            // Header
            doc.fontSize(25).text('Rapport de Santé E-Sante', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Rapport généré le : ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.text(`Patient : ${user.name} (${user.email})`, { align: 'right' });
            doc.moveDown();

            // Divider
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Insights Section
            doc.fontSize(18).text('Analyses et Tendances', { underline: true });
            doc.moveDown();
            insights.forEach(insight => {
                doc.fontSize(14).fillColor('#2c3e50').text(`${insight.type.toUpperCase()}:`, { continued: true });
                doc.fontSize(12).fillColor('black').text(` ${insight.message}`);
                doc.moveDown(0.5);
            });
            doc.moveDown();

            // Metrics History Section
            doc.fontSize(18).text('Historique détaillé des mesures', { underline: true });
            doc.moveDown();

            metrics.sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime()).forEach(m => {
                const date = m.measuredAt.toLocaleDateString();
                const time = m.measuredAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let valueStr = '';
                if (m.type === 'blood_pressure') {
                    valueStr = `${m.systolic}/${m.diastolic} mmHg`;
                } else if (m.type === 'weight') {
                    valueStr = `${m.value} kg`;
                } else if (m.type === 'glucose') {
                    valueStr = `${m.value} mg/dL`;
                }

                doc.fontSize(11).text(`${date} ${time} | ${m.type.toUpperCase()} | ${valueStr}`);
            });

            // Footer
            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);
                doc.fontSize(10).text(
                    `Page ${i + 1} sur ${range.count}`,
                    0,
                    doc.page.height - 20,
                    { align: 'center' }
                );
            }

            doc.end();
        });
    }
}
