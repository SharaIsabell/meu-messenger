import { AppError } from '../errors/AppError.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err.code === 'P2002') {
    // Prisma: valor único repetido (ex.: dois cadastros simultâneos com o mesmo nome)
    return res.status(409).json({ error: 'Este registro já existe.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
}