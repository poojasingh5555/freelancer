import express from "express";
import {
  addNewProject,
  
  getProject,
  submitProject,
  fetchMyAssignedProjects,
} from "../controllers/projectController.js";
import { getAllProjects } from "../controllers/adminController.js";
import {protect} from "../middleware/authMiddleware.js"
const router = express.Router();

router.route("/fetch-project/:id").get(getProject);
router.route("/fetch-projects").get(getAllProjects);
router.route("/new-project").post(protect,addNewProject);
router.route("/submit-work").post(submitProject);
router.route("/fetch-my-assigned-projects").get(protect, fetchMyAssignedProjects);

export default router;