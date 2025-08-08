import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const raw = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  console.log("[auth] hit, token exists:", !!raw);
  if (!raw) return res.status(401).json("No token");

  try {
    req.user = jwt.verify(raw, process.env.JWT_SECRET || "jwt-secret-key");
    next();
  } catch (e) {
    return res.status(401).json("Invalid token");
  }
}