// Main Express Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializePool, closePool } = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AI Meeting Intelligence API is running' });
});

// API Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database connection pool...');
    await initializePool();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nTerminating gracefully...');
  await closePool();
  process.exit(0);
});

startServer();
