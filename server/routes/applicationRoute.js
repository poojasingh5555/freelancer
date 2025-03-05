import express from "express";
import {
  approveApplication,
  approveSubmission,
  fetchApplications,
  makeBid,
  rejectApplication,
  rejectSubmission,
} from "../controllers/applicationController.js";
const router = express.Router();

router.route("/make-bid").post(makeBid);
router.route("/fetch-applications").get(fetchApplications);
router.route("/approve-application/:id").get(approveApplication);
router.route("/reject-application/:id").get(rejectApplication);
router.route("/approve-submission/:id").get(approveSubmission);
router.route("/reject-submission/:id").get(rejectSubmission);

export default router;
