import jwt from "jsonwebtoken";

export default function admin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin") throw Error();
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized or expired token" });
  }
}
