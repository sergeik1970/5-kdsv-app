import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import auth from "./auth.js"
import auth2 from "../middleware/auth.js";

const router = express.Router();

// Настройка multer (файлы хранятся в оперативной памяти)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Создать пост
// router.post('/create', upload.single('file'), async (req, res) => {
//   try {
//     const { title, description, email, username } = req.body;
//     const file = req.file;

//     if (!file) return res.status(400).json("Файл обязателен");

//     const base64File = file.buffer.toString('base64');

//     const newPost = await Post.create({
//       title,
//       description,
//       email,
//       username,
//       file: base64File
//     });

//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error("Ошибка при создании поста:", err);
//     res.status(500).json("Server error");
//   }
// });

router.post('/create', async (req, res) => {
  const { title, description, file, email, username } = req.body;
  if (!file) return res.status(400).json("Файл обязателен");
  if (!email) return res.status(400).json("Email обязателен");

  try {
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
    const limit = 2;
    const page = parseInt(req.query.page || "1", 10);
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
      { $project: { title: 1, description: 1, email: 1, username: 1, createdAt: 1, file: 1 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]).allowDiskUse(true);

    res.json(posts);
  } catch (err) {
    console.error("Ошибка в /getposts:", err.message, err.stack);
    res.status(500).json({ error: "Ошибка сервера при получении постов" });
  }
});

router.get('/getpostbyid/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Пост не найден" });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Некорректный ID");
      return res.status(400).json("Некорректный id");
    }

    const post = await Post.findById(id);
    console.log("Найденный пост:", post);

    if (!post) {
      console.log("❌ Пост не найден");
      return res.status(404).json("Пост не найден");
    }

    console.log("req.user:", req.user);
    if (!req.user?.email) {
      return res.status(401).json("No token / user in request");
    }

    if (post.email !== req.user.email) {
      console.log(`❌ Нет прав: post.email=${post.email}, user.email=${req.user.email}`);
      return res.status(403).json("Нет прав для удаления этого поста");
    }

    await Post.findByIdAndDelete(id);
    console.log("✅ Пост удалён");

    return res.status(200).json({ message: "Пост удалён", id });
  } catch (err) {
    console.error("❌ Ошибка в DELETE /deletepostbyid:", err);
    return res.status(500).json("Ошибка сервера");
  }
});

export default router;