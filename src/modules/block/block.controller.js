import * as blockService from "./block.service.js";
import { NotFoundError, BadRequestError } from "../../common/errors/base.error.js";

export const createBlock = async (req, res, next) => {
  try {
    const block = await blockService.createBlock({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(block);
  } catch (error) {
    next(error);
  }
};

export const getBlockTree = async (req, res, next) => {
  try {
    const data = await blockService.getBlockTree(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
