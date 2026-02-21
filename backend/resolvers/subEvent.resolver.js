import SubEvent from "../models/SubEvent.js";
import Guest from "../models/Guest.js";
import Vendor from "../models/Vendor.js";
import Budget from "../models/Budget.js";
import BudgetCategory from "../models/BudgetCategory.js";
import mongoose from "mongoose";
const TEMP_USER_ID = new mongoose.Types.ObjectId("65f000000000000000000001");

export default {
  Query: {
    subEvents: async (_, { eventId }) => {
    //   if (!user) throw new Error("Unauthorized");
    console.log("Fetching sub-events for eventId:", eventId);
      return await SubEvent.find({
        eventId,
        userId: TEMP_USER_ID
      });
    }
  },

  Mutation: {

    createSubEvent: async (_, { eventId, name }, { user }) => {
    //   if (!user) throw new Error("Unauthorized");
      const subEvent = new SubEvent({
        name,
        eventId,
        userId: TEMP_USER_ID
      });
      const savedSubEvent = await subEvent.save();
    //   const budget = new Budget({
    //     subEventId: subEvent._id,
    //     userId: TEMP_USER_ID
    //   });
    //   await budget.save()
      return savedSubEvent;
    },

    deleteSubEvent: async (_, { id }, { user }) => {
    //   if (!user) throw new Error("Unauthorized");
      await Guest.deleteMany({ subEventId: id, userId: TEMP_USER_ID });
      await Vendor.deleteMany({ subEventId: id, userId: TEMP_USER_ID });

      const budget = await Budget.findOne({
        subEventId: id,
        userId: TEMP_USER_ID
      });
      
      if (budget) {
        await BudgetCategory.deleteMany({
          budgetId: budget._id,
          userId: TEMP_USER_ID
        });
      
        await Budget.deleteOne({
          _id: budget._id,
          userId: TEMP_USER_ID
        });
      }

      await SubEvent.deleteOne({
        _id: id,
        userId: TEMP_USER_ID
      });

      return true;
    }

  },

  SubEvent: {
    budget: async (parent, _, { user }) => {
        // if (!user) throw new Error("Unauthorized");
        return await Budget.findOne({
          subEventId: parent._id,
          userId: TEMP_USER_ID
        });
    },
    guests: async (parent, _, { user }) => {
    // if (!user) throw new Error("Unauthorized");
      return await Guest.find({
        subEventId: parent._id,
        userId: TEMP_USER_ID
      });
    },

    vendors: async (parent, _, { user }) => {
        // if (!user) throw new Error("Unauthorized");
      return await Vendor.find({
        subEventId: parent._id,
        userId: TEMP_USER_ID
      });
    }
  }
};
