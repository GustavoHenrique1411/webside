/**
 * Script para corrigir todos os SelectContent adicionando keys únicas
 * Execução: node fix-all-selects.js
 */

const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/admin/Clientes.tsx',
  'src/pages/admin/Financeiro.tsx',
  'src/pages/admin/Leads.tsx',
  'src/pages/admin/Pedidos.tsx',
  'src/pages/admin/Relatorios.tsx',
  'src/pages/admin/Transacoes.tsx',
];

let totalReplacements = 0;

files.forEach(filePath => {
  console.log(`\n📝 Processando: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacements = 0;
    
    // Padrão 1: <SelectContent> sem key
    const pattern1 = /<SelectContent>/g;
    const matches1 = content.match(pattern1);
    if (matches1) {
      replacements += matches1.length;
      content = content.replace(pattern1, `<SelectContent key={\`select-\${Date.now()}-\${Math.random()}\`}>`);
    }
    
    // Padrão 2: <SelectContent com props mas sem key
    const pattern2 = /<SelectContent\s+(?!key)([^>]*)>/g;
    const matches2 = content.match(pattern2);
    if (matches2) {
      replacements += matches2.length;
      content = content.replace(pattern2, (match, props) => {
        return `<SelectContent key={\`select-\${Date.now()}-\${Math.random()}\`} ${props}>`;
      });
    }
    
    if (replacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${replacements} SelectContent(s) corrigido(s)`);
      totalReplacements += replacements;
    } else {
      console.log(`ℹ️  Nenhuma correção necessária`);
    }
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Total de correções: ${totalReplacements}`);
console.log(`✅ Script concluído!`);
