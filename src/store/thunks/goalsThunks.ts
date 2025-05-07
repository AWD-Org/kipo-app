import { createAsyncThunk } from '@reduxjs/toolkit';
import { Goal } from '@/types/goal';

// Thunk para obtener todas las metas
export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (userId: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/goals?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al obtener metas');
      }
      
      const data = await response.json();
      return data.data as Goal[];
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa con datos dummy
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Datos de ejemplo para desarrollo
        return [
          { 
            id: '1', 
            userId, 
            title: 'Fondo de emergencia', 
            description: 'Ahorrar para emergencias imprevistas', 
            targetAmount: 50000, 
            currentAmount: 15000, 
            startDate: '2023-01-01', 
            targetDate: '2024-06-30', 
            category: 'ahorro', 
            priority: 'alta', 
            isCompleted: false, 
            isActive: true, 
            reminderFrequency: 'monthly' 
          },
          { 
            id: '2', 
            userId, 
            title: 'Vacaciones', 
            description: 'Viaje a la playa', 
            targetAmount: 20000, 
            currentAmount: 5000, 
            startDate: '2023-02-15', 
            targetDate: '2024-07-15', 
            category: 'ahorro', 
            priority: 'media', 
            isCompleted: false, 
            isActive: true, 
            reminderFrequency: 'none' 
          },
          { 
            id: '3', 
            userId, 
            title: 'Nuevo laptop', 
            description: 'Comprar una nueva computadora para trabajo', 
            targetAmount: 25000, 
            currentAmount: 8000, 
            startDate: '2023-03-10', 
            targetDate: '2024-03-01', 
            category: 'compra', 
            priority: 'media', 
            isCompleted: false, 
            isActive: true, 
            reminderFrequency: 'none' 
          },
        ] as Goal[];
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al obtener metas');
    }
  }
);

// Thunk para añadir una nueva meta
export const addGoal = createAsyncThunk(
  'goals/addGoal',
  async (goalData: Omit<Goal, 'id'>, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al añadir meta');
      }
      
      const data = await response.json();
      return data.data as Goal;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generar ID único para desarrollo
        const newId = Date.now().toString();
        
        return {
          id: newId,
          ...goalData,
        } as Goal;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al añadir meta');
    }
  }
);

// Thunk para actualizar una meta existente
export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async (goalData: Goal, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/goals/${goalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al actualizar meta');
      }
      
      const data = await response.json();
      return data.data as Goal;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return goalData;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al actualizar meta');
    }
  }
);

// Thunk para eliminar una meta
export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al eliminar meta');
      }
      
      return id;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return id;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al eliminar meta');
    }
  }
);

// Thunk para actualizar el progreso de una meta
export const updateGoalProgress = createAsyncThunk(
  'goals/updateGoalProgress',
  async ({ id, amount }: { id: string; amount: number }, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/goals/${id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al actualizar el progreso');
      }
      
      const data = await response.json();
      return data.data as Goal;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // En desarrollo, necesitaríamos alguna forma de obtener la meta actual
        // Aquí solo simularemos una respuesta plausible
        return {
          id,
          userId: 'user123',
          title: 'Meta de ejemplo',
          description: 'Descripción de la meta',
          targetAmount: 20000,
          currentAmount: 10000 + amount, // Actualizar el monto actual con el incremento
          startDate: '2023-01-01',
          targetDate: '2024-12-31',
          category: 'ahorro',
          priority: 'media',
          isCompleted: (10000 + amount) >= 20000, // Marcar como completado si alcanza el objetivo
          isActive: true,
          reminderFrequency: 'none'
        } as Goal;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al actualizar el progreso');
    }
  }
);
