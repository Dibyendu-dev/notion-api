import express from "express";
import { clerkMiddleware, createClerkClient } from "@clerk/express";
import blockRoutes from "./modules/block/block.route.js";
import pageRoutes from "./modules/page/page.route.js";
import workspaceRoutes from "./modules/workspace/workspace.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import { errorHandler } from "./common/middleware/error.middleware.js";

export const app = express();

app.use(express.json());

app.use(clerkMiddleware())

app.use("/api/blocks", blockRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);