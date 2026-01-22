const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
