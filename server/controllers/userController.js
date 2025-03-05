import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Freelancer from "../models/freelancerModel.js";
import Chat from "../models/chatModel.js"

export const userSignup = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      usertype,
    });

    const user = await newUser.save();

    if (usertype === "freelancer") {
      const newFreelancer = new Freelancer({
        userId: user._id,
      });
      await newFreelancer.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const fetchUsers = async (req, res) => {
  try{

          const users = await User.find();

          res.status(200).json(users);

      }catch(err){
          res.status(500).json({error: err.message});
      }
  }

  export const fetchChats = async (req, res) => {
    try{

          const chats = await Chat.findById(req.params.id);

          console.log(chats);

          res.status(200).json(chats);

      }catch(err){
          res.status(500).json({error: err.message});
      }
  }