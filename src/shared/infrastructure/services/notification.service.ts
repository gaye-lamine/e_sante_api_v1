export interface NotificationPayload {
    userId: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
}

export interface NotificationProvider {
    send(payload: NotificationPayload): Promise<void>;
}

export class ConsoleNotificationProvider implements NotificationProvider {
    async send(payload: NotificationPayload): Promise<void> {
        console.log('--- 🔔 NOTIFICATION DISPATCHED ---');
        console.log(`To User: ${payload.userId}`);
        console.log(`Title: ${payload.title}`);
        console.log(`Message: ${payload.message}`);
        if (payload.metadata) {
            console.log(`Metadata: ${JSON.stringify(payload.metadata)}`);
        }
        console.log('---------------------------------');
    }
}
