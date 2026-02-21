import VendorProfile from "../models/VendorProfile.js";
import Vendor from "../models/Vendor.js";
import BudgetCategory from "../models/BudgetCategory.js";
import mongoose from "mongoose";
const TEMP_USER_ID = new mongoose.Types.ObjectId("65f000000000000000000001");

export default {
  Query: {
    vendorProfiles: async (_, __, { user }) => {
      // if (!user) throw new Error("Unauthorized");

      const profiles = await VendorProfile.find({
        userId: TEMP_USER_ID
      });
      return profiles;
    }
  },

  Mutation: {
    seedVendorProfiles: async (_, __, { user }) => {
      // if (!user) throw new Error("Unauthorized");

      const profiles = await VendorProfile.find({
        userId: TEMP_USER_ID
      });

      for (const profile of profiles) {
        if (!profile.categoryId && profile.categoryName) {
          const match = await BudgetCategory.findOne({
            name: new RegExp(`^${profile.categoryName}$`, "i"),
            userId: TEMP_USER_ID
          });

          if (match) {
            profile.categoryId = match._id;
            await profile.save();
          }
        }
      }
      return profiles;
    },

    addVendorFromProfile: async (_, { profileId, subEventId }, { user }) => {
      // if (!user) throw new Error("Unauthorized");

      const profile = await VendorProfile.findOne({
        _id: profileId,
        userId: TEMP_USER_ID
      });

      if (!profile) throw new Error("Profile not found");

      const exists = await Vendor.findOne({
        name: profile.name,
        subEventId,
        userId: TEMP_USER_ID
      });

      if (exists) throw new Error("Vendor already added");

      const vendor = new Vendor({
        name: profile.name,
        categoryId: profile.categoryId,
        price: profile.price,
        subEventId,
        userId: TEMP_USER_ID,
        status: "lead"
      });

      return await vendor.save();
    }
  }
};
