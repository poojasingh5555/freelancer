import express from "express";
import { userLogin, userSignup } from "../controllers/userController.js";
const router = express.Router();

router.route("/register").post(userSignup);
router.route("/login").post(userLogin);
router.route("/fetch-users").get(userLogin);
router.route("/fetch-chats/:id").get(userLogin);



export default router;
