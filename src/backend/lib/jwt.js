// src/backend/lib/jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-super-secret-key-2025-do-not-use-in-prod";
const EXPIRE = process.env.JWT_EXPIRE || "7d";

// Generate Token (Extra Safe + Logging)
export const generateToken = (payload, expiresIn = EXPIRE) => {
  if (!payload || !payload.id || !payload.role) {
    console.error("JWT Error: Payload must contain id and role");
    return null;
  }

  try {
    const token = jwt.sign(payload, SECRET, { expiresIn });
    console.log(`✅ JWT Generated → User: ${payload.name || payload.email} | Role: ${payload.role} | Expires: ${expiresIn}`);
    return token;
  } catch (error) {
    console.error("❌ JWT Generation Failed:", error.message);
    return null;
  }
};

// Verify Token (All errors handled separately)
export const verifyToken = (token) => {
  if (!token) {
    console.warn("⚠️ JWT Warning: No token provided");
    return { valid: false, error: "No token", decoded: null };
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log(`✅ JWT Verified → ${decoded.role} (${decoded.name || decoded.email})`);
    return { valid: true, decoded, error: null };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.warn(`⚠️ JWT Expired → ${error.message} at ${error.expiredAt}`);
      return { valid: false, error: "Token expired", expiredAt: error.expiredAt, decoded: null };
    }
    if (error.name === "JsonWebTokenError") {
      console.warn("⚠️ JWT Invalid →", error.message);
      return { valid: false, error: "Invalid token", decoded: null };
    }
    console.error("❌ JWT Unknown Error:", error.message);
    return { valid: false, error: "Token verification failed", decoded: null };
  }
};

// Logout Helper (Cookie + LocalStorage dono ke liye)
export const logoutUser = (res = null) => {
  // Server-side cookie clear karo (Next.js API routes)
  if (res?.cookies) {
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });
  }

  // Frontend ke liye response
  return {
    success: true,
    message: "Logged out successfully",
    action: "clear_local_storage_token"
  };
};

// Refresh Token Generator (future use)
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_REFRESH_SECRET || SECRET, 
    { expiresIn: "30d" }
  );
};

// Role-based Token Validation (BONUS: SuperAdmin, Admin, Doctor, Patient)
export const validateRole = (token, allowedRoles = []) => {
  const { valid, decoded, error } = verifyToken(token);
  
  if (!valid) {
    return { authorized: false, error, decoded: null };
  }

  // Agar koi specific role check nahi chahiye
  if (allowedRoles.length === 0) {
    return { authorized: true, decoded, error: null };
  }

  // Role match karo
  if (allowedRoles.includes(decoded.role)) {
    console.log(`✅ Role Authorized → ${decoded.role}`);
    return { authorized: true, decoded, error: null };
  }

  console.warn(`⛔ Access Denied → Required: ${allowedRoles.join(", ")} | Got: ${decoded.role}`);
  return { 
    authorized: false, 
    error: "Insufficient permissions", 
    decoded: null 
  };
};

// Middleware Helper (Next.js API Routes ke liye)
export const authMiddleware = (allowedRoles = []) => {
  return (handler) => async (req, res) => {
    const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");
    
    const { authorized, decoded, error } = validateRole(token, allowedRoles);
    
    if (!authorized) {
      return res.status(401).json({ 
        success: false, 
        message: error || "Unauthorized" 
      });
    }

    // User ko request mein attach karo
    req.user = decoded;
    return handler(req, res);
  };
};