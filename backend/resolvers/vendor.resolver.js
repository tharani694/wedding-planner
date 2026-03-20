import Vendor from "../models/Vendor.js";
import BudgetCategory from "../models/BudgetCategory.js";
import Budget from "../models/Budget.js";
import SubEvent from "../models/SubEvent.js";
async function syncBudgetSpent(subEventId, userId) {
  if (!subEventId) return;
  const budget = await Budget.findOne({ subEventId, userId });
  if (!budget) return;
  const bookedVendors = await Vendor.find({
    subEventId,
    userId,
    status: { $in: ["booked", "paid"] },
  });
  const totalSpent = bookedVendors.reduce((s, v) => s + (v.price || 0), 0);
  budget.spent = totalSpent;
  await budget.save();
  const categories = await BudgetCategory.find({ budgetId: budget._id, userId });
  for (const cat of categories) {
    const catVendors = await Vendor.find({
      subEventId,
      userId,
      categoryId: cat._id,
      status: { $in: ["booked", "paid"] },
    });
    cat.spent = catVendors.reduce((s, v) => s + (v.price || 0), 0);
    await cat.save();
  }
}

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
      return await Vendor.create({
        ...input,
        subEventId: subEventId || null,
        userId: user._id,
        status: "lead",
      });
    },

    updateVendor: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const { id, status, categoryId } = input;
      const vendor = await Vendor.findOne({ _id: id, userId: user._id });
      if (!vendor) throw new Error("Vendor not found");

      if (categoryId) vendor.categoryId = categoryId;
      vendor.status = status;
      await vendor.save();

      // Recompute entire budget for this subEvent from scratch — no partial math errors
      await syncBudgetSpent(vendor.subEventId, user._id);

      return vendor;
    },

    deleteVendor: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const vendor = await Vendor.findOne({ _id: id, userId: user._id });
      if (!vendor) throw new Error("Vendor not found");
      const subEventId = vendor.subEventId;
      await Vendor.deleteOne({ _id: id });
      await syncBudgetSpent(subEventId, user._id);
      return true;
    },
  },
};