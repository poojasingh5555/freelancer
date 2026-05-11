import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Freelancer from "../models/freelancerModel.js";
import Chat from "../models/chatModel.js";

export const userSignup = async (req, res) => {
  try {
    const { username, email, password, usertype, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create User (Bina transaction ke, taki local DB par crash na ho)
    const userRole = usertype || role || "client";
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      role: userRole,
    });

    // 4. Create Freelancer Profile if needed
    if (userRole === "freelancer") {
      await Freelancer.create({
        userId: newUser._id,
        username: newUser.username, 
        email: newUser.email
      });
    }

    
    const token = jwt.sign(
      { 
        id: newUser._id,
        usertype: newUser.role, 
        email: newUser.email,
        username: newUser.username 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    
    res.status(200).json({
      token: token,
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      usertype: newUser.role,
    });

  } catch (err) {
    console.error("Signup Crash Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { 
        id: user._id,
        usertype: user.role, 
        email: user.email,
        username: user.username
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );


    res.status(200).json({
      token: token,
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.role,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const fetchChats = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(404).json({ msg: "Chat not found" });

    // PRIVACY GUARD: Check karein ki kya logged-in user is chat ka hissa hai
    const isParticipant = chat.participants.includes(req.user.id);
    if (!isParticipant && req.user.usertype !== 'admin') {
       return res.status(403).json({ msg: "Access denied. Not your chat." });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
