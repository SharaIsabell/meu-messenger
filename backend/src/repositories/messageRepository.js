import { prisma } from '../config/prisma.js';

export const messageRepository = {
  create: (data) => prisma.message.create({ data }),

  // Mensagens trocadas entre duas pessoas, das mais novas para as mais antigas
  listBetween: (userA, userB, { before, limit = 50 } = {}) =>
    prisma.message.findMany({
      where: {
        OR: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
        ...(before && { createdAt: { lt: new Date(before) } }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
};