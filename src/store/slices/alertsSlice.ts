import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert } from '@/types/alert';
import { fetchAlerts, markAsRead, markAllAsRead, deleteAlert } from '../thunks/alertsThunks';

// Interface para el estado de las alertas
interface AlertsState {
  items: Alert[];
  isLoading: boolean;
  error: string | null;
  filter: {
    types: string[];
    isRead: boolean | null;
    searchTerm: string;
  };
}

// Estado inicial
const initialState: AlertsState = {
  items: [],
  isLoading: false,
  error: null,
  filter: {
    types: [],
    isRead: null,
    searchTerm: '',
  },
};

// Crear el slice
const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    // Acciones para los filtros
    setTypeFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.types = action.payload;
    },
    setReadFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filter.isRead = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filter.searchTerm = action.payload;
    },
    resetFilters: (state) => {
      state.filter = initialState.filter;
    },
  },
  extraReducers: (builder) => {
    // Manejo de fetchAlerts
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action: PayloadAction<Alert[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al cargar las alertas';
      });

    // Manejo de markAsRead
    builder
      .addCase(markAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        const index = state.items.findIndex(alert => alert.id === action.payload);
        if (index !== -1) {
          state.items[index].isRead = true;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al marcar la alerta como leída';
      });

    // Manejo de markAllAsRead
    builder
      .addCase(markAllAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.items = state.items.map(alert => ({ ...alert, isRead: true }));
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al marcar todas las alertas como leídas';
      });

    // Manejo de deleteAlert
    builder
      .addCase(deleteAlert.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAlert.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.items = state.items.filter(alert => alert.id !== action.payload);
      })
      .addCase(deleteAlert.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al eliminar la alerta';
      });
  },
});

// Exportar acciones y reducer
export const { setTypeFilter, setReadFilter, setSearchTerm, resetFilters } = alertsSlice.actions;

export default alertsSlice.reducer;
