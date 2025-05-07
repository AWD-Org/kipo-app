import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@/types/transaction';
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction } from '../thunks/transactionsThunks';

// Interface para el estado de las transacciones
interface TransactionsState {
  items: Transaction[];
  isLoading: boolean;
  error: string | null;
  filter: {
    startDate: string | null;
    endDate: string | null;
    types: string[];
    categories: string[];
    searchTerm: string;
  };
  stats: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
}

// Estado inicial
const initialState: TransactionsState = {
  items: [],
  isLoading: false,
  error: null,
  filter: {
    startDate: null,
    endDate: null,
    types: [],
    categories: [],
    searchTerm: '',
  },
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  },
};

// Función para calcular las estadísticas
const calculateStats = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(tx => tx.type === 'ingreso')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === 'gasto')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};

// Crear el slice
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Acciones para los filtros
    setDateFilter: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.filter.startDate = action.payload.startDate;
      state.filter.endDate = action.payload.endDate;
    },
    setTypeFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.types = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.categories = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filter.searchTerm = action.payload;
    },
    resetFilters: (state) => {
      state.filter = initialState.filter;
    },
  },
  extraReducers: (builder) => {
    // Manejo de fetchTransactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.stats = calculateStats(action.payload);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al cargar las transacciones';
      });

    // Manejo de addTransaction
    builder
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.isLoading = false;
        state.items.push(action.payload);
        state.stats = calculateStats(state.items);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al añadir la transacción';
      });

    // Manejo de updateTransaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.isLoading = false;
        const index = state.items.findIndex(tx => tx.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.stats = calculateStats(state.items);
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al actualizar la transacción';
      });

    // Manejo de deleteTransaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.items = state.items.filter(tx => tx.id !== action.payload);
        state.stats = calculateStats(state.items);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al eliminar la transacción';
      });
  },
});

// Exportar acciones y reducer
export const { setDateFilter, setTypeFilter, setCategoryFilter, setSearchTerm, resetFilters } = transactionsSlice.actions;

export default transactionsSlice.reducer;
