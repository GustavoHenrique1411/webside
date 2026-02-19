const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'webside_secret_key_2024';

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

module.exports = { authMiddleware, JWT_SECRET };

