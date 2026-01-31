import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string;
  keyGenerator?: (req: Request) => string;
}

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = "Too many requests, please try again later.",
    keyGenerator,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Generate key based on IP address or custom key generator
    const key = keyGenerator
      ? keyGenerator(req)
      : req.ip || req.socket.remoteAddress || "unknown";

    const now = Date.now();
    const record = store[key];

    // Create new record if doesn't exist or window expired
    if (!record || record.resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    // Increment count
    record.count++;

    // Check if limit exceeded
    if (record.count > max) {
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }

    // Add remaining requests to response header
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", max - record.count);
    res.setHeader("X-RateLimit-Reset", record.resetTime);

    next();
  };
}

// Cleanup old entries every hour
setInterval(
  () => {
    const now = Date.now();
    for (const key in store) {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    }
  },
  60 * 60 * 1000,
);
