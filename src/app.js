import express from "express";
import blockRoutes from "./modules/block/block.routes";
import pageRoutes from "./modules/page/page.routes";
import workspaceRoutes from "./modules/workspace/workspace.routes";

export const app = express();

app.use(express.json());

app.use("/api/blocks", blockRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/workspaces", workspaceRoutes);