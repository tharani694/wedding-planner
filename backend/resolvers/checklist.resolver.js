import ChecklistItem from "../models/ChecklistItem.js";

export default {
  Query: {
    checklistItems: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await ChecklistItem.find({ userId: user._id }).sort({ createdAt: 1 });
    },
  },
  Mutation: {
    addChecklistItem: async (_, { title, category, dueDate }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await ChecklistItem.create({ userId: user._id, title, category, dueDate });
    },
    toggleChecklistItem: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const item = await ChecklistItem.findOne({ _id: id, userId: user._id });
      if (!item) throw new Error("Not found");
      item.completed = !item.completed;
      return await item.save();
    },
    deleteChecklistItem: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      await ChecklistItem.deleteOne({ _id: id, userId: user._id });
      return true;
    },
    bulkAddChecklistItems: async (_, { items }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const docs = items.map((i) => ({ ...i, userId: user._id, aiGenerated: true }));
      return await ChecklistItem.insertMany(docs);
    },
  },
};