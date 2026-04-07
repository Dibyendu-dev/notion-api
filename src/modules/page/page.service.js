import { Page } from "./page.model.js";
import { Block } from "../block/block.model.js";
import { NotFoundError, BadRequestError } from "../../common/errors/base.error.js";
import { cacheService } from "../../infrastructure/cache/cache.service.js";

export const createPage = async (data) => {
  if (!data.workspaceId) {
    throw new BadRequestError("workspaceId is required");
  }

  const root = await Block.create({ type: "page", content: {}, path: "" });

  return Page.create({
    ...data,
    rootBlockId: root._id
  });
};

export const getPage = async (pageId) => {
  const page = await Page.findById(pageId);
  if (!page) throw new NotFoundError("Page not found");
  return page;
};

export const getFullPage = async (pageId) => {
  const page = await Page.findById(pageId);

  if (!page) throw new NotFoundError("Page not found");

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

  if (!page) throw new NotFoundError("Page not found");

  await Block.deleteMany({
    $or: [
      { _id: page.rootBlockId },
      { path: { $regex: `^${page.rootBlockId}` } }
    ]
  });

  await Page.findByIdAndDelete(pageId);

  await cacheService.del(`page:${pageId}`);
};

export const getPageCached = async (id) => {
  const cacheKey = `page:${id}`;

  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const page = await Page.findById(id);
  if (!page) throw new NotFoundError("Page not found");

  await cacheService.set(cacheKey, page);

  return page;
};
