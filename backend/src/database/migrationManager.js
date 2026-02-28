/**
 * Database Migration Manager
 * Gerencia a execução de migrations e seeds
 */

const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

class MigrationManager {
  constructor() {
    // Caminho para o diretório database na raiz do projeto
    const projectRoot = path.join(__dirname, '..', '..');
    this.migrationsPath = path.join(projectRoot, 'database', 'migrations');
    this.seedsPath = path.join(projectRoot, 'database', 'seeds');
  }

  /**
   * Executa todas as migrations pendentes
   */
  async runMigrations() {
    const connection = await pool.getConnection();
    
    try {
      // Criar tabela de controle se não existir
      await connection.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id_migration INT AUTO_INCREMENT PRIMARY KEY,
          nome_migration VARCHAR(100) NOT NULL UNIQUE,
          executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Buscar migrations já executadas
      const [executed] = await connection.query('SELECT nome_migration FROM migrations');
      const executedMigrations = executed.map(m => m.nome_migration);
      
      // Buscar arquivos de migration
      const files = fs.readdirSync(this.migrationsPath)
        .filter(f => f.endsWith('.sql'))
        .sort();
      
      const pendingMigrations = files.filter(f => !executedMigrations.includes(f.replace('.sql', '')));
      
      console.log(`\n📊 Migrations encontradas: ${files.length}`);
      console.log(`✅ Já executadas: ${executedMigrations.length}`);
      console.log(`⏳ Pendentes: ${pendingMigrations.length}\n`);
      
      for (const file of pendingMigrations) {
        console.log(`🔄 Executando: ${file}`);
        const sql = fs.readFileSync(path.join(this.migrationsPath, file), 'utf8');
        
        await connection.query('START TRANSACTION');
        try {
          // Executar cada statement separadamente
          const statements = sql.split(';').filter(s => s.trim());
          for (const statement of statements) {
            if (statement.trim()) {
              await connection.query(statement);
            }
          }
          
          // Registrar migration
          const migrationName = file.replace('.sql', '');
          await connection.query('INSERT INTO migrations (nome_migration) VALUES (?)', [migrationName]);
          
          await connection.query('COMMIT');
          console.log(`   ✅ Concluída!\n`);
        } catch (error) {
          await connection.query('ROLLBACK');
          console.log(`   ❌ Erro: ${error.message}\n`);
          throw error;
        }
      }
      
      console.log('✨ Todas as migrations foram executadas com sucesso!');
      return { success: true, executed: pendingMigrations.length };
      
    } finally {
      connection.release();
    }
  }

  /**
   * Executa um seed específico
   */
  async runSeed(seedName) {
    const connection = await pool.getConnection();
    
    try {
      const seedFile = path.join(this.seedsPath, `${seedName}.sql`);
      
      if (!fs.existsSync(seedFile)) {
        throw new Error(`Seed "${seedName}" não encontrado`);
      }
      
      console.log(`🔄 Executando seed: ${seedName}`);
      const sql = fs.readFileSync(seedFile, 'utf8');
      
      await connection.query('START TRANSACTION');
      try {
        // Executar statements
        const statements = sql.split(';').filter(s => s.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement);
          }
        }
        
        await connection.query('COMMIT');
        console.log(`✅ Seed "${seedName}" executado com sucesso!\n`);
        return { success: true, seed: seedName };
      } catch (error) {
        await connection.query('ROLLBACK');
        console.log(`❌ Erro: ${error.message}\n`);
        throw error;
      }
      
    } finally {
      connection.release();
    }
  }

  /**
   * Executa todos os seeds em ordem
   */
  async runAllSeeds() {
    const connection = await pool.getConnection();
    
    try {
      const files = fs.readdirSync(this.seedsPath)
        .filter(f => f.endsWith('.sql'))
        .sort();
      
      console.log(`\n📊 Seeds encontrados: ${files.length}\n`);
      
      for (const file of files) {
        const seedName = file.replace('.sql', '');
        console.log(`🔄 Executando seed: ${seedName}`);
        
        const sql = fs.readFileSync(path.join(this.seedsPath, file), 'utf8');
        
        await connection.query('START TRANSACTION');
        try {
          const statements = sql.split(';').filter(s => s.trim());
          for (const statement of statements) {
            if (statement.trim()) {
              await connection.query(statement);
            }
          }
          
          await connection.query('COMMIT');
          console.log(`   ✅ Concluído!\n`);
        } catch (error) {
          await connection.query('ROLLBACK');
          console.log(`   ❌ Erro: ${error.message}\n`);
          throw error;
        }
      }
      
      console.log('✨ Todos os seeds foram executados com sucesso!');
      return { success: true, executed: files.length };
      
    } finally {
      connection.release();
    }
  }

  /**
   * Reseta o banco (drop tables e recria)
   */
  async reset() {
    const connection = await pool.getConnection();
    
    try {
      console.log('\n⚠️  ATENÇÃO: Isso irá apagar todos os dados!\n');
      
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // Listar todas as tabelas
      const [tables] = await connection.query('SHOW TABLES');
      const tableNames = tables.map(t => Object.values(t)[0]);
      
      console.log(`🗑️  Apagando ${tableNames.length} tabelas...`);
      
      for (const table of tableNames) {
        await connection.query(`DROP TABLE IF EXISTS ${table}`);
      }
      
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      
      console.log('✅ Banco resetado com sucesso!\n');
      
      // Executar migrations e seeds
      await this.runMigrations();
      await this.runAllSeeds();
      
      return { success: true };
      
    } finally {
      connection.release();
    }
  }

  /**
   * Verifica status das migrations
   */
  async status() {
    const connection = await pool.getConnection();
    
    try {
      // Criar tabela se não existir
      await connection.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id_migration INT AUTO_INCREMENT PRIMARY KEY,
          nome_migration VARCHAR(100) NOT NULL UNIQUE,
          executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      const [executed] = await connection.query('SELECT nome_migration, executed_at FROM migrations ORDER BY executed_at');
      
      const files = fs.readdirSync(this.migrationsPath)
        .filter(f => f.endsWith('.sql'))
        .sort();
      
      const executedNames = executed.map(m => m.nome_migration);
      
      console.log('\n📊 Status das Migrations:\n');
      console.log('| Status  | Migration |');
      console.log('|---------|-----------|');
      
      for (const file of files) {
        const name = file.replace('.sql', '');
        const isExecuted = executedNames.includes(name);
        const execInfo = executed.find(e => e.nome_migration === name);
        
        if (isExecuted) {
          console.log(`| ✅     | ${name} |`);
        } else {
          console.log(`| ⏳     | ${name} |`);
        }
      }
      
      console.log(`\nTotal: ${files.length} | Executadas: ${executed.length} | Pendentes: ${files.length - executed.length}\n`);
      
      return { total: files.length, executed: executed.length, pending: files.length - executed.length };
      
    } finally {
      connection.release();
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const manager = new MigrationManager();
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  
  (async () => {
    try {
      switch (command) {
        case 'migrate':
          await manager.runMigrations();
          break;
        case 'seed':
          const seedName = args[1];
          if (seedName) {
            await manager.runSeed(seedName);
          } else {
            await manager.runAllSeeds();
          }
          break;
        case 'reset':
          await manager.reset();
          break;
        case 'status':
        default:
          await manager.status();
      }
    } catch (error) {
      console.error('❌ Erro:', error.message);
      process.exit(1);
    } finally {
      await pool.end();
    }
  })();
}

module.exports = MigrationManager;

