import jwt from "jsonwebtoken";

// Перехват запроса, чтобы проверить авторизацию, прежде чем пустить пользователя дальше
export default function auth(req, res, next) {
    // Пробуем взять токен из куки
    // ?. чтобы не было ошибки, если куки нет
    // || чтобы взять из заголовка
    const raw = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("[auth] hit, token exists:", !!raw);
    // если токена нет, то выводим ошибку
    if (!raw) return res.status(401).json("No token");

    try {
        // Проверяем токен, если он валидный, то возвращается payload (данные пользователя)
        req.user = jwt.verify(raw, process.env.JWT_SECRET || "jwt-secret-key");
        next();
    } catch (e) {
        // Если токен не валидный
        return res.status(401).json("Invalid token");
    }
}

// Применяется перед роутами, которые требуют авторизации