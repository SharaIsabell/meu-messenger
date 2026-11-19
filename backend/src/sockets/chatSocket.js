import { authService } from '../services/authService.js';
import { messageService } from '../services/messageService.js';
import { AppError } from '../errors/AppError.js';

export function registerChatSocket(io) {
  // Só aceita conexões com token válido
  io.use((socket, next) => {
    try {
      socket.user = authService.verifyToken(socket.handshake.auth?.token);
      next();
    } catch (err) {
      next(new Error(err.message));
    }
  });

  io.on('connection', (socket) => {
    const myRoom = `user:${socket.user.id}`;
    socket.join(myRoom);

    socket.on('message:send', async (payload, ack) => {
      const reply = typeof ack === 'function' ? ack : () => {};
      try {
        const { to, content } = payload ?? {};
        const message = await messageService.send(socket.user.id, to, content);
        io.to(`user:${to}`).to(myRoom).emit('message:new', message);
        reply({ ok: true });
      } catch (err) {
        reply({ ok: false, error: err instanceof AppError ? err.message : 'Erro ao enviar a mensagem.' });
        if (!(err instanceof AppError)) console.error(err);
      }
    });
  });
}