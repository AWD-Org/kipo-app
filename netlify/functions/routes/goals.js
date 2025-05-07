const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goal = require('../../../models/Goal');

// Obtener todas las metas de un usuario
router.get('/', async (req, res) => {
  try {
    const { userId, isActive } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del usuario' 
      });
    }

    const query = { user: userId };
    
    // Si se especifica filtro de activas
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const goals = await Goal.find(query).sort({ targetDate: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: goals.length, 
      data: goals 
    });
  } catch (error) {
    console.error('Error obteniendo metas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo metas', 
      error: error.message 
    });
  }
});

// Obtener una meta por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de meta inválido' 
      });
    }

    const goal = await Goal.findById(id);
    
    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Meta no encontrada' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: goal 
    });
  } catch (error) {
    console.error('Error obteniendo meta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo meta', 
      error: error.message 
    });
  }
});

// Crear una nueva meta
router.post('/', async (req, res) => {
  try {
    const { 
      user, 
      title, 
      description, 
      targetAmount, 
      currentAmount,
      startDate,
      targetDate,
      category,
      priority,
      reminderFrequency
    } = req.body;

    // Validaciones básicas
    if (!user || !title || !targetAmount || !targetDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos' 
      });
    }

    // Crear meta
    const goal = await Goal.create({
      user,
      title,
      description: description || '',
      targetAmount,
      currentAmount: currentAmount || 0,
      startDate: startDate || Date.now(),
      targetDate,
      category: category || 'ahorro',
      priority: priority || 'media',
      isCompleted: false,
      isActive: true,
      reminderFrequency: reminderFrequency || 'none'
    });

    res.status(201).json({ 
      success: true, 
      data: goal 
    });
  } catch (error) {
    console.error('Error creando meta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creando meta', 
      error: error.message 
    });
  }
});

// Actualizar una meta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de meta inválido' 
      });
    }

    // Comprobar si hay que actualizar el campo isCompleted
    const updateData = { ...req.body };
    if (updateData.currentAmount && updateData.targetAmount) {
      updateData.isCompleted = updateData.currentAmount >= updateData.targetAmount;
    } else if (updateData.currentAmount) {
      const goal = await Goal.findById(id);
      updateData.isCompleted = updateData.currentAmount >= goal.targetAmount;
    }

    const goal = await Goal.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Meta no encontrada' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: goal 
    });
  } catch (error) {
    console.error('Error actualizando meta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error actualizando meta', 
      error: error.message 
    });
  }
});

// Eliminar una meta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de meta inválido' 
      });
    }

    const goal = await Goal.findByIdAndDelete(id);
    
    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Meta no encontrada' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (error) {
    console.error('Error eliminando meta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error eliminando meta', 
      error: error.message 
    });
  }
});

// Actualizar el progreso de una meta
router.patch('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de meta inválido' 
      });
    }

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere una cantidad válida' 
      });
    }

    // Obtener la meta actual
    const goal = await Goal.findById(id);
    
    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Meta no encontrada' 
      });
    }

    // Actualizar el monto actual
    const newAmount = goal.currentAmount + parseFloat(amount);
    const isCompleted = newAmount >= goal.targetAmount;

    // Actualizar el documento
    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      { 
        currentAmount: newAmount,
        isCompleted
      },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      data: updatedGoal 
    });
  } catch (error) {
    console.error('Error actualizando progreso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error actualizando progreso', 
      error: error.message 
    });
  }
});

// Obtener resumen de progreso de todas las metas
router.get('/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del usuario' 
      });
    }

    // Obtener todas las metas activas
    const goals = await Goal.find({ 
      user: userId,
      isActive: true
    });
    
    if (!goals.length) {
      return res.status(200).json({ 
        success: true, 
        data: {
          totalGoals: 0,
          completedGoals: 0,
          completionRate: 0,
          totalTargetAmount: 0,
          totalCurrentAmount: 0,
          overallProgress: 0
        }
      });
    }

    // Calcular estadísticas
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.isCompleted).length;
    const completionRate = (completedGoals / totalGoals) * 100;
    
    const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100;

    // Agrupar por categoría
    const byCategory = goals.reduce((acc, g) => {
      if (!acc[g.category]) {
        acc[g.category] = {
          count: 0,
          targetAmount: 0,
          currentAmount: 0,
          completed: 0
        };
      }
      
      acc[g.category].count++;
      acc[g.category].targetAmount += g.targetAmount;
      acc[g.category].currentAmount += g.currentAmount;
      
      if (g.isCompleted) {
        acc[g.category].completed++;
      }
      
      return acc;
    }, {});

    // Formatear categorías
    const categories = Object.keys(byCategory).map(key => ({
      name: key,
      count: byCategory[key].count,
      targetAmount: byCategory[key].targetAmount,
      currentAmount: byCategory[key].currentAmount,
      progress: (byCategory[key].currentAmount / byCategory[key].targetAmount) * 100,
      completionRate: (byCategory[key].completed / byCategory[key].count) * 100
    }));

    res.status(200).json({
      success: true,
      data: {
        totalGoals,
        completedGoals,
        completionRate,
        totalTargetAmount,
        totalCurrentAmount,
        overallProgress,
        categories
      }
    });
  } catch (error) {
    console.error('Error obteniendo resumen:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo resumen', 
      error: error.message 
    });
  }
});

module.exports = router;
