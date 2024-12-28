// lib/mongodb.js
import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;

  const dbUri = process.env.MONGO_URI;
  await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
};

export { connectToDatabase };
