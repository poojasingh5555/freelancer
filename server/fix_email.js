import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Freelancer from "./models/freelancerModel.js";

dotenv.config();

const fixEmail = async () => {
  try {
    const uri = "mongodb+srv://singhps:y9Qu9qevXyhYxN8h@clusterdb.s9lcn.mongodb.net/freelancerDB";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    const oldEmail = "maduri@gamil.com";
    const newEmail = "maduri@gmail.com";

    const user = await User.findOne({ email: oldEmail });
    if (!user) {
      console.log("User with email maduri@gamil.com not found!");
      process.exit(0);
    }

    console.log(`Found user: ${user.username}. Updating email...`);
    user.email = newEmail;
    await user.save();

    // Freelancer profile check
    const freelancer = await Freelancer.findOne({ userId: user._id });
    if (freelancer) {
      freelancer.email = newEmail;
      await freelancer.save();
      console.log("Updated freelancer profile too.");
    }

    console.log("Email fixed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing email:", err);
    process.exit(1);
  }
};

fixEmail();
