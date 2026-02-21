import Budget from "../models/Budget.js";
import BudgetCategory from "../models/BudgetCategory.js";

export default {
  Query: {
    budget: async (_, { subEventId }, { user }) => {
    if (!user) throw new Error("Unauthorized");

        return await Budget.findOne({
            subEventId,
            userId: user.id
        });
    }
  },
  Budget: {
    categories: async (parent, _, { user }) => {
    if (!user) throw new Error("Unauthorized");
      return await BudgetCategory.find({
        budgetId: parent._id,
        userId:  user.id
      });
    }
  }
};
