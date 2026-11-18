import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1); // necessário atrás do proxy da hospedagem
  app.use(cors({ origin: env.clientUrl }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/api', routes);
  app.use(errorHandler); // sempre por último

  return app;
}