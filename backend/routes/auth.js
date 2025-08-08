import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// import { login, register } from '../controllers/authController.js';
const router = express.Router();

// router.post('/login', login);
// router.post('/register', register);
// Не требуется, но чтобы не было ошибки
router.get('/login', (req, res) => {
  res.send("GET /login работает (но сюда React не отправляет запросы)");
});

router.get('/register', (req, res) => {
  res.send("GET /register работает (но сюда React не отправляет запросы)");
});

// POST /register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log("📥 Получен запрос на регистрацию:", req.body);

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      approved: true
    });

    await newUser.save();
    console.log("✅ Пользователь создан:", newUser);

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    console.error("❌ Ошибка при создании пользователя:", err);
    return res.status(500).json("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Попытка входа:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    console.log("👤 Найден пользователь:", user);
    console.log("🧪 Введённый пароль:", password);
    console.log("🔐 Хэш в БД:", user.password);

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.JWT_SECRET || "jwt-secret-key",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // после поменять на true
      sameSite: "Lax" // после поменять на "None"
    });

    console.log("✅ Успешный вход:", user.username);
    return res.status(200).json({ message: "Login successful", username: user.username, email: user.email, token });
  } catch (err) {
    console.error("❌ Ошибка при входе:", err);
    return res.status(500).json("Server error");
  }
});

// Проверка авторизации
router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, process.env.JWT_SECRET || "jwt-secret-key", (err, decoded) => {
    if (err) return res.status(403).json("Token is invalid");

    return res.json({ username: decoded.username, email: decoded.email });
  });
});

// Выход
router.get('/logout', (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  return res.json("Success");
});

export default router;