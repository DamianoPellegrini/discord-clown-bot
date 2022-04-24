import dotenv from 'dotenv';
import { Bot } from './bot';

// Initialize process env from .env files
dotenv.config();

const app = new Bot();

app.start();

process.on('SIGINT', () => {
    console.log('^C Detected! Stopping gracefully...');
    app.stop();
    process.exit(0);
});
