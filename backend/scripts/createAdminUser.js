const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const email = 'admin@empresa.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const [existing] = await db.execute(
      'SELECT id_colaborador FROM colaboradores WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('Admin user already exists. Updating password...');
      await db.execute(
        'UPDATE colaboradores SET senha_hash = ? WHERE email = ?',
        [hashedPassword, email]
      );
      console.log('Admin password updated successfully!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    } else {
      // First, check if there's a permission for admin, if not create one
      let idPermissao = 1; // Default
      try {
        let [permissions] = await db.execute(
          'SELECT id_permissao FROM permissoes WHERE nome_perfil = ? LIMIT 1',
          ['Administrador']
        );

        if (permissions.length === 0) {
          // Create admin permission
          try {
            const [permResult] = await db.execute(
              `INSERT INTO permissoes (nome_perfil, descricao, nivel_acesso, permissoes_json) 
               VALUES (?, ?, ?, ?)`,
              [
                'Administrador',
                'Acesso total ao sistema',
                10,
                JSON.stringify({ all: true })
              ]
            );
            idPermissao = permResult.insertId;
            console.log('Created admin permission with ID:', idPermissao);
          } catch (permError) {
            console.log('Could not create permission (table may not exist), using default:', idPermissao);
            // Try to get any existing permission
            try {
              const [anyPerm] = await db.execute('SELECT id_permissao FROM permissoes LIMIT 1');
              if (anyPerm.length > 0) {
                idPermissao = anyPerm[0].id_permissao;
              }
            } catch (e) {
              console.log('No permissions table, will try without foreign key');
            }
          }
        } else {
          idPermissao = permissions[0].id_permissao;
        }
      } catch (permError) {
        console.log('Permission check failed, using default:', idPermissao);
      }

      // Create new admin user
      let result;
      try {
        [result] = await db.execute(
          `INSERT INTO colaboradores 
          (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo, id_permissao, id_usuario_criacao) 
          VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
          [
            '00000000000',
            'Administrador',
            email,
            hashedPassword,
            '00000000000',
            'funcionario',
            1,
            idPermissao,
            1 // Self-reference for first user
          ]
        );
      } catch (insertError) {
        // If foreign key fails, try without it (for first user)
        console.log('First insert attempt failed, trying without foreign key constraints...');
        try {
          // Try to insert with minimal required fields
          [result] = await db.execute(
            `INSERT INTO colaboradores 
            (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo) 
            VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
            [
              '00000000000',
              'Administrador',
              email,
              hashedPassword,
              '00000000000',
              'funcionario',
              1
            ]
          );
          // Update foreign keys after insert
          await db.execute(
            'UPDATE colaboradores SET id_permissao = ?, id_usuario_criacao = ? WHERE id_colaborador = ?',
            [idPermissao, result.insertId, result.insertId]
          );
        } catch (retryError) {
          throw retryError;
        }
      }
      
      // Update id_usuario_criacao to self
      await db.execute(
        'UPDATE colaboradores SET id_usuario_criacao = ? WHERE id_colaborador = ?',
        [result.insertId, result.insertId]
      );
      
      console.log('Admin user created successfully!');
      console.log(`User ID: ${result.insertId}`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

createAdminUser();

