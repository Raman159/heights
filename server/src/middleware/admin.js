import jwt from "jsonwebtoken";

export default function admin(req, res, next) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(\S+)$/i);
  if (!match)
    return res.status(401).json({
      error: "Authentication required",
      code: "AUTH_REQUIRED",
    });

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin" || payload.token_use === "refresh")
      return res.status(403).json({
        error: "Administrator access required",
        code: "ADMIN_REQUIRED",
      });
    req.admin = payload;
    next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    res.status(401).json({
      error: expired ? "Access token expired" : "Invalid access token",
      code: expired ? "ACCESS_TOKEN_EXPIRED" : "INVALID_ACCESS_TOKEN",
    });
  }
}
