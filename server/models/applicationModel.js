import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    freelancerName: String,
    freelancerEmail: String,

    proposal: String,

    bidAmount: Number,

    estimatedTime: Number,

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);