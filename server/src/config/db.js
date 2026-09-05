import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    if (config.mongoUri) {
      try {
        console.log(`Connecting to MongoDB at ${config.mongoUri}...`);
        await mongoose.connect(config.mongoUri, {
          serverSelectionTimeoutMS: 3000
        });
        console.log('MongoDB connected successfully.');
        return;
      } catch (err) {
        console.warn(`Could not connect to configured MONGO_URI: ${err.message}. Falling back to in-memory MongoDB...`);
      }
    }

    console.log('Starting in-memory MongoDB server for local development/testing...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`In-memory MongoDB connected successfully at ${uri}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
