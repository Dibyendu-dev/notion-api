import { Block } from "./block.model.js";
import { NotFoundError, BadRequestError } from "../../common/errors/base.error.js";

export const createBlock = async (data) => {
  if (!data.type) {
    throw new BadRequestError("Block type is required");
  }

  let path = data.path || "";

  if (data.parentId) {
    const parent = await Block.findById(data.parentId);
    if (parent) {
      path = parent.path ? `${parent.path}/${parent._id}` : `${parent._id}`;
    }
  }

  const block = await Block.create({
    ...data,
    path
  });

  if (data.parentId) {
    await Block.findByIdAndUpdate(data.parentId, {
      $push: { children: block._id }
    });
  }

  return block;
};

export const getBlockTree = async (rootId) => {
  const root = await Block.findById(rootId);

  if (!root) throw new NotFoundError("Block not found");

  const children = await Block.find({
    path: { $regex: `^${root.path || root._id}` }
  });

  return children;
};
