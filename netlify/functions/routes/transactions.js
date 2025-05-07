const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../../../models/Transaction');

// Obtener todas las transacciones de un usuario
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del usuario' 
      });
    }

    const transactions = await Transaction.find({ 
      user: userId 
    }).sort({ date: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: transactions.length, 
      data: transactions 
    });
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo transacciones', 
      error: error.message 
    });
  }
});

// Obtener una transacción por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de transacción inválido' 
      });
    }

    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transacción no encontrada' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: transaction 
    });
  } catch (error) {
    console.error('Error obteniendo transacción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo transacción', 
      error: error.message 
    });
  }
});

// Crear una nueva transacción
router.post('/', async (req, res) => {
  try {
    const { 
      user, 
      type, 
      amount, 
      category, 
      description, 
      date, 
      isRecurrent, 
      recurrenceFrequency,
      tags 
    } = req.body;

    // Validaciones básicas
    if (!user || !type || !amount || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos' 
      });
    }

    // Crear transacción
    const transaction = await Transaction.create({
      user,
      type,
      amount,
      category,
      description: description || '',
      date: date || Date.now(),
      isRecurrent: isRecurrent || false,
      recurrenceFrequency: recurrenceFrequency || 'none',
      tags: tags || []
    });

    res.status(201).json({ 
      success: true, 
      data: transaction 
    });
  } catch (error) {
    console.error('Error creando transacción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creando transacción', 
      error: error.message 
    });
  }
});

// Actualizar una transacción
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de transacción inválido' 
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transacción no encontrada' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: transaction 
    });
  } catch (error) {
    console.error('Error actualizando transacción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error actualizando transacción', 
      error: error.message 
    });
  }
});

// Eliminar una transacción
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de transacción inválido' 
      });
    }

    const transaction = await Transaction.findByIdAndDelete(id);
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transacción no encontrada' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (error) {
    console.error('Error eliminando transacción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error eliminando transacción', 
      error: error.message 
    });
  }
});

// Obtener estadísticas por período
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del usuario' 
      });
    }

    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const query = { user: userId };
    if (Object.keys(dateFilter).length > 0) {
      query.date = dateFilter;
    }

    // Obtener todas las transacciones del período
    const transactions = await Transaction.find(query);
    
    // Calcular estadísticas
    const ingresos = transactions
      .filter(tx => tx.type === 'ingreso')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const gastos = transactions
      .filter(tx => tx.type === 'gasto')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Agrupar gastos por categoría
    const gastosPorCategoria = transactions
      .filter(tx => tx.type === 'gasto')
      .reduce((acc, tx) => {
        if (!acc[tx.category]) {
          acc[tx.category] = 0;
        }
        acc[tx.category] += tx.amount;
        return acc;
      }, {});

    // Formatear resultado
    const categorias = Object.keys(gastosPorCategoria).map(cat => ({
      nombre: cat,
      monto: gastosPorCategoria[cat],
      porcentaje: (gastosPorCategoria[cat] / gastos) * 100
    }));

    res.status(200).json({
      success: true,
      data: {
        ingresos,
        gastos,
        balance: ingresos - gastos,
        categorias
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo estadísticas', 
      error: error.message 
    });
  }
});

module.exports = router;
