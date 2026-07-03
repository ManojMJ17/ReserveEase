import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

let server: any;

const startServer = async () => {
    try {
        server = app.listen(env.PORT, () => {
            console.log(`=================================`);
            console.log(`  Server running in ${env.NODE_ENV} mode`);
            console.log(`  Listening on port: ${env.PORT}`);
            console.log(`=================================`);
        });

        // Connect to Database asynchronously in the background
        connectDB();
    } catch (error) {
        console.error('Fatal: Server startup failed.');
        console.error(error);
        process.exit(1);
    }
};

startServer();

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server process terminated gracefully.');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error('CRITICAL: Unexpected error encountered.');
    console.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Cleaning up resources...');
    if (server) {
        server.close();
    }
});
