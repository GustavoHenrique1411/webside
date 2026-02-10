const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get system parameters
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM parametros_empresa ORDER BY id_parametro DESC LIMIT 1');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching system parameters:', error);
    res.status(500).json({ error: 'Failed to fetch system parameters' });
  }
});

// Update system parameters
router.put('/', async (req, res) => {
  try {
    const {
      salario_minimo,
      percentual_reajuste,
      dias_vencimento_fatura,
      taxa_juros_mora,
      data_vigencia
    } = req.body;

    // Check if parameters exist
    const [existing] = await db.query('SELECT id_parametro FROM parametros_empresa ORDER BY id_parametro DESC LIMIT 1');

    if (existing.length > 0) {
      // Update existing
      await db.query(
        'UPDATE parametros_empresa SET salario_minimo = ?, percentual_reajuste = ?, dias_vencimento_fatura = ?, taxa_juros_mora = ?, data_vigencia = ? WHERE id_parametro = ?',
        [salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia, existing[0].id_parametro]
      );
    } else {
      // Insert new
      await db.query(
        'INSERT INTO parametros_empresa (salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia) VALUES (?, ?, ?, ?, ?)',
        [salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia]
      );
    }

    res.json({ message: 'System parameters updated successfully' });
  } catch (error) {
    console.error('Error updating system parameters:', error);
    res.status(500).json({ error: 'Failed to update system parameters' });
  }
});

module.exports = router;
