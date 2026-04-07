import { Request, Response } from "express";
import * as workspaceService from "./workspace.service";

export const createWorkspace = async (req, res) => {
  try {
    const workspace = await workspaceService.createWorkspace({
      name: req.body.name,
      ownerId: req.user.id
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await workspaceService.getUserWorkspaces(
      req.user.id
    );

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
