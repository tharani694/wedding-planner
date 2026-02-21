import BudgetCategory from "../models/BudgetCategory.js";
import mongoose from "mongoose";
const TEMP_USER_ID = new mongoose.Types.ObjectId("65f000000000000000000001");


export default {
  Query: {
    budgetCategories: async (_, { budgetId }, { user }) => {
    //   if (!user) throw new Error("Unauthorized");
      return await BudgetCategory.find({
        budgetId,
        userId: TEMP_USER_ID
      });
    }
  },
  Mutation: {
    addBudgetCategory: async (_, { budgetId, name, allocated }, { user }) => {
        // if (!user) throw new Error("Unauthorized");
        if (!name) throw new Error("Name cannot be empty");
  
        const category = new BudgetCategory({
          budgetId,
          userId: TEMP_USER_ID,
          name,
          allocated: Number(allocated || 0),
          spent: 0
        });
  
        return await category.save();
      },
  
      updateBudgetCategory: async (_, { input }, { user }) => {
        // if (!user) throw new Error("Unauthorized");
  
        const { id, name, allocated } = input;
  
        return await BudgetCategory.findOneAndUpdate(
          { _id: id, userId: TEMP_USER_ID },
          {
            ...(name && { name }),
            ...(allocated !== undefined && { allocated: Number(allocated) })
          },
          { new: true }
        );
      },
  
      deleteBudgetCategory: async (_, { id }, { user }) => {
        // if (!user) throw new Error("Unauthorized");
        return await BudgetCategory.findOneAndDelete({
          _id: id,
          userId: TEMP_USER_ID
        });
      }
  }

};
