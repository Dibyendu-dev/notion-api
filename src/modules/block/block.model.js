import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    content: { type: Object },
    parentId: { type: mongoose.Types.ObjectId, default: null },
    children: [{ type: mongoose.Types.ObjectId }],
    path: { type: String, index: true }, // IMPORTANT optimization
    createdBy: { type: mongoose.Types.ObjectId }
  },
  { timestamps: true }
);

export const Block = mongoose.model("Block", blockSchema);