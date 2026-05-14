import Project from "../models/projectModel.js";
import { approveSubmission } from "../services/applicationServices.js";

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("clientId");

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const addNewProject = async (req, res) => {
  const {
    title,
    description,
    budget,
    skills
  } = req.body;
  try {
    const projectSkills = Array.isArray(skills) ? skills : skills.split(",");
    const newProject = new Project({
      title,
      description,
      budget,
      skills: projectSkills,
     clientId: req.user._id,
      clientName: req.user.username,
      clientEmail: req.user.email,
      postedDate: new Date(),
    });
    await newProject.save();
    res.status(200).json({ message: "Project added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitProject = async (req, res) => {
  const {
    clientId,
    freelancerId,
    projectId,
    projectLink,
    manualLink,
    submissionDescription,
  } = req.body;
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.projectLink = projectLink;
    project.manualLink = manualLink;
    project.submissionDescription = submissionDescription;
    project.submission = true;
    await project.save();

    res.status(200).json({ message: "Project submitted and awaits client approval" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchMyAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
