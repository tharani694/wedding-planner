import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    subEventId: { type: mongoose.Schema.Types.ObjectId, ref: "SubEvent" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);