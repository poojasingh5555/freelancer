import express from "express";
import {
  fetchFreelancer,
  fetchFreelancerProfile,
  updateFreelancer,
} from "../controllers/freelancerController.js";
import {protect} from "../middleware/authMiddleware.js"
const router = express.Router();

router.route("/fetch-freelancer-profile").get(protect, fetchFreelancerProfile);
router.route("/fetch-freelancer/:id").get(fetchFreelancer);
router.route("/update-freelancer").post(protect,updateFreelancer);

export default router;
