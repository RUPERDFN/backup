import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { router as billingRouter } from './routes/googlePlayBilling.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();

// CORS estricto: tu landing
const WEB_ORIGIN = process.env.WEB_ORIGIN || 'https://thecookflow.com';
app.use(cors({
  origin: [WEB_ORIGIN],
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json({ limit: '1mb' }));

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: 'replit', time: new Date().toISOString() });
});

// Rutas de monetización
app.use('/api', billingRouter);

// Arranque
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => logger.info({ msg: `API listening on ${PORT}`, origin: WEB_ORIGIN }));