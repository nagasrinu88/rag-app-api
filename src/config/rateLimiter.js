const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  // Basic options
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later',
  
  // Advanced options
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests (default)
  skipFailedRequests: false, // Count failed requests (default)
  keyGenerator: (req) => req.ip, // How to identify users
  handler: (req, res) => {       // Custom response handler
    res.status(429).json({ 
      error: 'Custom rate limit message',
      retryAfter: req.rateLimit.resetTime.getTime() - Date.now() 
    });
  }
});