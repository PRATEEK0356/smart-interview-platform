import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware - 10MB limit for base64 JPG profile photos
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Smart Interview Prep Platform API',
    status: 'online',
    message: 'Backend server is running smoothly.',
    healthCheck: '/health',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`[Express Server] Running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('[Express Server] Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
