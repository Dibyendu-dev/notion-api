import express from "express";
import * as authController from "./auth.controller.js";
import { auth } from "../../common/middleware/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", auth, authController.getMe);

export default router;
