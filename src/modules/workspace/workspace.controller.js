import * as workspaceService from "./workspace.service.js";
import { BadRequestError } from "../../common/errors/base.error.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.createWorkspace({
      name: req.body.name,
      ownerId: req.user.id
    });

    res.status(201).json(workspace);
  } catch (error) {
    next(error);
  }
};

export const getMyWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getUserWorkspaces(
      req.user.id
    );

    res.json(workspaces);
  } catch (error) {
    next(error);
  }
};
