import Guest from "../models/Guest.js";
import SubEvent from "../models/SubEvent.js";
export default {
  Query: {
    guests: async (_, { subEventId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const filter = { userId: user._id };
      if (subEventId) filter.subEventId = subEventId;
      return await Guest.find(filter);
    },
  },
  Mutation: {
    addGuest: async (_, { subEventId, input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      if (subEventId) {
        const sub = await SubEvent.findOne({ _id: subEventId, userId: user._id });
        if (!sub) throw new Error("SubEvent not found");
      }
      return await Guest.create({ ...input, subEventId: subEventId || null, userId: user._id });
    },
    deleteGuest: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      await Guest.findOneAndDelete({ _id: id, userId: user._id });
      return true;
    },
    updateGuest: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const { id, ...updates } = input;
      const updated = await Guest.findOneAndUpdate({ _id: id, userId: user._id }, updates, { new: true });
      if (!updated) throw new Error("Guest not found");
      return updated;
    },
  },
};