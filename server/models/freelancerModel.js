import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    skills: {
      type: [String],   // better than Array
      default: [],
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    currentProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    completedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],

    funds: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
  type: String,
  enum: ["available", "busy", "offline"],
  default: "available"
}
  },
  { timestamps: true }
);

export default mongoose.model("Freelancer", freelancerSchema);