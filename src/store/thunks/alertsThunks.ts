import { createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from '@/types/alert';

// Thunk para obtener todas las alertas
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (userId: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/alerts?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al obtener alertas');
      }
      
      const data = await response.json();
      return data.data as Alert[];
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
            type: 'warning',
            title: 'Gasto inusual detectado',
            message: 'Hemos detectado un gasto de $2,500 en la categoría Entretenimiento, que es un 80% más alto que tu promedio mensual.',
            date: '2023-11-26',
            isRead: false,
            actionUrl: '/dashboard/transactions',
            actionText: 'Ver transacción'
          },
          {
            id: '2',
            userId,
            type: 'info',
            title: 'Actualización de meta',
            message: 'Tu meta "Nuevo laptop" va por buen camino, has ahorrado 32% del objetivo. ¡Sigue así!',
            date: '2023-11-25',
            isRead: true,
            actionUrl: '/dashboard/goals/3',
            actionText: 'Ver meta'
          },
          {
            id: '3',
            userId,
            type: 'success',
            title: 'Balance positivo',
            message: 'Tu balance este mes es positivo, tus ingresos superan tus gastos en $8,500. ¡Felicidades!',
            date: '2023-11-24',
            isRead: true
          },
          {
            id: '4',
            userId,
            type: 'error',
            title: 'Riesgo de sobregiro',
            message: 'Basado en tus gastos recientes, podrías quedarte sin fondos antes de fin de mes. Considera reducir gastos no esenciales.',
            date: '2023-11-23',
            isRead: false,
            actionUrl: '/dashboard/budget',
            actionText: 'Revisar presupuesto'
          },
          {
            id: '5',
            userId,
            type: 'info',
            title: 'Recordatorio de pago',
            message: 'Tienes un pago programado de $1,800 para el servicio de internet en 3 días.',
            date: '2023-11-22',
            isRead: false
          },
          {
            id: '6',
            userId,
            type: 'success',
            title: 'Meta completada',
            message: '¡Felicidades! Has completado tu meta "Fondo para vacaciones" de $15,000.',
            date: '2023-11-20',
            isRead: true,
            actionUrl: '/dashboard/goals/2',
            actionText: 'Ver meta'
          },
        ] as Alert[];
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al obtener alertas');
    }
  }
);

// Thunk para marcar una alerta como leída
export const markAsRead = createAsyncThunk(
  'alerts/markAsRead',
  async (alertId: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/alerts/${alertId}/read`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al marcar la alerta como leída');
      }
      
      const data = await response.json();
      return alertId;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return alertId;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al marcar la alerta como leída');
    }
  }
);

// Thunk para marcar todas las alertas como leídas
export const markAllAsRead = createAsyncThunk(
  'alerts/markAllAsRead',
  async (userId: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/alerts/read-all?userId=${userId}`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al marcar todas las alertas como leídas');
      }
      
      return true;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return true;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al marcar todas las alertas como leídas');
    }
  }
);

// Thunk para eliminar una alerta
export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al eliminar la alerta');
      }
      
      return alertId;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return alertId;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al eliminar la alerta');
    }
  }
);
