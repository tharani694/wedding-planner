import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    subEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
      required: true,
      unique: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema, "budget");