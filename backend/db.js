// ===============================
// DB.JS
// ===============================

import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/expenseAI";

// ===============================
// CONNECT MONGODB
// ===============================

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    process.exit(1);
  }
};