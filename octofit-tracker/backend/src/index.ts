import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

async function startServer() {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening on port ${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});