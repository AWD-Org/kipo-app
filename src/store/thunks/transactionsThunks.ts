import { createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '@/types/transaction';

// Thunk para obtener todas las transacciones
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/transactions?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al obtener transacciones');
      }
      
      const data = await response.json();
      return data.data as Transaction[];
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa con datos dummy
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Datos de ejemplo para desarrollo
        return [
          { id: '1', userId, type: 'ingreso', amount: 25000, category: 'Salario', date: '2023-11-01', description: 'Nómina mensual', isRecurrent: true, recurrenceFrequency: 'monthly', tags: ['trabajo', 'principal'] },
          { id: '2', userId, type: 'gasto', amount: 7500, category: 'Vivienda', date: '2023-11-02', description: 'Renta', isRecurrent: true, recurrenceFrequency: 'monthly', tags: ['fijo'] },
          { id: '3', userId, type: 'gasto', amount: 3000, category: 'Alimentación', date: '2023-11-05', description: 'Compra semanal', isRecurrent: false, recurrenceFrequency: 'none', tags: [] },
          { id: '4', userId, type: 'gasto', amount: 1200, category: 'Transporte', date: '2023-11-08', description: 'Gasolina', isRecurrent: false, recurrenceFrequency: 'none', tags: [] },
          { id: '5', userId, type: 'gasto', amount: 2500, category: 'Servicios', date: '2023-11-10', description: 'Luz y agua', isRecurrent: true, recurrenceFrequency: 'monthly', tags: ['fijo'] },
          { id: '6', userId, type: 'gasto', amount: 1800, category: 'Entretenimiento', date: '2023-11-15', description: 'Cine y cena', isRecurrent: false, recurrenceFrequency: 'none', tags: ['ocio'] },
          { id: '7', userId, type: 'ingreso', amount: 3000, category: 'Freelance', date: '2023-11-20', description: 'Proyecto extra', isRecurrent: false, recurrenceFrequency: 'none', tags: ['extra'] },
          { id: '8', userId, type: 'gasto', amount: 1500, category: 'Salud', date: '2023-11-25', description: 'Medicamentos', isRecurrent: false, recurrenceFrequency: 'none', tags: [] },
        ] as Transaction[];
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al obtener transacciones');
    }
  }
);

// Thunk para añadir una nueva transacción
export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transactionData: Omit<Transaction, 'id'>, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al añadir transacción');
      }
      
      const data = await response.json();
      return data.data as Transaction;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generar ID único para desarrollo
        const newId = Date.now().toString();
        
        return {
          id: newId,
          ...transactionData,
        } as Transaction;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al añadir transacción');
    }
  }
);

// Thunk para actualizar una transacción existente
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transactionData: Transaction, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/transactions/${transactionData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al actualizar transacción');
      }
      
      const data = await response.json();
      return data.data as Transaction;
    } catch (error) {
      // Para desarrollo, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        // Simular una demora para ver el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return transactionData;
      }
      
      // Error genérico para producción
      return rejectWithValue((error as Error).message || 'Error al actualizar transacción');
    }
  }
);

// Thunk para eliminar una transacción
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      // En una implementación real, esta sería una llamada a la API
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error al eliminar transacción');
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
      return rejectWithValue((error as Error).message || 'Error al eliminar transacción');
    }
  }
);
