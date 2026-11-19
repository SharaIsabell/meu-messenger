import { io } from 'socket.io-client';

let socket = null;

export const socketService = {
  connect(token) {
    socket = io(import.meta.env.VITE_API_URL, { auth: { token } });
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  send(to, content) {
    return new Promise((resolve) => {
      socket.emit('message:send', { to, content }, resolve);
    });
  },

  onMessage(handler) {
    const current = socket;
    current.on('message:new', handler);
    return () => current.off('message:new', handler);
  },
};