/**
 * Tipos para las transacciones
 */

// Tipo de transacción: ingreso o gasto
export type TransactionType = 'ingreso' | 'gasto';

// Frecuencia de recurrencia
export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

// Interfaz para las transacciones
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
  isRecurrent: boolean;
  recurrenceFrequency: RecurrenceFrequency;
  tags: string[];
}

// Interfaz para estadísticas de transacciones
export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  byPeriod: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;
}
