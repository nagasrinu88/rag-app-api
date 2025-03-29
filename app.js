// Load environment variables first
import { config } from 'dotenv';
config();

// Import other dependencies after environment variables are loaded
import express from 'express';
import queryRoute from './src/routes/query.js';
import healthcheckRoute from './src/routes/healthcheck.js';
import authorizer from './src/config/authorizer.js';

import rateLimit from 'express-rate-limit';
// const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Apply authorizer middleware to all routes
// app.use(authorizer);

// Defining the rate limiters
app.use('/api/v0/*', rateLimit({
    windowMs: process.env.API_RATE_LIMIT_WINDOW_MS,
    max: process.env.API_RATE_LIMIT_MAX_REQUESTS,
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
    legacyHeaders: false,
    standardHeaders: true,
    message: 'Too many requests, please try again later',
}));

// Routes
// app.use('/query', queryRoute);
app.use('/api/v0/healthcheck', healthcheckRoute);
app.use('/api/v0/query', queryRoute);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});