import VendorProfile from "../models/VendorProfile.js";
import Vendor from "../models/Vendor.js";

export default {
  Query: {
    vendorProfiles: async () => {
      const profiles = await VendorProfile.find({ isMarketplace: true }).lean();
      // Map _id to id for GraphQL
      return profiles.map(p => ({ ...p, id: p._id.toString() }));
    },
  },
  Mutation: {
    addVendorFromProfile: async (_, { profileId, subEventId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const profile = await VendorProfile.findById(profileId);
      if (!profile) throw new Error("Profile not found");
      const exists = await Vendor.findOne({
        name: profile.name,
        userId: user._id,
        subEventId: subEventId || null,
      });
      if (exists) throw new Error(`${profile.name} is already added to this sub-event`);
      return await Vendor.create({
        name: profile.name,
        price: profile.price,
        userId: user._id,
        subEventId: subEventId || null,
        status: "lead",
      });
    },
  },
};