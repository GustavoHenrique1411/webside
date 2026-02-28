const fs = require('fs');
const path = require('path');

// Configuração de diretório de logs
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '../../logs');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'; // debug, info, warn, error
const MAX_LOG_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_LOG_FILES = 5;

// Cria diretório de logs se não existir
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Níveis de log
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

// Formata data para log
const formatDate = (date) => {
  return date.toISOString();
};

// Obtém nome do arquivo de log do dia
const getLogFileName = () => {
  const today = new Date().toISOString().split('T')[0];
  return `webside-${today}.log`;
};

// Rotaciona logs se necessário
const rotateLogs = () => {
  const logFile = path.join(LOG_DIR, getLogFileName());
  
  if (fs.existsSync(logFile)) {
    const stats = fs.statSync(logFile);
    if (stats.size > MAX_LOG_FILE_SIZE) {
      // Move log atual para backup
      const timestamp = Date.now();
      const backupFile = path.join(LOG_DIR, `webside-${timestamp}.log`);
      fs.renameSync(logFile, backupFile);
      
      // Remove arquivos antigos
      const files = fs.readdirSync(LOG_DIR)
        .filter(f => f.startsWith('webside-') && f.endsWith('.log'))
        .sort()
        .reverse();
      
      files.slice(MAX_LOG_FILES).forEach(f => {
        fs.unlinkSync(path.join(LOG_DIR, f));
      });
    }
  }
};

// Escreve no arquivo de log
const writeToFile = (level, message, meta = {}) => {
  rotateLogs();
  
  const logFile = path.join(LOG_DIR, getLogFileName());
  const timestamp = formatDate(new Date());
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
  
  fs.appendFileSync(logFile, logLine);
};

// Formata mensagem para console
const formatForConsole = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '/');
  const time = new Date().toISOString().split('T')[1].split('.')[0];
  
  let color = colors.white;
  let levelColor = colors.gray;
  
  switch (level) {
    case 'debug':
      color = colors.cyan;
      levelColor = colors.dim;
      break;
    case 'info':
      color = colors.green;
      levelColor = colors.blue;
      break;
    case 'warn':
      color = colors.yellow;
      levelColor = colors.yellow;
      break;
    case 'error':
      color = colors.red;
      levelColor = colors.red;
      break;
  }
  
  const metaStr = Object.keys(meta).length > 0 ? ` ${colors.dim}${JSON.stringify(meta)}${colors.reset}` : '';
  
  return `${colors.dim}[${time}]${colors.reset} ${levelColor}[${level.toUpperCase().padEnd(5)}]${colors.reset} ${color}${message}${colors.reset}${metaStr}`;
};

// Função principal de log
const log = (level, message, meta = {}) => {
  // Verifica se deve loggar baseado no nível
  if (LOG_LEVELS[level] < LOG_LEVELS[LOG_LEVELS[LOG_LEVELS[level] !== undefined ? LOG_LEVEL : 'info'] || 'info']) {
    return;
  }
  
  // Log no console
  console.log(formatForConsole(level, message, meta));
  
  // Log em arquivo
  if (level !== 'debug') { // Não salva debug em arquivo para evitar logs muito grandes
    writeToFile(level, message, meta);
  }
};

// Métodos de convenience
const logger = {
  debug: (message, meta) => log('debug', message, meta),
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  
  // Log de requisições HTTP
  http: (message, meta) => log('info', `[HTTP] ${message}`, meta),
  
  // Log de GraphQL
  graphql: (operation, operationName, meta) => log('info', `[GraphQL] ${operation} ${operationName}`, meta),
  
  // Log de banco de dados
  db: (query, meta) => log('debug', `[DB] ${query.substring(0, 100)}...`, meta),
  
  // Log de início/fim de função
  trace: (funcName, startTime, meta) => {
    const duration = Date.now() - startTime;
    log('info', `[TRACE] ${funcName} completed in ${duration}ms`, meta);
  },
  
  // Log de erro com stack trace
  errorWithStack: (message, error, meta = {}) => {
    const stack = error?.stack ? `\n${error.stack}` : '';
    log('error', `${message}${stack}`, meta);
  },
  
  // Log de objeto/array
  data: (label, data) => {
    const sanitized = JSON.stringify(data, (key, value) => {
      // Remove dados sensíveis
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('senha') || key.toLowerCase().includes('token')) {
        return '***REDACTED***';
      }
      return value;
    }, 2);
    log('debug', `[DATA] ${label}: ${sanitized}`);
  }
};

// Middleware para Express/Apollo Server que loga todas as requisições
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  logger.http(`Incoming request: ${req.method} ${req.url}`, {
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    }
  });
  
  // Sobrescreve res.end para logar resposta
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    logger.http(`Response: ${req.method} ${req.url} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      status: res.statusCode
    });
    originalEnd.apply(res, args);
  };
  
  next();
};

module.exports = { logger, requestLogger };

