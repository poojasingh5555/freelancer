import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },

    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        text: String,
        senderName: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Chat", chatSchema);