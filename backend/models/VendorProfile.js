import mongoose from "mongoose";

const vendorProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryName: { type: String },
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    tags: [String],
    description: String,
    isMarketplace: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("VendorProfile", vendorProfileSchema, "vendorProfiles");