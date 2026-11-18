import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';

const httpServer = http.createServer(createApp());

httpServer.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});