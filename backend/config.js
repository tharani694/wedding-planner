import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is not set in your .env file!");
    console.error("   Create backend/.env and add: MONGO_URI=mongodb+srv://...");
    process.exit(1);
  }

  if (uri.includes("localhost") || uri.includes("127.0.0.1")) {
    console.warn("⚠️  Using local MongoDB. Make sure mongod is running.");
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Fail fast with clear error
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    if (error.message.includes("ECONNREFUSED")) {
      console.error("   → Is your Atlas cluster running? Check cloud.mongodb.com");
    }
    if (error.message.includes("Authentication failed")) {
      console.error("   → Wrong username/password in MONGO_URI");
    }
    if (error.message.includes("IP")) {
      console.error("   → Your IP isn't whitelisted. Go to Atlas → Network Access → Add 0.0.0.0/0");
    }
    process.exit(1);
  }
};

export default connectDB;