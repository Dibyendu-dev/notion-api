import { Workspace } from "./workspace.model";

export const createWorkspace = async (data) => {
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

export const getUserWorkspaces = async (userId ) => {
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
  
  if (!workspace) throw new Error("Workspace not found");
  
  const existingMember = workspace.members.find(
    (m) => m.userId.toString() === userId
  );
  
  if (existingMember) {
    throw new Error("User is already a member of this workspace");
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