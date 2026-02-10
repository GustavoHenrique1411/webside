const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function fixAdminPassword() {
  try {
    console.log('=== CORRIGINDO SENHA DO ADMIN ===');
    
    const email = 'admin@empresa.com';
    const password = 'admin123';
    
    // Gerar novo hash
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Novo hash gerado:', hashedPassword);
    
    // Verificar se o usuário existe
    const [users] = await db.execute('SELECT * FROM colaboradores WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log('Usuário não encontrado. Criando...');
      
      // Buscar permissão de admin
      const [perms] = await db.execute('SELECT id_permissao FROM permissoes WHERE nome_perfil = ? LIMIT 1', ['Administrador']);
      
      if (perms.length === 0) {
        console.error('Permissão de Administrador não encontrada!');
        process.exit(1);
      }
      
      const idPermissao = perms[0].id_permissao;
      
      // Criar usuário admin
      const [result] = await db.execute(
        `INSERT INTO colaboradores 
        (id_permissao, cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo, id_usuario_criacao) 
        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)`,
        [idPermissao, '000.000.000-00', 'Administrador', email, hashedPassword, '(00) 0000-0000', 'funcionario', 1, 1]
      );
      
      const userId = result.insertId;
      await db.execute('UPDATE colaboradores SET id_usuario_criacao = ? WHERE id_colaborador = ?', [userId, userId]);
      
      console.log('Usuário admin criado com sucesso!');
      console.log(`ID: ${userId}`);
    } else {
      console.log('Usuário encontrado. Atualizando senha...');
      
      // Atualizar senha
      await db.execute(
        'UPDATE colaboradores SET senha_hash = ?, ativo = 1 WHERE email = ?',
        [hashedPassword, email]
      );
      
      console.log('Senha atualizada com sucesso!');
    }
    
    // Testar o hash
    const [testUser] = await db.execute('SELECT senha_hash FROM colaboradores WHERE email = ?', [email]);
    const isValid = await bcrypt.compare(password, testUser[0].senha_hash);
    
    console.log('\n=== TESTE DE VALIDAÇÃO ===');
    console.log('Email:', email);
    console.log('Senha:', password);
    console.log('Hash no banco:', testUser[0].senha_hash);
    console.log('Validação:', isValid ? '✓ SUCESSO' : '✗ FALHOU');
    
    if (isValid) {
      console.log('\n✓ Login deve funcionar agora!');
    } else {
      console.log('\n✗ Ainda há problema com o hash');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

fixAdminPassword();

