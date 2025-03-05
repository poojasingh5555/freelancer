import express from "express";
import {
  fetchFreelancer,
  updateFreelancer,
} from "../controllers/freelancerController.js";
const router = express.Router();

router.route("/fetch-freelancer/:id").get(fetchFreelancer);
router.route("/update-freelancer").post(updateFreelancer);

export default router;
