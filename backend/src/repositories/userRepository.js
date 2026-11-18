import { prisma } from '../config/prisma.js';

export const userRepository = {
  findById: (id) => prisma.user.findUnique({ where: { id } }),

  findByUsername: (username) => prisma.user.findUnique({ where: { username } }),

  create: (data) => prisma.user.create({ data }),

  update: (id, data) => prisma.user.update({ where: { id }, data }),
};