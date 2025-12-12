// src/backend/lib/jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-super-secret-key-2025-do-not-use-in-prod";
const EXPIRE = process.env.JWT_EXPIRE || "7d";

// Generate Token
export const generateToken = (payload, expiresIn = EXPIRE) => {
  if (!payload?.id || !payload?.role) {
    console.error("JWT Error: Payload must contain id and role");
    return null;
  }

  try {
    const token = jwt.sign(payload, SECRET, { expiresIn });
    console.log(`JWT Generated → Role: ${payload.role} | ID: ${payload.id} | Expires: ${expiresIn}`);
    return token;
  } catch (error) {
    console.error("JWT Generation Failed:", error.message);
    return null;
  }
};

// Verify Token — Sabse zyada use hoga yeh
export const verifyToken = (token) => {
  if (!token) {
    return { valid: false, error: "No token provided", decoded: null };
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    return { valid: true, decoded, error: null };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { valid: false, error: "Token expired", decoded: null };
    }
    if (error.name === "JsonWebTokenError") {
      return { valid: false, error: "Invalid token", decoded: null };
    }
    return { valid: false, error: "Token verification failed", decoded: null };
  }
};

// IMPORTANT: Purane code ke liye backward compatibility — ab kabhi import error nahi aayega!
export const verifyJwt = verifyToken;

// Ek line mein token + role dono check karne ke liye (bohot use hoga!)
export const verifyJwtAndRole = (token, allowedRoles = []) => {
  const { valid, decoded, error } = verifyToken(token);

  if (!valid) {
    return { authorized: false, message: error, user: null };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
    return { authorized: false, message: "Insufficient permissions", user: null };
  }

  return { authorized: true, message: "Success", user: decoded };
};

// Logout Helper (Next.js 13+ App Router ke liye bhi kaam karega)
export const clearAuthCookie = (response) => {
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });
};

// Refresh Token (future ready)
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || SECRET, { expiresIn: "30d" });
};

// Role-based validation (advanced)
export const validateRole = (token, allowedRoles = []) => {
  const { valid, decoded, error } = verifyToken(token);

  if (!valid) return { authorized: false, error, decoded: null };
  if (allowedRoles.length === 0) return { authorized: true, decoded, error: null };
  if (allowedRoles.includes(decoded.role)) return { authorized: true, decoded, error: null };

  return { authorized: false, error: "Insufficient permissions", decoded: null };
};

// Middleware for Pages Router (agar kabhi use karo)
export const authMiddleware = (allowedRoles = []) => {
  return (handler) => async (req, res) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    const { authorized, decoded, error } = validateRole(token, allowedRoles);

    if (!authorized) {
      return res.status(401).json({ success: false, message: error || "Unauthorized" });
    }

    req.user = decoded;
    return handler(req, res);
  };
};