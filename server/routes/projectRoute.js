import express from "express";
import {
  addNewProject,
  getAllProjects,
  getProject,
  submitProject,
} from "../controllers/projectController.js";
const router = express.Router();

router.route("/fetch-project/:id").get(getProject);
router.route("/fetch-projects").get(getAllProjects);
router.route("/new-project").post(addNewProject);
router.route("/submit-project").post(submitProject);



export default router;
