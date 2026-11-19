import { api } from './apiClient';

export const contactApi = {
  list: (token) => api('/contacts', { token }),
  add: (token, username) => api('/contacts', { method: 'POST', token, body: { username } }),
};