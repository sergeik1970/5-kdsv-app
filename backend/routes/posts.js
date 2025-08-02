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

export default router;