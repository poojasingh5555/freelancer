import * as applicationService from "../services/applicationServices.js";

export const makeBid = async (req, res) => {
  try {
    // Privacy: Freelancer ki details body se nahi, seedhe token (req.user) se leni chahiye
    const bidData = {
      ...req.body,
      freelancerId: req.user._id,
      freelancerName: req.user.username,
      freelancerEmail: req.user.email
    };
    
    const result = await applicationService.makeBid(bidData);
    res.status(200).json(result);
  } catch (err) {
    console.error("makeBid error:", err);
    res.status(400).json({ error: err.message });
  }
};

export const fetchApplications = async (req, res) => {
  try {
    // Privacy: Hum query ke saath user ka role aur ID bhi bhejenge 
    // taaki service decide kar sake ki Client ko data dikhana hai ya Admin ko.
    const queryData = {
      ...req.query,
      requestingUserId: req.user._id,
      requestingUserRole: req.user.usertype
    };

    const result = await applicationService.fetchApplications(queryData);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Baaki functions (Approve/Reject) sahi hain kyunki woh ID params se lete hain
export const approveApplication = async (req, res) => {
  try {
    const result = await applicationService.approveApplication(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const result = await applicationService.rejectApplication(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const approveSubmission = async (req, res) => {
  try {
    const result = await applicationService.approveSubmission(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const result = await applicationService.deleteApplication(req.params.id, req.user);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};