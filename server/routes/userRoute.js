import express from "express";
import { fetchChats, fetchUsers, userLogin, userSignup } from "../controllers/userController.js";
const router = express.Router();

router.route("/register").post(userSignup);
router.route("/login").post(userLogin);
router.route("/fetch-users").get(fetchUsers);
router.route("/fetch-chats/:id").get(fetchChats);



export default router;
