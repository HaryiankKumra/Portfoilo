import mongoose from 'mongoose';

const connectToDatabase = async () => {
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Establishes a connection to the MongoDB database using the URI provided
 * in the environment variable MONGO_URI. If the connection is already
 * established, it returns immediately.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @throws {Error} Throws an error if the connection fails.
 */

/******  89a80ac1-4783-4824-9897-6012d0779b8e  *******/  // If already connected, skip reconnection
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  const dbUri = process.env.MONGO_URI;

  try {
    await mongoose.connect(dbUri); // No need for deprecated options anymore.
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to the database');
  }
};

export { connectToDatabase };
