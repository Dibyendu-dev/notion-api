import { Request, Response } from "express";
import * as pageService from "./page.service";

export const createPage = async (req, res) => {
  try {
    const page = await pageService.createPage({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPage = async (req, res) => {
  try {
    const page = await pageService.getPage(req.params.id);
    res.json(page);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getFullPage = async (req, res) => {
  try {
    const page = await pageService.getFullPage(req.params.id);
    res.json(page);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    await pageService.deletePage(req.params.id);
    res.json({ message: "Page deleted" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
