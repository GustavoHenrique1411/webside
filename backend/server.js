const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const clientesRoutes = require('./routes/clientes');
const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');
const orcamentosRoutes = require('./routes/orcamentos');
const contratosRoutes = require('./routes/contratos');
const faturasRoutes = require('./routes/faturas');
const implantacoesRoutes = require('./routes/implantacoes');
const colaboradoresRoutes = require('./routes/colaboradores');
const empresasRoutes = require('./routes/empresas');
const transacoesRoutes = require('./routes/transacoes');
const statusRoutes = require('./routes/status');
const templatesRoutes = require('./routes/templates');
const parametrosEmpresaRoutes = require('./routes/parametros-empresa');
const healthRoutes = require('./routes/health');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/orcamentos', orcamentosRoutes);
app.use('/api/contratos', contratosRoutes);
app.use('/api/faturas', faturasRoutes);
app.use('/api/implantacoes', implantacoesRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/transacoes', transacoesRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/parametros-empresa', parametrosEmpresaRoutes);
app.use('/api/health', healthRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

