import express from "express";
import {
  approveApplication,
  approveSubmission,
  fetchApplications,
  makeBid,
  rejectApplication,
  deleteApplication
} from "../controllers/applicationController.js";
import {protect} from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/make-bid").post(protect, makeBid);
router.route("/fetch-applications").get(protect, fetchApplications);
router.route("/approve-application/:id").get(protect, approveApplication);
router.route("/reject-application/:id").get(protect, rejectApplication);
router.route("/approve-submission/:id").get(protect, approveSubmission);
router.route("/delete-application/:id").delete(protect, deleteApplication);

export default router;
