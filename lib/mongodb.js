import mongoose from 'mongoose';

let cached = global.mongo || {};  // Caching the connection globally

// For development, make sure we don't reuse a cached connection across server restarts
if (process.env.NODE_ENV === 'development') {
  global.mongo = cached;
}

const connectToDatabase = async () => {
  // Reuse the cached connection if it already exists
  if (cached.conn) {
    console.log('Reusing existing MongoDB connection');
    return cached.conn;
  }

  // If no cached connection exists, create a new one
  const dbUri = process.env.MONGO_URI; // Ensure the MongoDB URI is set in environment variables

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, // Avoid deprecated warnings
    };

    // Connect to MongoDB and cache the connection
    const conn = await mongoose.connect(dbUri, options);
    cached.conn = conn;
    console.log('Successfully connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to the database');
  }
};

export { connectToDatabase };
