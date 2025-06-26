import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes wait after attempt block
  max: 5, // A user can make 5 login/register attempt
  handler: (_req, res) => {
    res.status(429).json({
      message: 'Too many login attempts',
      details: 'Please try again after 15 minutes',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for todo routes
export const todoLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  handler: (_req, res) => {
    res.status(429).json({
      message: 'Too many requests',
      details: 'Please try again later',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for general API routes
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  handler: (_req, res) => {
    res.status(429).json({
      message: 'Too many requests',
      details: 'Please try again later',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
