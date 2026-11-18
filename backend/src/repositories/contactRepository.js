import { prisma } from '../config/prisma.js';

export const contactRepository = {
  listByOwner: (ownerId) =>
    prisma.contact.findMany({
      where: { ownerId },
      include: { contact: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'asc' },
    }),

  exists: (ownerId, contactId) =>
    prisma.contact.findUnique({
      where: { ownerId_contactId: { ownerId, contactId } },
    }),

  // Cria a amizade nos dois sentidos de uma vez
  createMutual: (userA, userB) =>
    prisma.contact.createMany({
      data: [
        { ownerId: userA, contactId: userB },
        { ownerId: userB, contactId: userA },
      ],
      skipDuplicates: true,
    }),
};