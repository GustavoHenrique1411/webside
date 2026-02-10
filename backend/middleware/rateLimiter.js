const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Muitas requisições deste IP, por favor tente novamente mais tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for certain IPs (optional)
  skip: (req) => {
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' && req.ip === '::1') {
      return true;
    }
    return false;
  },
  // Key generator is handled automatically by express-rate-limit
  // No need for custom keyGenerator to avoid IPv6 issues
  // Handler for when rate limit is exceeded
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Muitas requisições deste IP, por favor tente novamente mais tarde.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Stricter rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    error: 'Muitas tentativas de login. Por favor, tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  // Key generator is handled automatically
  handler: (req, res) => {
    console.warn(`Auth rate limit exceeded for IP: ${req.ip}, Email: ${req.body.email || 'N/A'}`);
    res.status(429).json({
      error: 'Muitas tentativas de login. Por favor, tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiter for password reset endpoints
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    error: 'Muitas tentativas de redefinição de senha. Por favor, tente novamente em 1 hora.',
    retryAfter: '1 hora'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Password reset rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Muitas tentativas de redefinição de senha. Por favor, tente novamente em 1 hora.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiter for file upload endpoints
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 uploads per windowMs
  message: {
    error: 'Muitos uploads. Por favor, tente novamente mais tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Upload rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Muitos uploads. Por favor, tente novamente mais tarde.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiter for report generation
const reportLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 report generations per minute
  message: {
    error: 'Muitas solicitações de relatórios. Por favor, aguarde um momento.',
    retryAfter: '1 minuto'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Report generation rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Muitas solicitações de relatórios. Por favor, aguarde um momento.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  reportLimiter
};
