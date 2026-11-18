import { messageRepository } from '../repositories/messageRepository.js';
import { contactService } from './contactService.js';
import { AppError } from '../errors/AppError.js';

const MAX_LENGTH = 2000;

export const messageService = {
  async send(senderId, receiverId, content) {
    const text = typeof content === 'string' ? content.trim() : '';
    if (!text) throw new AppError('A mensagem não pode ser vazia.');
    if (text.length > MAX_LENGTH) throw new AppError(`Limite de ${MAX_LENGTH} caracteres.`);

    await contactService.assertIsContact(senderId, receiverId);
    return messageRepository.create({ senderId, receiverId, content: text });
  },

  async history(userId, contactId, before) {
    await contactService.assertIsContact(userId, contactId);
    const messages = await messageRepository.listBetween(userId, contactId, { before });
    return messages.reverse(); // mais antigas primeiro, como numa conversa
  },
};