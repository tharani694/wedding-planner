import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    dueDate: { type: String },
    completed: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ChecklistItem", checklistItemSchema);