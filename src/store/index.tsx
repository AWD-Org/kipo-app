'use client';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import React from 'react';

import transactionsReducer from './slices/transactionsSlice';
import goalsReducer from './slices/goalsSlice';
import alertsReducer from './slices/alertsSlice';

// Configurar el store de Redux
export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    goals: goalsReducer,
    alerts: alertsReducer,
  },
  // Middleware personalizado puede agregarse aquí si es necesario
});

// Definir los tipos RootState y AppDispatch desde el store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Componente Provider para envolver la aplicación
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default store;