import { Page } from "./page.model";
import { Block } from "../block/block.model";

export const createPage = async (data) => {
  const root = await Block.create({ type: "page", content: {}, path: "" });

  return Page.create({
    ...data,
    rootBlockId: root._id
  });
};

export const getPage = async (pageId) => {
  const page = await Page.findById(pageId);
  if (!page) throw new Error("Page not found");
  return page;
};

export const getFullPage = async (pageId) => {
  const page = await Page.findById(pageId);

  if (!page) throw new Error("Page not found");

  const blocks = await Block.find({
    $or: [
      { _id: page.rootBlockId },
      { path: { $regex: `^${page.rootBlockId}` } }
    ]
  });

  return {
    page,
    blocks
  };
};

export const deletePage = async (pageId) => {
  const page = await Page.findById(pageId);

  if (!page) throw new Error("Page not found");

  await Block.deleteMany({
    $or: [
      { _id: page.rootBlockId },
      { path: { $regex: `^${page.rootBlockId}` } }
    ]
  });

  await Page.findByIdAndDelete(pageId);
};