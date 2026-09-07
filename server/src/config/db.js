import mongoose from 'mongoose';
import { config } from './env.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  if (config.mongoUri) {
    try {
      console.log(`Connecting to MongoDB Atlas at ${config.mongoUri.replace(/:([^@]+)@/, ':****@')}...`);
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('MongoDB connected successfully.');
      return;
    } catch (err) {
      console.error(`[MongoDB Error] Connection failed: ${err.message}`);
      if (config.nodeEnv === 'production') {
        console.error('CRITICAL: Check MONGO_URI in Render Environment Variables. Make sure username, password, and IP 0.0.0.0/0 permissions are set in MongoDB Atlas.');
        process.exit(1);
      }
      console.warn('Falling back to local in-memory MongoDB for local development...');
    }
  }

  // Only use MongoMemoryServer in local development (not production)
  if (config.nodeEnv !== 'production') {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      console.log('Starting in-memory MongoDB server for local development...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`In-memory MongoDB connected successfully at ${uri}`);
    } catch (error) {
      console.error('In-memory MongoDB failed to start:', error.message);
      process.exit(1);
    }
  } else {
    console.error('CRITICAL: MONGO_URI environment variable is required in production.');
    process.exit(1);
  }
};
