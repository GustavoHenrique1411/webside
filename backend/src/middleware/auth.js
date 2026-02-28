const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'webside_secret_key_2024';

/**
 * Gera um token JWT para o usuário
 * @param {Object} user - Objeto do usuário do banco de dados
 * @returns {string} Token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id_colaborador,
      email: user.email,
      nome: user.nome_completo,
      id_permissao: user.id_permissao
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }
  
  // Extract token (Bearer <token>)
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7, authHeader.length) 
    : authHeader;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = { authMiddleware, JWT_SECRET, generateToken };

