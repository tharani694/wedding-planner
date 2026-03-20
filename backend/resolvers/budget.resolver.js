import Budget from "../models/Budget.js";
import BudgetCategory from "../models/BudgetCategory.js";
import SubEvent from "../models/SubEvent.js";

export default {
  Query: {
    budget: async (_, { subEventId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      if (subEventId) return await Budget.findOne({ subEventId, userId: user._id });
      // Return first budget or create one
      let b = await Budget.findOne({ userId: user._id });
      if (!b) b = await Budget.create({ userId: user._id });
      return b;
    },
  },
  Mutation: {
    addBudgetCategory: async (_, { budgetId, name, allocated }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const budget = await Budget.findOne({ _id: budgetId, userId: user._id });
      if (!budget) throw new Error("Budget not found");
      return await BudgetCategory.create({ budgetId, name, allocated: allocated || 0, spent: 0, userId: user._id });
    },
    updateBudgetCategory: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const { id, ...updates } = input;
      return await BudgetCategory.findOneAndUpdate({ _id: id, userId: user._id }, updates, { new: true });
    },
    deleteBudgetCategory: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await BudgetCategory.findOneAndDelete({ _id: id, userId: user._id });
    },
    updateBudgetTotal: async (_, { total }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      let b = await Budget.findOne({ userId: user._id });
      if (!b) b = await Budget.create({ userId: user._id });
      b.total = total;
      await b.save();
      return b;
    },
  },
  Budget: {
    categories: async (parent, _, { user }) => {
      return await BudgetCategory.find({ budgetId: parent._id, userId: parent.userId || user?._id });
    },
  },
};