import mongoose from 'mongoose';

const connectToDatabase = async () => {
  // If already connected, skip reconnection
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  const dbUri = process.env.MONGO_URI;  // Ensure this is set in your environment variables

  try {
    await mongoose.connect(dbUri);  // Automatically handles URI options
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to the database');
  }
};

export { connectToDatabase };
