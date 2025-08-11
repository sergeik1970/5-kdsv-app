import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// import { login, register } from '../controllers/authController.js';
// Создание роутера
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
  // Достаем данные из запроса
  const { username, email, password } = req.body;
  console.log("📥 Получен запрос на регистрацию:", req.body);

  try {
    // Проверяем, есть ли пользователь с таким email
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json("User already exists");

    // Хэшируем пароль перед сохранением в бд
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём нового пользователя
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      approved: true
    });
    // Сохраняем его в базе
    await newUser.save();
    console.log("✅ Пользователь создан:", newUser);

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    // Если ошибка
    console.error("Registration error:", err);
    console.error("❌ Ошибка при создании пользователя:", err);
    return res.status(500).json("Server error");
  }
});

router.post("/login", async (req, res) => {
  // Достаем данные из запроса
  const { email, password } = req.body;
  console.log("🔐 Попытка входа:", email);

  try {
    // Проверяем, есть ли пользователь с таким email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    console.log("👤 Найден пользователь:", user);
    console.log("🧪 Введённый пароль:", password);
    console.log("🔐 Хэш в БД:", user.password);

    // Проверяем пароль
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json("Invalid credentials");

    // Создаём токен на один день
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.JWT_SECRET || "jwt-secret-key",
      { expiresIn: "1d" }
    );

    // Записываем токен в куки
    res.cookie("token", token, {
      httpOnly: true,
      // Чтобы не принимались незащищенные запросы через http, только через https
      secure: true, // после поменять на true
      sameSite: "None" // после поменять на "None"
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
  // Берем токен из куки
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not authenticated");

// Проверяем токен
  jwt.verify(token, process.env.JWT_SECRET || "jwt-secret-key", (err, decoded) => {
    if (err) return res.status(403).json("Token is invalid");

    return res.json({ username: decoded.username, email: decoded.email });
  });
});

// Выход
router.get('/logout', (req, res) => {
  // Удаляем токен из куки
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  return res.json("Success");
});

export default router;