import { envConfigs } from "@/config/envConfig";
import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    const MONGO_URI = envConfigs.database_url;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI not set in environment variables");
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected Successfully");
  } catch (err: any) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectMongoDb;