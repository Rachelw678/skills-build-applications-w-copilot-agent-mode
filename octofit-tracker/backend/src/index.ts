import cors from 'cors';
import dotenv from 'dotenv';
import express, { type ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import { apiRouter } from './routes/api.js';
import { getApiBaseUrl } from './config/api.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    apiBaseUrl: getApiBaseUrl(port),
  });
});

app.use('/api', apiRouter);

const handleApiError: ErrorRequestHandler = (error, _request, response, next) => {
  console.error('OctoFit API request failed:', error);
  if (response.headersSent) {
    next(error);
    return;
  }
  response.status(500).json({ error: 'Internal server error' });
};

app.use('/api', handleApiError);

async function startServer() {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening at ${getApiBaseUrl(port)}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});