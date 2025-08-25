import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    console.log("✅ Connection Host :: ", connection.host);
  } catch (error) {
    console.error("⚠️ Error while connecting to database ::", error);
    process.exit(1);
  }
};
