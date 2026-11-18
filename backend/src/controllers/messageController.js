import { messageService } from '../services/messageService.js';

export const messageController = {
  async history(req, res) {
    const { contactId } = req.params;
    res.json(await messageService.history(req.user.id, contactId, req.query.before));
  },
};