import Vendor from "../models/Vendor.js";
import BudgetCategory from "../models/BudgetCategory.js";
import Budget from "../models/Budget.js";
import SubEvent from "../models/SubEvent.js";

export default {
  Query: {
    vendors: async (_, { subEventId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const filter = { userId: user._id };
      if (subEventId) filter.subEventId = subEventId;
      return await Vendor.find(filter);
    },
  },
  Mutation: {
    addVendor: async (_, { subEventId, input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      if (subEventId) {
        const sub = await SubEvent.findOne({ _id: subEventId, userId: user._id });
        if (!sub) throw new Error("SubEvent not found");
      }
      return await Vendor.create({ ...input, subEventId: subEventId || null, userId: user._id, status: "lead" });
    },
    updateVendor: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const { id, status, categoryId } = input;
      const vendor = await Vendor.findOne({ _id: id, userId: user._id });
      if (!vendor) throw new Error("Vendor not found");

      // Allow assigning a category at update time (for marketplace vendors)
      if (categoryId) vendor.categoryId = categoryId;

      const oldStatus = vendor.status;
      vendor.status = status;
      await vendor.save();

      // Update budget spent if vendor has a categoryId
      const activeCategoryId = vendor.categoryId;
      if (activeCategoryId) {
        const category = await BudgetCategory.findOne({ _id: activeCategoryId, userId: user._id });
        if (category) {
          const wasCounted = ["booked", "paid"].includes(oldStatus);
          const isCounted = ["booked", "paid"].includes(status);
          if (!wasCounted && isCounted) category.spent += Number(vendor.price || 0);
          if (wasCounted && !isCounted) category.spent -= Number(vendor.price || 0);
          await category.save();
        }
      }
      return vendor;
    },
    deleteVendor: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const vendor = await Vendor.findOne({ _id: id, userId: user._id });
      if (!vendor) throw new Error("Vendor not found");
      if (["booked", "paid"].includes(vendor.status) && vendor.categoryId) {
        const cat = await BudgetCategory.findOne({ _id: vendor.categoryId, userId: user._id });
        if (cat) { cat.spent -= Number(vendor.price || 0); await cat.save(); }
      }
      await Vendor.deleteOne({ _id: id });
      return true;
    },
  },
};