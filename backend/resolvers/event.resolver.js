import Event from "../models/Event.js";
import SubEvent from "../models/SubEvent.js";
import Budget from "../models/Budget.js";
import BudgetCategory from "../models/BudgetCategory.js";

export default {
  Query: {
    events: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Event.find({ userId: user._id });
    },
    event: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Event.findOne({ _id: id, userId: user._id });
    },
  },
  Mutation: {
    createEvent: async (_, { name, type }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Event.create({ name, type, userId: user._id });
    },
    deleteEvent: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const deleted = await Event.findOneAndDelete({ _id: id, userId: user._id });
      if (!deleted) throw new Error("Event not found");
      return "Event deleted successfully";
    },
    createSubEvent: async (_, { eventId, name, date }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const ev = await Event.findOne({ _id: eventId, userId: user._id });
      if (!ev) throw new Error("Event not found");
      const sub = await SubEvent.create({ name, date, eventId, userId: user._id });
      await Budget.create({ subEventId: sub._id, userId: user._id });
      return sub;
    },
  },
  Event: {
    subEvents: async (parent) =>
      await SubEvent.find({ eventId: parent._id, userId: parent.userId }),
    totalBudget: async (parent) => {
      const subs = await SubEvent.find({ eventId: parent._id });
      const budgets = await Budget.find({ subEventId: { $in: subs.map((s) => s._id) } });
      const cats = await BudgetCategory.find({ budgetId: { $in: budgets.map((b) => b._id) } });
      return cats.reduce((s, c) => s + (c.allocated || 0), 0);
    },
  },
};