import express from "express";
import * as controller from "./page.controller";
import { auth } from "../../common/middleware/auth";

const router = express.Router();

router.post("/", auth, controller.createPage);

router.get("/:id/full", auth, controller.getFullPage);

router.get("/:id", auth, controller.getPage);

router.delete("/:id", auth, controller.deletePage);

export default router;