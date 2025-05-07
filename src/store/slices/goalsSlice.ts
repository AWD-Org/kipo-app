import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Goal } from '@/types/goal';
import { fetchGoals, addGoal, updateGoal, deleteGoal, updateGoalProgress } from '../thunks/goalsThunks';

// Interface para el estado de las metas
interface GoalsState {
  items: Goal[];
  isLoading: boolean;
  error: string | null;
  filter: {
    isActive: boolean | null;
    categories: string[];
    searchTerm: string;
  };
  stats: {
    totalGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    completionRate: number;
  };
}

// Estado inicial
const initialState: GoalsState = {
  items: [],
  isLoading: false,
  error: null,
  filter: {
    isActive: true,
    categories: [],
    searchTerm: '',
  },
  stats: {
    totalGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    completionRate: 0,
  },
};

// Función para calcular estadísticas
const calculateStats = (goals: Goal[]) => {
  const totalGoals = goals.length;
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return {
    totalGoals,
    totalTargetAmount,
    totalCurrentAmount,
    completionRate,
  };
};

// Crear el slice
const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    // Acciones para los filtros
    setActiveFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filter.isActive = action.payload;
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
    // Manejo de fetchGoals
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.stats = calculateStats(action.payload);
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al cargar las metas';
      });

    // Manejo de addGoal
    builder
      .addCase(addGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.isLoading = false;
        state.items.push(action.payload);
        state.stats = calculateStats(state.items);
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al añadir la meta';
      });

    // Manejo de updateGoal
    builder
      .addCase(updateGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.isLoading = false;
        const index = state.items.findIndex(goal => goal.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.stats = calculateStats(state.items);
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al actualizar la meta';
      });

    // Manejo de deleteGoal
    builder
      .addCase(deleteGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.items = state.items.filter(goal => goal.id !== action.payload);
        state.stats = calculateStats(state.items);
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al eliminar la meta';
      });

    // Manejo de updateGoalProgress
    builder
      .addCase(updateGoalProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGoalProgress.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.isLoading = false;
        const index = state.items.findIndex(goal => goal.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.stats = calculateStats(state.items);
      })
      .addCase(updateGoalProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error al actualizar el progreso de la meta';
      });
  },
});

// Exportar acciones y reducer
export const { setActiveFilter, setCategoryFilter, setSearchTerm, resetFilters } = goalsSlice.actions;

export default goalsSlice.reducer;
