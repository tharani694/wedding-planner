import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phone: String,

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BudgetCategory"
    },

    price: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["lead", "booked", "paid", "cancelled"],
      default: "lead"
    },

    subEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);