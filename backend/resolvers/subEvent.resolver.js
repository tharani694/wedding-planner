import SubEvent from "../models/SubEvent.js";
import Guest from "../models/Guest.js";
import Vendor from "../models/Vendor.js";
import Budget from "../models/Budget.js";

export default {
  Query: {
    subEvents: async (_, { eventId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await SubEvent.find({ eventId, userId: user._id });
    },
  },
  Mutation: {
    deleteSubEvent: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const sub = await SubEvent.findOneAndDelete({ _id: id, userId: user._id });
      if (!sub) throw new Error("SubEvent not found");
      await Guest.deleteMany({ subEventId: id, userId: user._id });
      await Vendor.deleteMany({ subEventId: id, userId: user._id });
      await Budget.deleteMany({ subEventId: id, userId: user._id });
      return "SubEvent deleted";
    },
  },
  SubEvent: {
    budget: async (parent) => await Budget.findOne({ subEventId: parent._id }),
    guests: async (parent) => await Guest.find({ subEventId: parent._id }),
    vendors: async (parent) => await Vendor.find({ subEventId: parent._id }),
  },
};