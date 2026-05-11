import express from "express";
import { fetchChats,  userLogin, userSignup } from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js"
import {getAllUsers} from "../controllers/adminController.js"
const router = express.Router();

router.route("/register").post(userSignup);
router.route("/login").post(userLogin);
router.route("/fetch-users").get(protect,getAllUsers);
router.route("/fetch-chats/:id").get(protect,fetchChats);



export default router;
