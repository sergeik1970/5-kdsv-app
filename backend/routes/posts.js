import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
// Проверка входа
import auth2 from "../middleware/auth.js";

// Создание роутера
const router = express.Router();

router.post('/create', async (req, res) => {
  // Достаем данные из запроса
  const { title, description, file, email, username } = req.body;
  if (!file) return res.status(400).json("Файл обязателен");
  if (!email) return res.status(400).json("Email обязателен");

  try {
    // Создаем новый пост в базе с переданными данными
    const newPost = await Post.create({ title, description, file, email, username });
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Ошибка при создании поста:", err);
    res.status(500).json("Server error");
  }
});


// Получить все посты
router.get('/getposts', async (req, res) => {
  try {
    // Получаем посты по 2 шт
    const limit = 2;
    const page = parseInt(req.query.page || "1", 10);
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
      // Достаем поля из бд
      { $project: { title: 1, description: 1, email: 1, username: 1, createdAt: 1, file: 1 } },
      // Сортируем по дате
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]).allowDiskUse(true);
    // Отправляем на фронт
    res.json(posts);
  } catch (err) {
    console.error("Ошибка в /getposts:", err.message, err.stack);
    res.status(500).json({ error: "Ошибка сервера при получении постов" });
  }
});

router.get('/getpostbyid/:id', async (req, res) => {
  try {
    // Ищем пост в бд по id
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Пост не найден" });
    // Отправляем на фронт
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении поста" });
  }
});

router.delete("/deletepostbyid/:id", auth2, async (req, res) => {
  try {
    console.log("=== УДАЛЕНИЕ ПОСТА ===");
    console.log("req.params.id:", req.params.id);
    console.log("req.user:", req.user);

    const { id } = req.params;
// Проверка id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Некорректный ID");
      return res.status(400).json("Некорректный id");
    }

    // Ищем пост
    const post = await Post.findById(id);
    console.log("Найденный пост:", post);

    if (!post) {
      console.log("❌ Пост не найден");
      return res.status(404).json("Пост не найден");
    }

    console.log("req.user:", req.user);
    // Проверка токена
    if (!req.user?.email) {
      return res.status(401).json("No token / user in request");
    }

    // Удалить может только автор поста, проверяем email поста и в токене
    if (post.email !== req.user.email) {
      console.log(`❌ Нет прав: post.email=${post.email}, user.email=${req.user.email}`);
      return res.status(403).json("Нет прав для удаления этого поста");
    }

    // Находим и удаляем пост
    await Post.findByIdAndDelete(id);
    console.log("✅ Пост удалён");

    return res.status(200).json({ message: "Пост удалён", id });
  } catch (err) {
    console.error("❌ Ошибка в DELETE /deletepostbyid:", err);
    return res.status(500).json("Ошибка сервера");
  }
});

router.put("/editpostbyid/:id", auth2, async (req, res) => {
  try {
    const { id } = req.params;
    // Проверка id
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json("Некорректный id");

    // Проверка существования поста
    const post = await Post.findById(id);
    if (!post) return res.status(404).json("Пост не найден");

    // Редактировать может только автор
    if (!req.user?.email) return res.status(401).json("No token / user in request");
    if (post.email !== req.user.email)
      return res.status(403).json("Нет прав для редактирования этого поста");

    // Обновляем только те поля, которые пришли
    const { title, description, file } = req.body;
    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    // file — только если прислали новый (base64). Если не прислали — не трогаем
    if (file) post.file = file;

    // Сохраняем и отправляем обновленный пост
    const updated = await post.save();
    return res.json(updated);
  } catch (e) {
    console.error("PUT /editpostbyid error:", e);
    return res.status(500).json("Ошибка сервера");
  }
});

export default router;