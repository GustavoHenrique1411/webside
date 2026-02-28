const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Import logger
const { logger, requestLogger } = require('./config/logger');

// Load environment variables
dotenv.config();

// Import GraphQL resolvers
const { Query, Mutation } = require('./graphql/resolvers');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'webside-secret-key';

//========================= MIDDLEWARE =========================

// Request logger
app.use(requestLogger);

// CORS
app.use(cors());
logger.info('CORS middleware configurado');

// JSON e URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
logger.debug('Middleware JSON e URL encoded configurados');

//========================= HEALTH CHECKS =========================

// Health check endpoint (REST - para Docker healthcheck e nginx)
app.get('/health', (req, res) => {
  logger.debug('Health check acessado');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Health check também via GraphQL (para compatibilidade)
app.get('/api/health', (req, res) => {
  logger.debug('API health check acessado');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//========================= GRAPHQL SETUP =========================

// Read GraphQL schema
const typeDefs = fs.readFileSync('./src/graphql/schema.graphql', 'utf-8');
logger.info('Schema GraphQL carregado');

// Context for GraphQL
const context = async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      logger.debug('Token JWT válido', { userId: decoded.id });
      return { user: decoded };
    } catch (err) {
      logger.warn('Token JWT inválido', { error: err.message });
      // Invalid token, but continue without user
    }
  }
  return { user: null };
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
});

async function startServer() {
  logger.info('🚀 Iniciando servidor Apollo GraphQL...');
  
  await server.start();
  
  logger.info('✅ Apollo Server iniciado com sucesso');
  
  // GraphQL endpoint - ÚNICO ENDPOINT DA API
  app.use('/graphql', expressMiddleware(server, {
    context,
  }));
  
  logger.info('📡 Endpoint GraphQL disponível em /graphql');
  
  // O frontend é servido pelo nginx separadamente - não servimos estáticos aqui

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.errorWithStack('Erro não tratado no servidor:', err, {
      url: req.url,
      method: req.method,
      headers: req.headers
    });
    res.status(500).json({ error: 'Algo deu errado!' });
  });

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    logger.info(`
╔════════════════════════════════════════════════════════════╗
║                  ✅ SERVIDOR INICIADO                        ║
╠════════════════════════════════════════════════════════════╣
║  Porta:              ${PORT.toString().padEnd(40)}║
║  GraphQL:            http://localhost:${PORT}/graphql${' '.repeat(29)}║
║  Health Check:       http://localhost:${PORT}/health${' '.repeat(26)}║
║  API:                Apenas via GraphQL                      ║
╚════════════════════════════════════════════════════════════╝
    `);
    console.log(`Logs sendo salvos em: ./logs/webside-{data}.log`);
  });
}

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  logger.errorWithStack('ERRO NÃO CAPTURADO (uncaughtException):', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('REJEIÇÃO NÃO TRATADA (unhandledRejection):', reason, { promise });
});

startServer().catch(err => {
  logger.errorWithStack('FALHA AO INICIAR SERVIDOR:', err);
});
