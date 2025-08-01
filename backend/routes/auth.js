import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Логин работает!");
});

router.post("/register", (req, res) => {
  res.send("Регистрация работает!");
});

export default router;