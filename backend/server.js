const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import security middleware
const { getHelmetConfig, additionalSecurityHeaders, httpsRedirect, securityLogger } = require('./middleware/security');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const clientesRoutes = require('./routes/clientes');
const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');
const colaboradoresRoutes = require('./routes/colaboradores');
const empresasRoutes = require('./routes/empresas');
const contratosRoutes = require('./routes/contratos');
const faturasRoutes = require('./routes/faturas');
const implantacoesRoutes = require('./routes/implantacoes');
const orcamentosRoutes = require('./routes/orcamentos');
const statusRoutes = require('./routes/status');
const templatesRoutes = require('./routes/templates');
const transacoesRoutes = require('./routes/transacoes');
const parametrosEmpresaRoutes = require('./routes/parametros-empresa');

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Apply Helmet security headers
app.use(getHelmetConfig());

// Additional security headers
app.use(additionalSecurityHeaders);

// HTTPS redirect (production only)
app.use(httpsRedirect);

// Security logging
app.use(securityLogger);

// ============================================
// CORS CONFIGURATION
// ============================================

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// REQUEST LOGGING (Development)
// ============================================

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// RATE LIMITING
// ============================================

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/contratos', contratosRoutes);
app.use('/api/faturas', faturasRoutes);
app.use('/api/implantacoes', implantacoesRoutes);
app.use('/api/orcamentos', orcamentosRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/transacoes', transacoesRoutes);
app.use('/api/parametros-empresa', parametrosEmpresaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
