import Project from "../models/projectModel.js";

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('clientId')

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addNewProject = async (req, res) => {
  const {
    title,
    description,
    budget,
    skills,
    clientId,
    clientName,
    clientEmail,
  } = req.body;
  try {
    const projectSkills = skills.split(",");
    const newProject = new Project({
      title,
      description,
      budget,
      skills: projectSkills,
      clientId,
      clientName,
      clientEmail,
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

    project.projectLink = projectLink;
    project.manulaLink = manualLink;
    project.submissionDescription = submissionDescription;
    project.submission = true;

    await project.save();

    await project.save();
    res.status(200).json({ message: "Project added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
