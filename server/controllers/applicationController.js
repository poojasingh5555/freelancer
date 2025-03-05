import User from "../models/userModel.js";
import Freelancer from "../models/freelancerModel.js";
import Project from "../models/projectModel.js";
import Application from "../models/applicationModel.js";

export const makeBid = async (req, res) => {
  const {
    clientId,
    freelancerId,
    projectId,
    proposal,
    bidAmount,
    estimatedTime,
  } = req.body;
  try {
    const freelancer = await User.findById(freelancerId);
    const freelancerData = await Freelancer.findOne({ userId: freelancerId });
    const project = await Project.findById(projectId);
    const client = await User.findById(clientId);

    const newApplication = new Application({
      projectId,
      clientId,
      clientName: client.username,
      clientEmail: client.email,
      freelancerId,
      freelancerName: freelancer.username,
      freelancerEmail: freelancer.email,
      freelancerSkills: freelancerData.skills,
      title: project.title,
      description: project.description,
      budget: project.budget,
      requiredSkills: project.skills,
      proposal,
      bidAmount,
      estimatedTime,
    });

    const application = await newApplication.save();

    project.bids.push(freelancerId);
    project.bidAmounts.push(parseInt(bidAmount));

    console.log(application);

    if (application) {
      freelancerData.applications.push(application._id);
    }

    await freelancerData.save();
    await project.save();

    res.status(200).json({ message: "bidding successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const fetchApplications = async (req, res) => {
  try {
    const applications = await Application.find();

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    const project = await Project.findById(application.projectId);

    const freelancer = await Freelancer.findOne({
      userId: application.freelancerId,
    });

    const user = await User.findById(application.freelancerId);

    application.status = "Accepted";

    await application.save();

    const remainingApplications = await Application.find({
      projectId: application.projectId,
      status: "Pending",
    });

    remainingApplications.map(async (appli) => {
      appli.status === "Rejected";
      await appli.save();
    });

    project.freelancerId = freelancer.userId;
    project.freelancerName = user.email;
    project.budget = application.bidAmount;

    project.status = "Assigned";

    freelancer.currentProjects.push(project._id);

    await project.save();
    await freelancer.save();

    res.status(200).json({ message: "Application approved!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    application.status = "Rejected";

    await application.save();

    res.status(200).json({ message: "Application rejected!!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const freelancer = await Freelancer.findOne({
      userId: project.freelancerId,
    });

    project.submissionAccepted = true;
    project.status = "Completed";

    freelancer.currentProjects.pop(project._id);
    freelancer.completedProjects.push(project._id);

    freelancer.funds = parseInt(freelancer.funds) + parseInt(project.budget);

    await project.save();
    await freelancer.save();

    res.status(200).json({ message: "submission approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    project.submission = false;
    project.projectLink = "";
    project.manulaLink = "";
    project.submissionDescription = "";

    await project.save();

    res.status(200).json({ message: "submission approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
