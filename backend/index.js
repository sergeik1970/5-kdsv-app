import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
// Чтобы работало подключение бд
import dotenv from 'dotenv';
dotenv.config();

// Подключение express
const app = express();
app.use(express.json());

// Подключение frontа
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

// Для чтения куки
app.use(cookieParser());

// Маршруты
app.use(authRoutes);

// Проверка
app.get('/', (req, res) => {
  res.send('Сервер работает');
});

// Подключение базы данных
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    // Если ошибка подключения к бд
    .catch((err) => console.log("MongoDB Error", err))

// Запуск сервера

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});