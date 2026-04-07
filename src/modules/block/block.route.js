import express from "express";
import * as controller from "./block.controller.js";
import { auth } from "../../common/middleware/auth.js";

const router = express.Router();

router.post("/", auth, controller.createBlock);
router.get("/:id/tree", auth, controller.getBlockTree);

export default router;
