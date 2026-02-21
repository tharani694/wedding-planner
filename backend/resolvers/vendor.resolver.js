import Vendor from "../models/Vendor.js";
import BudgetCategory from "../models/BudgetCategory.js";
import SubEvent from "../models/SubEvent.js";
import mongoose from "mongoose";
const TEMP_USER_ID = new mongoose.Types.ObjectId("65f000000000000000000001");

export default {
  Query: {
    vendors: async (_, { subEventId }, { user }) => {
    //   if (!user) throw new Error("Unauthorized");

      return await Vendor.find({
        subEventId,
        userId: TEMP_USER_ID
      });
    }

  },

  Mutation: {

    addVendor: async (_, { subEventId, input }, { user }) => {
    //   if (!user) throw new Error("Unauthorized");

      const subEvent = await SubEvent.findOne({
        _id: subEventId,
        userId: TEMP_USER_ID
      });

      if (!subEvent) throw new Error("SubEvent not found");

      const vendor = new Vendor({
        ...input,
        subEventId,
        userId: TEMP_USER_ID,
        status: "lead"
      });

      return await vendor.save();
    },

    updateVendor: async (_, { input }, { user }) => {
    //   if (!user) throw new Error("Unauthorized");

      const { id, status } = input;

      const vendor = await Vendor.findOne({
        _id: id,
        userId: TEMP_USER_ID
      });

      if (!vendor) throw new Error("Vendor not found");

      const oldStatus = vendor.status;
      vendor.status = status;

      await vendor.save();

      const category = await BudgetCategory.findOne({
        _id: vendor.categoryId,
        userId: TEMP_USER_ID
      });

      if (category) {
        const wasCounted = ["booked", "paid"].includes(oldStatus);
        const isCounted = ["booked", "paid"].includes(status);

        if (!wasCounted && isCounted) {
        category.spent += Number(vendor.price || 0);
        }

        if (wasCounted && !isCounted) {
        category.spent -= Number(vendor.price || 0);
        }
        await category.save();
      }

      return vendor;
    },

    deleteVendor: async (_, { id }, { user }) => {
    //   if (!user) throw new Error("Unauthorized");

      const vendor = await Vendor.findOne({
        _id: id,
        userId: TEMP_USER_ID
      });

      if (!vendor) throw new Error("Vendor not found");
      if (["booked", "paid"].includes(vendor.status)) {
        const category = await BudgetCategory.findOne({
          _id: vendor.categoryId,
          userId: TEMP_USER_ID
        });

        if (category) {
          category.spent -= Number(vendor.price || 0);
          await category.save();
        }
      }

      await Vendor.deleteOne({
        _id: id,
        userId: TEMP_USER_ID
      });
      return true;
    }
  }
};
