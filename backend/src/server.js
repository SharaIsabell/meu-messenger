import http from 'node:http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { registerChatSocket } from './sockets/chatSocket.js';

const httpServer = http.createServer(createApp());

const io = new Server(httpServer, {
  cors: { origin: env.clientUrl },
});
registerChatSocket(io);

httpServer.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});