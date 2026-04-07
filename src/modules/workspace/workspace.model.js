import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  ownerId: mongoose.Types.ObjectId,
  members: [
    {
      userId: mongoose.Types.ObjectId,
      role: {
        type: String,
        enum: ["admin", "editor", "viewer"],
        default: "viewer"
      }
    }
  ]
});

export const Workspace = mongoose.model("Workspace", schema);