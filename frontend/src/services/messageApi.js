import { api } from './apiClient';

export const messageApi = {
  history: (token, contactId) => api(`/messages/${contactId}`, { token }),
};