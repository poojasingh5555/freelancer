import Freelancer from "../models/freelancerModel.js";


export const fetchFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.params.id });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }
    // Duplicate IDs fix
    const freelancerObj = freelancer.toObject();
    freelancerObj.currentProjects = [...new Set(freelancerObj.currentProjects.map(id => id.toString()))];
    freelancerObj.completedProjects = [...new Set(freelancerObj.completedProjects.map(id => id.toString()))];
    
    res.status(200).json(freelancerObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Secure: Token se logged-in freelancer ka profile fetch karna
export const fetchFreelancerProfile = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.user._id });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }
    // Duplicate IDs fix
    const freelancerObj = freelancer.toObject();
    freelancerObj.currentProjects = [...new Set(freelancerObj.currentProjects.map(id => id.toString()))];
    freelancerObj.completedProjects = [...new Set(freelancerObj.completedProjects.map(id => id.toString()))];

    res.status(200).json(freelancerObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  UPDATE FREELANCER 
export const updateFreelancer = async (req, res) => {
  const { updateSkills, description } = req.body;
  
  try {
    
    const freelancerId = req.user._id; 

    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // Skills logic: String ko array mein badlein, par pehle check karein
    if (updateSkills) {
      const skillsArray = Array.isArray(updateSkills) 
        ? updateSkills 
        : updateSkills.split(",").map(skill => skill.trim());
      freelancer.skills = skillsArray;
    }

    if (description) {
      freelancer.description = description;
    }

    await freelancer.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      freelancer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};