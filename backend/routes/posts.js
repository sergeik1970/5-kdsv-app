import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// Создать пост
router.post('/create', async (req, res) => {
    const { title, description, file, email, username } = req.body;
    try {
        const newPost = await Post.create({ title, description, file, email, username });
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Ошибка при создании поста:", err);
        res.status(500).json("Server error");
    }
});

// Получить все посты
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    console.error("Ошибка при получении постов:", err);
    res.status(500).json("Server error");
  }
});

export default router;