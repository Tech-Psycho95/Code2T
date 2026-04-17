import express from 'express';
import cors from 'cors';
import { config } from './config';
import { initQdrant } from './services/qdrant.service';
import webhookRoutes from './routes/webhook';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/', webhookRoutes);

// Initialize and start server
const startServer = async () => {
  try {
    // Initialize Qdrant connection
    await initQdrant();

    // Start Express server
    app.listen(config.PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║   🎤 Voice-Native Developer Experience Agent              ║
║                                                            ║
║   Server running on http://localhost:${config.PORT}               ║
║   Environment: ${config.NODE_ENV}                          ║
║                                                            ║
║   Endpoints:                                               ║
║   POST /webhook/vapi     - Vapi voice webhook             ║
║   POST /api/query        - REST query endpoint             ║
║   GET  /health           - Health check                   ║
║                                                            ║
║   Next: seed Qdrant with 'npm run seed'                   ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  process.exit(0);
});
