import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title: String,
  rootBlockId: mongoose.Types.ObjectId,
  workspaceId: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId
});

export const Page = mongoose.model("Page", pageSchema);