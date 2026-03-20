import VendorProfile from "../models/VendorProfile.js";
import Vendor from "../models/Vendor.js";

const MARKETPLACE_PROFILES = [
  { id: "1", name: "Elite Photography", categoryName: "Photography", price: 25000, rating: 4.8, tags: ["premium", "outdoor", "cinematic"], description: "Luxury wedding photography with cinematic films" },
  { id: "2", name: "Royal Caterers", categoryName: "Catering", price: 800, rating: 4.3, tags: ["veg", "buffet", "budget"], description: "Affordable catering for large weddings" },
  { id: "3", name: "Dream Decorators", categoryName: "Decor", price: 15000, rating: 4.6, tags: ["stage", "mandap", "floral"], description: "Beautiful wedding stage and decor setups" },
  { id: "4", name: "Melody Beats DJ", categoryName: "Entertainment", price: 8000, rating: 4.5, tags: ["dj", "live-music", "sound"], description: "Professional DJ and live music for weddings" },
  { id: "5", name: "Bridal Bliss Makeup", categoryName: "Beauty", price: 12000, rating: 4.9, tags: ["bridal", "airbrush", "HD"], description: "Expert bridal makeup and hair styling" },
  { id: "6", name: "Golden Frames Video", categoryName: "Videography", price: 18000, rating: 4.7, tags: ["4K", "drone", "highlights"], description: "Cinematic wedding films with drone shots" },
  { id: "7", name: "Tasty Treats Catering", categoryName: "Catering", price: 500, rating: 4.1, tags: ["veg", "non-veg", "live-counter"], description: "Traditional and fusion cuisines for all budgets" },
  { id: "8", name: "Flower Power Decor", categoryName: "Decor", price: 20000, rating: 4.8, tags: ["floral", "luxury", "fresh-flowers"], description: "Premium floral decorations and arrangements" },
];

export default {
  Query: {
    vendorProfiles: async () => MARKETPLACE_PROFILES,
  },
  Mutation: {
    addVendorFromProfile: async (_, { profileId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const profile = MARKETPLACE_PROFILES.find((p) => p.id === profileId);
      if (!profile) throw new Error("Profile not found");
      const exists = await Vendor.findOne({ name: profile.name, userId: user._id });
      if (exists) throw new Error("Vendor already added");
      return await Vendor.create({
        name: profile.name,
        price: profile.price,
        userId: user._id,
        status: "lead",
      });
    },
  },
};
