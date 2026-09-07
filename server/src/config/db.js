import mongoose from 'mongoose';
import { config } from './env.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const isCloudOrProd = config.nodeEnv === 'production' || Boolean(process.env.RENDER) || Boolean(process.env.PORT && process.env.PORT !== '5000');

  if (config.mongoUri) {
    try {
      const sanitizedUri = config.mongoUri.replace(/:([^@]+)@/, ':****@');
      console.log(`Connecting to MongoDB Atlas at ${sanitizedUri}...`);

      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log('MongoDB connected successfully.');
      return;
    } catch (err) {
      console.error(`[MongoDB Error] Connection failed: ${err.message}`);

      if (isCloudOrProd) {
        console.error('================================================================');
        console.error('CRITICAL MONGO_URI AUTHENTICATION ERROR ON DEPLOYMENT:');
        console.error(`Error details: ${err.message}`);
        console.error('1. Check MongoDB Atlas -> "Database Access" -> Verify database username and password.');
        console.error('2. Ensure your connection string includes a database name, e.g.:');
        console.error('   mongodb+srv://<username>:<password>@cluster0.n4vgjvp.mongodb.net/smart_interview?retryWrites=true&w=majority');
        console.error('3. Check MongoDB Atlas -> "Network Access" -> Allow 0.0.0.0/0 (Allow Access From Anywhere).');
        console.error('================================================================');
        process.exit(1);
      }

      console.warn('Falling back to local in-memory MongoDB for local development...');
    }
  }

  // Only use MongoMemoryServer in local development (never on Render or Cloud)
  if (!isCloudOrProd) {
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
    console.error('CRITICAL: MONGO_URI environment variable is invalid or missing in deployment.');
    process.exit(1);
  }
};
