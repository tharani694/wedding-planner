import mongoose from "mongoose";

const MARKETPLACE_PROFILES = [
  { name: "Elite Photography", categoryName: "Photography", price: 25000, rating: 4.8, tags: ["premium", "outdoor", "cinematic"], description: "Luxury wedding photography with cinematic films", isMarketplace: true },
  { name: "Royal Caterers", categoryName: "Catering", price: 800, rating: 4.3, tags: ["veg", "buffet", "budget"], description: "Affordable catering for large Indian weddings", isMarketplace: true },
  { name: "Dream Decorators", categoryName: "Decor", price: 15000, rating: 4.6, tags: ["stage", "mandap", "floral"], description: "Beautiful wedding stage and decor setups", isMarketplace: true },
  { name: "Melody Beats DJ", categoryName: "Entertainment", price: 8000, rating: 4.5, tags: ["dj", "live-music", "sound"], description: "Professional DJ and live music for weddings", isMarketplace: true },
  { name: "Bridal Bliss Makeup", categoryName: "Beauty", price: 12000, rating: 4.9, tags: ["bridal", "airbrush", "HD"], description: "Expert bridal makeup and hair styling", isMarketplace: true },
  { name: "Golden Frames Video", categoryName: "Videography", price: 18000, rating: 4.7, tags: ["4K", "drone", "highlights"], description: "Cinematic wedding films with drone shots", isMarketplace: true },
  { name: "Tasty Treats Catering", categoryName: "Catering", price: 500, rating: 4.1, tags: ["veg", "non-veg", "live-counter"], description: "Traditional and fusion cuisines for all budgets", isMarketplace: true },
  { name: "Flower Power Decor", categoryName: "Decor", price: 20000, rating: 4.8, tags: ["floral", "luxury", "fresh-flowers"], description: "Premium floral decorations and arrangements", isMarketplace: true },
  { name: "Shutter Stories", categoryName: "Photography", price: 18000, rating: 4.6, tags: ["candid", "portrait", "budget"], description: "Candid and portrait photography at great prices", isMarketplace: true },
  { name: "Rhythm & Beats Band", categoryName: "Entertainment", price: 35000, rating: 4.7, tags: ["live-band", "bollywood", "classical"], description: "Live band performing Bollywood, classical and folk", isMarketplace: true },
  { name: "Glow & Go Salon", categoryName: "Beauty", price: 8000, rating: 4.4, tags: ["bridal", "mehndi", "spa"], description: "Complete bridal grooming package including mehndi", isMarketplace: true },
  { name: "Luxe Tent House", categoryName: "Venue Setup", price: 50000, rating: 4.5, tags: ["tent", "lighting", "chairs"], description: "Complete tent, lighting and furniture rentals", isMarketplace: true },
];

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is not set in your .env file!");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed marketplace vendor profiles if not already present
    const VendorProfile = (await import("./models/VendorProfile.js")).default;
    const count = await VendorProfile.countDocuments({ isMarketplace: true });
    if (count === 0) {
      await VendorProfile.insertMany(MARKETPLACE_PROFILES);
      console.log(`✅ Seeded ${MARKETPLACE_PROFILES.length} marketplace vendor profiles`);
    } else {
      console.log(`✓ ${count} marketplace profiles ready`);
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;