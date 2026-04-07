import { hasPermission } from "../../modules/permission/permission.service";

export const authorize = (action) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const workspaceId = req.body.workspaceId || req.params.workspaceId;

    const allowed = await hasPermission({ userId, workspaceId, action });

    if (!allowed) return res.status(403).send("Forbidden");

    next();
  };
};