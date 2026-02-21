import Event from "../models/Event.js";
import SubEvent from "../models/SubEvent.js";
import Budget from "../models/Budget.js";
import BudgetCategory from "../models/BudgetCategory.js";
import mongoose from "mongoose";
const TEMP_USER_ID = new mongoose.Types.ObjectId("65f000000000000000000001");


export default {
    Query: {
        events: async (_, __, { user }) => {
            // if (!user) throw new Error("Unauthorized");
            return await Event.find({ userId: TEMP_USER_ID });
        },
        event: async (_, { id }, {user}) => {
            // if (!user) throw new Error("Unauthorized");
            return await Event.findOne({
              _id: id,
              userId: TEMP_USER_ID
            });
        }
    },
    Mutation: {
        createEvent: async (_, { name, type }, { user }) => {
            // console.log("USER:", user);
            // if (!user) throw new Error("Unauthorized");
            const event = new Event({
              name,
              type,
              userId: TEMP_USER_ID
            });
            return await event.save();
        },

        deleteEvent: async (_, { id }, {user}) => {
            // if (!user) throw new Error("Unauthorized");
            const deleted = await Event.findOneAndDelete({
              _id: id,
              userId: TEMP_USER_ID
            });
      
            if (!deleted) throw new Error("Event not found");
      
            return "Event deleted successfully";
        },

        createSubEvent: async (_, { eventId, name, date }, { user }) => {
            // if (!user) throw new Error("Unauthorized");
            const event = await Event.findOne({
              _id: eventId,
              userId: TEMP_USER_ID
            });
          
            if (!event) throw new Error("Event not found");
          
            const subEvent = new SubEvent({
              name,
              date,
              eventId,
              userId: TEMP_USER_ID
            });
            return await subEvent.save();
        }
    },

    Event: {
        subEvents: async (parent) => {
            // if (!user) throw new Error("Unauthorized");
            return await SubEvent.find({
              eventId: parent._id,
              userId: TEMP_USER_ID
            });
          },
          totalBudget: async (parent, _, { user }) => {
            // if (!user) throw new Error("Unauthorized");
            const subEvents = await SubEvent.find({
              eventId: parent._id,
              userId: TEMP_USER_ID
            });
        
            const budgets = await Budget.find({
              subEventId: { $in: subEvents.map(s => s._id) },
              userId: TEMP_USER_ID
            });
        
            const categories = await BudgetCategory.find({
              budgetId: { $in: budgets.map(b => b._id) },
              userId: TEMP_USER_ID
            });
        
            return categories.reduce((sum, c) => sum + (c.allocated || 0), 0);
          } 
    }
}
