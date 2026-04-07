import * as pageService from "./page.service.js";
import { NotFoundError, BadRequestError } from "../../common/errors/base.error.js";

export const createPage = async (req, res, next) => {
  try {
    const page = await pageService.createPage({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(page);
  } catch (error) {
    next(error);
  }
};

export const getPage = async (req, res, next) => {
  try {
    const page = await pageService.getPage(req.params.id);
    if (!page) return next(new NotFoundError("Page not found"));
    res.json(page);
  } catch (error) {
    next(error);
  }
};

export const getFullPage = async (req, res, next) => {
  try {
    const result = await pageService.getFullPage(req.params.id);
    if (!result.page) return next(new NotFoundError("Page not found"));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req, res, next) => {
  try {
    await pageService.deletePage(req.params.id);
    res.json({ message: "Page deleted" });
  } catch (error) {
    next(error);
  }
};
