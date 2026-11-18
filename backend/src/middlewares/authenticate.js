import { authService } from '../services/authService.js';
import { AppError } from '../errors/AppError.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Faça login para continuar.', 401));

  try {
    req.user = authService.verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}