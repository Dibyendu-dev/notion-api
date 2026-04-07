import express from "express";
import * as controller from "./block.controller";
import { auth } from "../../common/middleware/auth";

const router = express.Router();

router.post("/", auth, controller.createBlock);
router.get("/:id/tree", auth, controller.getBlockTree);

export default router;