import { Workspace } from "./workspace.model.js";
import { NotFoundError, BadRequestError } from "../../common/errors/base.error.js";

export const createWorkspace = async (data) => {
  if (!data.name) {
    throw new BadRequestError("Workspace name is required");
  }

  const workspace = await Workspace.create({
    ...data,
    members: [
      {
        userId: data.ownerId,
        role: "admin"
      }
    ]
  });

  return workspace;
};

export const getUserWorkspaces = async (userId) => {
  return Workspace.find({
    "members.userId": userId
  });
};

export const addMember = async (
  workspaceId,
  userId,
  role
) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) throw new NotFoundError("Workspace not found");

  const existingMember = workspace.members.find(
    (m) => m.userId.toString() === userId
  );

  if (existingMember) {
    throw new BadRequestError("User is already a member of this workspace");
  }

  return Workspace.findByIdAndUpdate(
    workspaceId,
    {
      $push: {
        members: { userId, role }
      }
    },
    { new: true }
  );
};

export const removeMember = async (
  workspaceId,
  userId
) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) throw new NotFoundError("Workspace not found");

  return Workspace.findByIdAndUpdate(
    workspaceId,
    {
      $pull: {
        members: { userId }
      }
    },
    { new: true }
  );
};
