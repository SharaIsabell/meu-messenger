import { z } from 'zod';

const username = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, 'Use de 3 a 20 caracteres: letras minúsculas, números ou _');

const password = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres')
  .max(72, 'A senha pode ter no máximo 72 caracteres');

export const credentialsSchema = z.object({ username, password });

export const recoverSchema = z.object({
  username,
  recoveryCode: z.string().trim().min(16, 'Código de recuperação inválido'),
  newPassword: password,
});

export const addContactSchema = z.object({ username });

export const registerSchema = credentialsSchema.extend({
  inviteCode: z.string().trim().optional(),
});