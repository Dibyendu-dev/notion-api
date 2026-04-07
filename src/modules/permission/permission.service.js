import { Workspace } from "../workspace/workspace.model";

const ROLE_PERMISSIONS = {
  admin: ["read", "write", "delete", "share"],
  editor: ["read", "write"],
  viewer: ["read"]
};

export const hasPermission = async ({ userId, workspaceId, action }) => {
  const ws = await Workspace.findOne({
    _id: workspaceId,
    "members.userId": userId
  });

  if (!ws) return false;

  const member = ws.members.find(
    (m) => m.userId.toString() === userId
  );

  if (!member) return false;

  return ROLE_PERMISSIONS[member.role]?.includes(action) ?? false;
};