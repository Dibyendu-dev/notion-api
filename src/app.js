import express from "express";
import blockRoutes from "./modules/block/block.route.js";
import pageRoutes from "./modules/page/page.route.js";
import workspaceRoutes from "./modules/workspace/workspace.route.js";
import { errorHandler } from "./common/middleware/error.middleware.js";

export const app = express();

app.use(express.json());

app.use("/api/blocks", blockRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/workspaces", workspaceRoutes);

app.use(errorHandler);