import { Request, Response } from "express";
import * as blockService from "./block.service";

export const createBlock = async (req, res) => {
  try {
    const block = await blockService.createBlock({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(block);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBlockTree = async (req, res) => {
  try {
    const data = await blockService.getBlockTree(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
