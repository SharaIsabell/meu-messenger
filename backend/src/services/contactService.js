import { contactRepository } from '../repositories/contactRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../errors/AppError.js';

export const contactService = {
  async list(ownerId) {
    const rows = await contactRepository.listByOwner(ownerId);
    return rows.map((row) => row.contact);
  },

  async add(ownerId, username) {
    const target = await userRepository.findByUsername(username);
    if (!target) throw new AppError('Usuário não encontrado.', 404);
    if (target.id === ownerId) throw new AppError('Não é possível adicionar o próprio usuário.');

    if (await contactRepository.exists(ownerId, target.id)) {
      throw new AppError('Este contato já está na sua lista.', 409);
    }

    await contactRepository.createMutual(ownerId, target.id);
    return { id: target.id, username: target.username };
  },

  async assertIsContact(ownerId, contactId) {
    const contact = await contactRepository.exists(ownerId, contactId);
    if (!contact) throw new AppError('Este usuário não está nos seus contatos.', 403);
  },
};