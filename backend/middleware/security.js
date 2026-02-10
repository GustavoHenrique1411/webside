const helmet = require('helmet');

/**
 * Security middleware configuration using Helmet
 * Helmet helps secure Express apps by setting various HTTP headers
 */

// Basic helmet configuration for development
const developmentConfig = helmet({
  contentSecurityPolicy: false, // Disable CSP in development for easier debugging
  crossOriginEmbedderPolicy: false,
});

// Production helmet configuration with stricter security
const productionConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

/**
 * Get helmet configuration based on environment
 */
const getHelmetConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const helmetEnabled = process.env.ENABLE_HELMET !== 'false';

  if (!helmetEnabled) {
    console.log('⚠️  Helmet security headers are disabled');
    return (req, res, next) => next();
  }

  if (isProduction) {
    console.log('✓ Using production security headers (Helmet)');
    return productionConfig;
  } else {
    console.log('✓ Using development security headers (Helmet)');
    return developmentConfig;
  }
};

/**
 * Additional security headers middleware
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent caching of sensitive data
  if (req.path.includes('/api/auth') || req.path.includes('/api/profile')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

/**
 * HTTPS redirect middleware (for production)
 */
const httpsRedirect = (req, res, next) => {
  const forceHttps = process.env.FORCE_HTTPS === 'true';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (forceHttps && isProduction && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.header('host')}${req.url}`);
  }
  
  next();
};

/**
 * Security logging middleware
 */
const securityLogger = (req, res, next) => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /(\.\.|\/etc\/|\/proc\/|\/sys\/)/i, // Path traversal
    /(union.*select|insert.*into|drop.*table)/i, // SQL injection
    /(<script|javascript:|onerror=|onload=)/i, // XSS
    /(eval\(|exec\(|system\()/i, // Code injection
  ];
  
  const url = (req.url || '').toLowerCase();
  const body = JSON.stringify(req.body || {}).toLowerCase();
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(body)) {
      console.warn('⚠️  Suspicious request detected:', {
        ip: req.ip,
        method: req.method,
        url: req.url,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });
      break;
    }
  }
  
  next();
};

module.exports = {
  getHelmetConfig,
  additionalSecurityHeaders,
  httpsRedirect,
  securityLogger
};
