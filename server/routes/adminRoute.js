import express from "express";
import {
  getAllUsers,
  getAllProjects,
  deleteUser,
  deleteProject
} from "../controllers/adminController.js";
import {protect} from "../middleware/authMiddleware.js"
import {isAdmin} from "../middleware/adminMiddleware.js"
const router = express.Router();

router.route("/fetch-users").get(protect,getAllUsers);
router.route("/fetch-projects").get( protect,getAllProjects);

router.route("/user/:id").delete(protect,isAdmin, deleteUser);
router.route("/project/:id").delete(protect,isAdmin, deleteProject);

export default router;
