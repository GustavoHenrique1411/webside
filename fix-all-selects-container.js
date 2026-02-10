const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/admin/Clientes.tsx',
  'src/pages/admin/Leads.tsx',
  'src/pages/admin/Pedidos.tsx',
  'src/pages/admin/Transacoes.tsx',
  'src/pages/admin/Relatorios.tsx',
  'src/pages/admin/Financeiro.tsx'
];

let totalReplacements = 0;

files.forEach(file => {
  console.log(`\n📝 Processando: ${file}`);
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Substituir position="popper" sideOffset={5} por position="popper" sideOffset={5} container={null}
    content = content.replace(
      /position="popper" sideOffset=\{5\}>/g,
      'position="popper" sideOffset={5} container={null}>'
    );
    
    // Contar substituições
    const matches = originalContent.match(/position="popper" sideOffset=\{5\}>/g);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ ${count} SelectContent(s) corrigido(s)`);
      totalReplacements += count;
    } else {
      console.log(`ℹ️  Nenhuma correção necessária`);
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${file}:`, error.message);
  }
});

console.log(`\n🎉 Total de correções: ${totalReplacements}`);
console.log('✅ Script concluído!');
