import mongoose from "mongoose";

const budgetCategorySchema = new mongoose.Schema(
  {
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    allocated: {
      type: Number,
      default: 0
    },

    spent: {
      type: Number,
      default: 0
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("BudgetCategory", budgetCategorySchema, "budgetCategory");