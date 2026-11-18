import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../errors/AppError.js';
import { env } from '../config/env.js';

// Sem 0/O e 1/I, para evitar confusão ao copiar à mão
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRecoveryCode() {
  const bytes = crypto.randomBytes(16);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return chars.match(/.{4}/g).join('-');
}

function createToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, env.jwtSecret, {
    expiresIn: '7d',
  });
}

function publicUser(user) {
  return { id: user.id, username: user.username };
}

export const authService = {
  async register({ username, password }) {
    const existing = await userRepository.findByUsername(username);
    if (existing) throw new AppError('Este nome de usuário já está em uso.', 409);

    const recoveryCode = generateRecoveryCode();
    const user = await userRepository.create({
      username,
      passwordHash: await bcrypt.hash(password, 12),
      recoveryCodeHash: await bcrypt.hash(recoveryCode, 12),
    });

    return { user: publicUser(user), token: createToken(user), recoveryCode };
  },

  async login({ username, password }) {
    const user = await userRepository.findByUsername(username);
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) throw new AppError('Usuário ou senha incorretos.', 401);

    return { user: publicUser(user), token: createToken(user) };
  },

  async recover({ username, recoveryCode, newPassword }) {
    const user = await userRepository.findByUsername(username);
    const ok = user && (await bcrypt.compare(recoveryCode.toUpperCase(), user.recoveryCodeHash));
    if (!ok) throw new AppError('Usuário ou código de recuperação inválidos.', 401);

    const newRecoveryCode = generateRecoveryCode();
    const updated = await userRepository.update(user.id, {
      passwordHash: await bcrypt.hash(newPassword, 12),
      recoveryCodeHash: await bcrypt.hash(newRecoveryCode, 12),
    });

    return { user: publicUser(updated), token: createToken(updated), recoveryCode: newRecoveryCode };
  },

  verifyToken(token) {
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      return { id: payload.sub, username: payload.username };
    } catch {
      throw new AppError('Sessão inválida ou expirada. Entre novamente.', 401);
    }
  },
};