const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get parametros empresa
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parametros_empresa ORDER BY data_vigencia DESC LIMIT 1');
    
    if (rows.length === 0) {
      return res.json({
        salario_minimo: 1412.00,
        percentual_reajuste: 5.0,
        dias_vencimento_fatura: 30,
        taxa_juros_mora: 1.0,
        data_vigencia: new Date().toISOString().split('T')[0]
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get parametros empresa error:', error);
    res.status(500).json({ error: 'Erro ao buscar parâmetros da empresa' });
  }
});

// Update parametros empresa
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia } = req.body;

    if (!salario_minimo || !percentual_reajuste || !dias_vencimento_fatura || !taxa_juros_mora || !data_vigencia) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Check if exists
    const [existing] = await pool.query('SELECT id_parametro FROM parametros_empresa ORDER BY data_vigencia DESC LIMIT 1');

    if (existing.length > 0) {
      await pool.query(
        `UPDATE parametros_empresa SET salario_minimo = ?, percentual_reajuste = ?, dias_vencimento_fatura = ?, taxa_juros_mora = ?, data_vigencia = ? WHERE id_parametro = ?`,
        [salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia, existing[0].id_parametro]
      );
    } else {
      await pool.query(
        `INSERT INTO parametros_empresa (salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia) VALUES (?, ?, ?, ?, ?)`,
        [salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia]
      );
    }

    res.json({ message: 'Parâmetros atualizados com sucesso' });
  } catch (error) {
    console.error('Update parametros empresa error:', error);
    res.status(500).json({ error: 'Erro ao atualizar parâmetros da empresa' });
  }
});

module.exports = router;

