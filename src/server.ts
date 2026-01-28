import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { initializeDatabase } from './shared/infrastructure/database/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await initializeDatabase();
    const { app, schedulerService } = createApp();

    await schedulerService.initialize();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

startServer();
