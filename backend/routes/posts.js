import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';

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

export default router;