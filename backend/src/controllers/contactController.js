import { contactService } from '../services/contactService.js';

export const contactController = {
  async list(req, res) {
    res.json(await contactService.list(req.user.id));
  },
  async add(req, res) {
    res.status(201).json(await contactService.add(req.user.id, req.body.username));
  },
};