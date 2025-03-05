import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    projectId: String,
    clientId: String,
    clientName: String,
    clientEmail: String,
    freelancerId: String,
    freelancerName: String,
    freelancerEmail: String,
    freelancerSkills: [String],
    title: String,
    description: String,
    budget: Number,
    requiredSkills: [String],
    proposal: String,
    bidAmount: Number,
    estimatedTime: Number,
    status: { type: String, default: "Pending" }
});

export default mongoose.model("Application", applicationSchema);
