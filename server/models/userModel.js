import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true, // searchable
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // fast login lookup
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["freelancer", "client", "admin"],
      index: true, // important for role-based filtering
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
