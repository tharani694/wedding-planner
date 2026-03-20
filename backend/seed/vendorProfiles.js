import mongoose from "mongoose";
import dotenv from "dotenv";
import VendorProfile from "../models/VendorProfile.js";

dotenv.config();

const PROFILES = [
  { name: "Elite Photography", categoryName: "Photography", price: 25000, rating: 4.8, tags: ["premium", "outdoor", "cinematic"], description: "Luxury wedding photography with cinematic films" },
  { name: "Royal Caterers", categoryName: "Catering", price: 800, rating: 4.3, tags: ["veg", "buffet", "budget"], description: "Affordable catering for large Indian weddings" },
  { name: "Dream Decorators", categoryName: "Decor", price: 15000, rating: 4.6, tags: ["stage", "mandap", "floral"], description: "Beautiful wedding stage and decor setups" },
  { name: "Melody Beats DJ", categoryName: "Entertainment", price: 8000, rating: 4.5, tags: ["dj", "live-music", "sound"], description: "Professional DJ and live music for weddings" },
  { name: "Bridal Bliss Makeup", categoryName: "Beauty", price: 12000, rating: 4.9, tags: ["bridal", "airbrush", "HD"], description: "Expert bridal makeup and hair styling" },
  { name: "Golden Frames Video", categoryName: "Videography", price: 18000, rating: 4.7, tags: ["4K", "drone", "highlights"], description: "Cinematic wedding films with drone shots" },
  { name: "Tasty Treats Catering", categoryName: "Catering", price: 500, rating: 4.1, tags: ["veg", "non-veg", "live-counter"], description: "Traditional and fusion cuisines for all budgets" },
  { name: "Flower Power Decor", categoryName: "Decor", price: 20000, rating: 4.8, tags: ["floral", "luxury", "fresh-flowers"], description: "Premium floral decorations and arrangements" },
  { name: "Shutter Stories", categoryName: "Photography", price: 18000, rating: 4.6, tags: ["candid", "portrait", "budget"], description: "Candid and portrait photography at great prices" },
  { name: "Rhythm & Beats Band", categoryName: "Entertainment", price: 35000, rating: 4.7, tags: ["live-band", "bollywood", "classical"], description: "Live band performing Bollywood, classical and folk" },
  { name: "Glow & Go Salon", categoryName: "Beauty", price: 8000, rating: 4.4, tags: ["bridal", "mehndi", "spa"], description: "Complete bridal grooming package including mehndi" },
  { name: "Luxe Tent House", categoryName: "Venue Setup", price: 50000, rating: 4.5, tags: ["tent", "lighting", "chairs"], description: "Complete tent, lighting and furniture rentals" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await VendorProfile.countDocuments({ isMarketplace: true });
  if (existing > 0) {
    console.log(`Already seeded: ${existing} profiles exist`);
    process.exit(0);
  }
  const docs = PROFILES.map(p => ({ ...p, isMarketplace: true }));
  await VendorProfile.insertMany(docs);
  console.log(`Seeded ${docs.length} marketplace profiles`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
