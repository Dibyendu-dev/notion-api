import express from "express";
import * as controller from "./workspace.controller.js";
import { auth } from "../../common/middleware/auth.js";

const router = express.Router();

router.post("/", auth, controller.createWorkspace);
router.get("/", auth, controller.getMyWorkspaces);

export default router;
