export const APP_NAME = "TeamPulseAI";

export const ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member"
};

// 🔥 Environment configs
export const PORT = process.env.PORT || 5000;

export const NODE_ENV = process.env.NODE_ENV || "development";

export const MONGO_URI = process.env.MONGO_URI;

export const JWT_SECRET = process.env.JWT_SECRET;

export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
