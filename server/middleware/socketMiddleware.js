import jwt from "jsonwebtoken";
// Agar aapne alag file banayi hai, toh shayad dotenv load na hua ho
import dotenv from "dotenv";
dotenv.config();

export const socketAuthMiddleware = (socket, next) => {
  try {
    let token = socket.handshake.auth.token;

    // --- DEBUGGING LOGS (Terminal mein check karne ke liye) ---
    console.log("1. Token received from React:", token);
    console.log("2. Is JWT_SECRET loaded?", !!process.env.JWT_SECRET); 
    // ----------------------------------------------------------

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // 3. FIX: Kabhi kabhi React "Bearer " prefix ke sath token bhejta hai
    // Agar "Bearer " laga hai, toh usko hata do, sirf token string rakho
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Token verify karna 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: User info attach karna
    socket.userId = decoded.id; 
    socket.userRole = decoded.usertype; 
    socket.username = decoded.username; 

    next();
  } catch (error) {
    console.error("Socket Auth Error:", error.message);
    return next(new Error("Invalid token"));
  }
};