import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    clientName: String,
    clientEmail: String,

    title: { type: String, required: true, trim: true },
    description: String,

    budget: { type: Number, required: true, min: 0 },

    skills: {
      type: [String],
      default: [],
      index: true,
    },

    
    bids: [
      {
        freelancerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    postedDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Available", "Assigned", "In Progress", "Completed"],
      default: "Available",
      index: true,
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    freelancerName: String,

    deadline: Date,

    submission: {
      type: Boolean,
      default: false,
    },

    submissionAccepted: {
      type: Boolean,
      default: false,
    },

    projectLink: {
      type: String,
      default: "",
    },

    manualLink: {
      type: String,
      default: "",
    },

    submissionDescription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);