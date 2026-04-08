import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  ownerId: String,
  members: [
    {
      userId: String,
      role: {
        type: String,
        enum: ["admin", "editor", "viewer"],
        default: "viewer"
      }
    }
  ]
});

export const Workspace = mongoose.model("Workspace", schema);