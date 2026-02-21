import Guest from "../models/Guest.js";
import SubEvent from "../models/SubEvent.js";
import mongoose from "mongoose";
const TEMP_USER_ID = new mongoose.Types.ObjectId("65f000000000000000000001");

export default {
    Query: {
      guests: async (_, { subEventId }, { user }) => {
        // if (!user) throw new Error("Unauthorized");
        return await Guest.find({
          subEventId,
          userId: TEMP_USER_ID
        });
      }
    },
    Mutation: {
      addGuest: async (_, { subEventId, input }, { user }) => {

        // if (!user) throw new Error("Unauthorized");
        const subEvent = await SubEvent.findOne({
          _id: subEventId,
          userId: TEMP_USER_ID
        });
  
        if (!subEvent) throw new Error("SubEvent not found");
        const guest = new Guest({
          ...input,
          subEventId,
          userId: TEMP_USER_ID
        });
  
        return await guest.save();
      },

    deleteGuest: async (_, { id }, { user }) => {
      // if (!user) throw new Error("Unauthorized");
      const deleted = await Guest.findOneAndDelete({
        _id: id,
        userId: TEMP_USER_ID
      });
      if (!deleted) throw new Error("Guest not found");
      return true;
    },
  
    updateGuest: async (_, { input }, { user }) => {
      // if (!user) throw new Error("Unauthorized");
      const { id, ...updates } = input;

      const updatedGuest = await Guest.findOneAndUpdate(
        { _id: id, userId: TEMP_USER_ID },
        updates,
        { new: true }
      );
      if (!updatedGuest) {
        throw new Error("Guest not found");
      }
      return updatedGuest;
    }
    }
  }
