import { api } from './apiClient';

export const authApi = {
  register: (username, password) =>
    api('/auth/register', { method: 'POST', body: { username, password } }),

  login: (username, password) =>
    api('/auth/login', { method: 'POST', body: { username, password } }),

  recover: (username, recoveryCode, newPassword) =>
    api('/auth/recover', { method: 'POST', body: { username, recoveryCode, newPassword } }),
};