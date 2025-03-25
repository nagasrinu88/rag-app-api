// Load environment variables first
import { config } from 'dotenv';
config();

// Import other dependencies after environment variables are loaded
import express from 'express';
import queryRoute from './src/routes/query.js';
import authorizer from './src/config/authorizer.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Apply authorizer middleware to all routes
app.use(authorizer);

// Routes
app.use('/query', queryRoute);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});