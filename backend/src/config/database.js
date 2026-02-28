const mysql = require('mysql2/promise');
const { logger } = require('./logger');

// Usar MySQL do Hostgator por padrão
  const poolConfig = {
    host: process.env.DB_HOST || '162.241.2.103',
    user: process.env.DB_USER || 'websid23_dev',
    password: process.env.DB_PASSWORD || 'Web@132435*',
    database: process.env.DB_NAME || 'websid23_erp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  logger.info('Inicializando conexão com banco de dados MySQL...', {
    host: poolConfig.host,
    database: poolConfig.database,
    user: poolConfig.user
  });

  pool = mysql.createPool(poolConfig);

  // Testa a conexão ao iniciar
  pool.getConnection()
    .then(connection => {
      logger.info('✅ Conexão com banco de dados estabelecida com sucesso!');
      connection.release();
    })
    .catch(err => {
      logger.errorWithStack('❌ Erro ao conectar no banco de dados:', err, {
        host: poolConfig.host,
        database: poolConfig.database
      });
    });


// Wrapper para log de queries
const originalQuery = pool.query.bind(pool);

pool.query = async function(sql, params) {
  const startTime = Date.now();
  
  try {
    logger.debug('Executando query SQL', {
      query: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
      params: params ? params.map(p => 
        (typeof p === 'string' && (p.length > 20 || p.includes('@'))) ? '***' : p
      ) : null
    });
    
    const [rows, fields] = await originalQuery(sql, params);
    const duration = Date.now() - startTime;
    
    logger.debug('Query executada com sucesso', {
      duration: `${duration}ms`,
      rowsAffected: rows?.affectedRows || rows?.length || 0
    });
    
    return [rows, fields];
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Erro ao executar query', {
      query: sql.substring(0, 100),
      duration: `${duration}ms`,
      error: error.message,
      code: error.code
    });
    throw error;
  }
};

// Wrapper para getConnection com logs
const originalGetConnection = pool.getConnection.bind(pool);

pool.getConnection = async function() {
  const startTime = Date.now();
  
  try {
    const connection = await originalGetConnection();
    const duration = Date.now() - startTime;
    
    logger.debug('Nova conexão obtida do pool', {
      threadId: connection.threadId,
      duration: `${duration}ms`
    });
    
    // Intercepta query na conexão
    const originalConnQuery = connection.query.bind(connection);
    connection.query = async function(sql, params) {
      const queryStart = Date.now();
      
      try {
        logger.debug('Executando query na conexão', {
          query: sql.substring(0, 80) + '...',
          threadId: connection.threadId
        });
        
        const result = await originalConnQuery(sql, params);
        const queryDuration = Date.now() - queryStart;
        
        logger.debug('Query na conexão finalizada', {
          duration: `${queryDuration}ms`,
          threadId: connection.threadId
        });
        
        return result;
      } catch (error) {
        logger.error('Erro na query da conexão', {
          error: error.message,
          threadId: connection.threadId
        });
        throw error;
      }
    };
    
    return connection;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Erro ao obter conexão do pool', {
      duration: `${duration}ms`,
      error: error.message
    });
    throw error;
  }
};

module.exports = pool;

