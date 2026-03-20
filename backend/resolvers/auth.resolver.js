import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";

export default {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return user;
    },
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already in use");
      const user = await User.create({ name, email, password });
      const token = signToken(user._id);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid email or password");
      if (!user.password) throw new Error("Please use Google to sign in");
      const ok = await user.comparePassword(password);
      if (!ok) throw new Error("Invalid email or password");
      const token = signToken(user._id);
      return { token, user };
    },

    updateProfile: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const updated = await User.findByIdAndUpdate(
        user._id,
        { ...input },
        { new: true }
      );
      return updated;
    },
  },
};