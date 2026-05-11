import mongoose from "mongoose";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";
import Application from "../models/applicationModel.js";

export const  getAllUsers = async(req,res) => {
    try{
       const users = await User.find().select("-password");//exclude field
       res.status(200).json(users)

    }catch(err){
res.status(400).json({
    error:err.message
})
    }
}
// getting all project
export  const getAllProjects = async(req,res) => {
    try{
    const page = Number(req.query.page) || 1;//dynamic pagination
    const limit = Number(req.query.limit) || 10;
    
    let projects = await Project.find()
    .sort({ createdAt: -1 }) // Latest projects upar
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

    // Batch populate: Sabhi valid clientIds ek saath fetch karein (Fast — sirf 1 extra query)
    const validClientIds = [
      ...new Set(
        projects
          .map(p => p.clientId)
          .filter(id => id && mongoose.Types.ObjectId.isValid(String(id)))
      )
    ];

    if (validClientIds.length > 0) {
      const users = await User.find({ _id: { $in: validClientIds } })
        .select("username email")
        .lean();
      
      // userId -> user object ka map banao for O(1) lookup
      const userMap = {};
      users.forEach(u => { userMap[String(u._id)] = u; });
      
      // Har project me clientId replace karo populated user se
      projects = projects.map(proj => {
        const user = userMap[String(proj.clientId)];
        if (user) {
          return { ...proj, clientId: user };
        }
        return proj; // Invalid/missing clientId wale projects as-is rahenge
      });
    }

    const total = await Project.countDocuments();

        res.status(200).json({
            projects,
            total,
            page,
            pages: Math.ceil(total / limit) // data miss na ho
        });
    }catch(err){
      res.status(500).json({
        message: "Error fetching projects", error:err.message
      })
    }
}

import Freelancer from "../models/freelancerModel.js";

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Admin attempting to delete user:", id);

    // 1. Delete Freelancer Profile if it exists
    await Freelancer.findOneAndDelete({ userId: id });
    
    // 2. Delete User
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User deleted successfully:", id);
    res.status(200).json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Critical Delete Error:", err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};


// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Pehle us project ki saari applications delete karein
        await Application.deleteMany({ projectId: id });
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting project", error: err });
  }
};