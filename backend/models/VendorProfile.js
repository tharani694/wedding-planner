import mongoose from "mongoose";

const vendorProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    categoryName: {
      type: String
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BudgetCategory"
    },

    price: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number
    },

    tags: [String],

    description: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("VendorProfile", vendorProfileSchema, "vendorProfiles");