import express from "express";
import { login, register } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
// Не требуется, но чтобы не было ошибки в консоли
router.get('/login', (req, res) => {
  res.send("GET /login работает (но сюда React не отправляет запросы)");
});

router.get('/register', (req, res) => {
  res.send("GET /register работает (но сюда React не отправляет запросы)");
});

export default router;