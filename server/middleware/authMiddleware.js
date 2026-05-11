import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  User find karein (Database se latest data lene ke liye)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    //   req.user mein decoded data aur user details dono merge karein
    // Taaki req.user.usertype aur req.user.email har jagah available rahe
    req.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.role, // User model me 'role' field hai, 'usertype' nahi
    };

    next();

  } catch (err) {
    res.status(401).json({ message: "Token failed or expired" });
  }
};