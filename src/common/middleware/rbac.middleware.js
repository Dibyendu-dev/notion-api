import { hasPermission } from "../../modules/permission/permission.service.js";
import { ForbiddenError } from "../errors/base.error.js";

export const authorize = (action) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const workspaceId = req.body.workspaceId || req.params.workspaceId;

    if (!workspaceId) {
      return next(new ForbiddenError("Workspace ID required"));
    }

    const allowed = await hasPermission({ userId, workspaceId, action });

    if (!allowed) {
      return next(new ForbiddenError("You do not have permission"));
    }

    next();
  };
};
