import User from "../models/userModel.js"; 
import Freelancer from "../models/freelancerModel.js"; 
import Project from "../models/projectModel.js"; 
import Application from "../models/applicationModel.js"; 

// MAKE BID
export const makeBid = async (data) => {
  const {
    freelancerId,    // Token se aaya verified ID
    freelancerName,  // Token se aaya verified Name
    freelancerEmail, // Token se aaya verified Email
    projectId,
    proposal,
    bidAmount,
    estimatedTime,
  } = data;

  // Project aur Freelancer details fetch karein
  const project = await Project.findById(projectId);
  const freelancerData = await Freelancer.findOne({ userId: freelancerId });

  if (!project || !freelancerData) {
    throw new Error("Invalid project or freelancer data"); 
  }

  // Check: Kya same freelancer already bid kar chuka hai?
  if (project.bids.some(bid => bid.freelancerId.toString() === freelancerId.toString())) {
    throw new Error("Already bid on this project");
  }

  const application = await Application.create({
    projectId,
    clientId: project.clientId, 
    freelancerId,
    freelancerName,
    freelancerEmail,
    proposal,
    bidAmount: Number(bidAmount),
    estimatedTime,
  });

  // Project aur Freelancer documents update karein
  project.bids.push({ freelancerId, amount: Number(bidAmount), message: proposal });
  freelancerData.applications.push(application._id);

  await project.save();
  await freelancerData.save();

  return { message: "Bidding successful" };
};

// APPROVE APPLICATION
export const approveApplication = async (applicationId) => {
  const application = await Application.findById(applicationId);
  if (!application) throw new Error("Application not found");

  const project = await Project.findById(application.projectId);
  if (!project) throw new Error("Project not found");

  const freelancer = await Freelancer.findOne({ userId: application.freelancerId });
  if (!freelancer) throw new Error("Freelancer profile not found. The freelancer may not have completed their profile setup.");

  const user = await User.findById(application.freelancerId);
  if (!user) throw new Error("User not found");

  // Current application ko accept karein
  application.status = "Accepted";
  await application.save();

  // Baaki pending applications ko ek saath reject karein
  await Application.updateMany(
    { 
      projectId: application.projectId, 
      status: "Pending", 
      _id: { $ne: applicationId } 
    },
    { $set: { status: "Rejected" } }
  );

  // Project status update: "Available" -> "Assigned"
  project.freelancerId = freelancer.userId;
  project.freelancerName = user.username;
  project.budget = application.bidAmount;
  project.status = "Assigned";

  freelancer.currentProjects.push(project._id);

  await project.save();
  await freelancer.save();

  return { message: "Application approved!!" };
};

// REJECT APPLICATION
export const rejectApplication = async (applicationId) => {
  const application = await Application.findById(applicationId);
  if (!application) throw new Error("Application not found");
  application.status = "Rejected";
  await application.save();
  return { message: "Application rejected!!" };
};

// APPROVE SUBMISSION
export const approveSubmission = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const freelancer = await Freelancer.findOne({ userId: project.freelancerId });

  project.submissionAccepted = true;
  project.status = "Completed";

  freelancer.currentProjects = freelancer.currentProjects.filter(
    (id) => id.toString() !== project._id.toString()
  );
  
  if (!freelancer.completedProjects.includes(project._id)) {
    freelancer.completedProjects.push(project._id);
  }

  // Payment/Funds update
  freelancer.funds = Number(freelancer.funds) + Number(project.budget);

  await project.save();
  await freelancer.save();

  return { message: "Submission approved" };
};

// FETCH APPLICATIONS (Optimized for performance and frontend structure)
export const fetchApplications = async (query) => {
  const { projectId, freelancerId, requestingUserId, requestingUserRole } = query;

  let filter = {};

  if (requestingUserRole === 'admin') {
    filter = {
      ...(projectId && { projectId }),
      ...(freelancerId && { freelancerId }),
    };
  } else if (requestingUserRole === 'client') {
    filter = { clientId: requestingUserId };
    if (projectId) filter.projectId = projectId;
  } else {
    filter = { freelancerId: requestingUserId };
  }

  const applications = await Application.find(filter)
    .populate("projectId", "title description skills budget")
    .populate("freelancerId", "username email skills") // Added username/email for freelancer
    .populate("clientId", "username email") // Added clientId population
    .sort({ createdAt: -1 })
    .lean();

  // Flatten the response for performance and easier frontend usage
  return applications.map(app => ({
    ...app, // Keep all original fields including populated objects
    projectId: app.projectId, // Ensure this is the object
    title: app.projectId?.title || "Unknown Project",
    description: app.projectId?.description || "",
    requiredSkills: app.projectId?.skills || [],
    budget: app.projectId?.budget || 0,
    clientName: app.clientId?.username || "Unknown Client",
    clientEmail: app.clientId?.email || "",
    freelancerSkills: app.freelancerId?.skills || [],
  }));
};

// DELETE/WITHDRAW APPLICATION
export const deleteApplication = async (applicationId, requestingUser) => {
  try {
    console.log(`[DELETE] Starting deletion for App ID: ${applicationId}`);
    
    if (!requestingUser || !requestingUser._id) {
      throw new Error("User authentication data is missing");
    }

    const application = await Application.findById(applicationId);
    
    if (!application) {
      console.error("[DELETE] Application not found in DB");
      throw new Error("Application not found in database");
    }

    // Authorization (Safe check)
    const appFreelancerId = application.freelancerId ? application.freelancerId.toString() : null;
    const currentUserId = requestingUser._id ? requestingUser._id.toString() : null;

    const isFreelancer = appFreelancerId && currentUserId && (appFreelancerId === currentUserId);
    const isAdmin = requestingUser.usertype === 'admin' || requestingUser.role === 'admin';
    
    console.log(`[DELETE] Auth Check: isFreelancer=${isFreelancer}, isAdmin=${isAdmin}`);

    if (!isFreelancer && !isAdmin) {
      console.error("[DELETE] Unauthorized attempt");
      throw new Error("You are not authorized to delete this application");
    }

    // Step 1: Update Project Bids
    try {
      if (application.projectId) {
        const project = await Project.findById(application.projectId);
        if (project && project.bids) {
          console.log(`[DELETE] Updating project bids for Project: ${project._id}`);
          project.bids = project.bids.filter(bid => 
            bid.freelancerId && appFreelancerId && bid.freelancerId.toString() !== appFreelancerId
          );
          await project.save();
        }
      }
    } catch (projectErr) {
      console.error("[DELETE] Failed to update project bids:", projectErr.message);
    }

    // Step 2: Update Freelancer Profile
    try {
      if (appFreelancerId) {
        const freelancer = await Freelancer.findOne({ userId: application.freelancerId });
        if (freelancer && freelancer.applications) {
          console.log(`[DELETE] Updating freelancer applications for Freelancer User: ${appFreelancerId}`);
          freelancer.applications = freelancer.applications.filter(
            appId => appId && appId.toString() !== applicationId.toString()
          );
          await freelancer.save();
        }
      }
    } catch (freelancerErr) {
      console.error("[DELETE] Failed to update freelancer profile:", freelancerErr.message);
    }

    // Step 3: Final Delete
    console.log("[DELETE] Executing findByIdAndDelete...");
    const deletedApp = await Application.findByIdAndDelete(applicationId);
    
    if (!deletedApp) {
      throw new Error("Failed to delete application document from database");
    }

    console.log("[DELETE] Success");
    return { message: "Application deleted successfully" };

  } catch (err) {
    console.error("[DELETE] Global error:", err.message);
    throw err;
  }
};