import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback_development_secret_key_123',
  jwtExpire: '7d',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
};
