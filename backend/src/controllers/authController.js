import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res) {
    res.status(201).json(await authService.register(req.body));
  },
  async login(req, res) {
    res.json(await authService.login(req.body));
  },
  async recover(req, res) {
    res.json(await authService.recover(req.body));
  },
  me(req, res) {
    res.json({ user: req.user });
  },
};