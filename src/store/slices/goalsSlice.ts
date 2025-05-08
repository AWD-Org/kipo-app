// src/store/slices/goalsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Goal } from "@/types/goal";
import {
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
} from "../thunks/goalsThunks";

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

const initialState: GoalsState = {
    items: [],
    isLoading: false,
    error: null,
    filter: {
        isActive: true,
        categories: [],
        searchTerm: "",
    },
    stats: {
        totalGoals: 0,
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        completionRate: 0,
    },
};

const calculateStats = (goals: Goal[] = []): GoalsState["stats"] => {
    const totalGoals = goals.length;
    const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrentAmount = goals.reduce(
        (sum, g) => sum + g.currentAmount,
        0
    );
    const completed = goals.filter((g) => g.isCompleted).length;
    const completionRate = totalGoals > 0 ? (completed / totalGoals) * 100 : 0;
    return {
        totalGoals,
        totalTargetAmount,
        totalCurrentAmount,
        completionRate,
    };
};

const mapDocToGoal = (doc: any): Goal => ({
    id: String(doc._id),
    userId: doc.user,
    title: doc.title,
    description: doc.description,
    targetAmount: doc.targetAmount,
    currentAmount: doc.currentAmount,
    startDate: doc.startDate,
    targetDate: doc.targetDate,
    category: doc.category,
    priority: doc.priority,
    isCompleted: doc.isCompleted,
    isActive: doc.isActive,
    reminderFrequency: doc.reminderFrequency,
    // <-- Mapeo del nuevo campo:
    suggestedPlan: doc.suggestedPlan
        ? {
              monthly: doc.suggestedPlan.monthly,
              weekly: doc.suggestedPlan.weekly,
          }
        : undefined,
});

export const goalsSlice = createSlice({
    name: "goals",
    initialState,
    reducers: {
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
    extraReducers: (b) => {
        b
            // FETCH
            .addCase(fetchGoals.pending, (s) => {
                s.isLoading = true;
                s.error = null;
            })
            .addCase(fetchGoals.fulfilled, (s, a: PayloadAction<any[]>) => {
                s.isLoading = false;
                const arr = a.payload ?? [];
                s.items = arr.map(mapDocToGoal);
                s.stats = calculateStats(s.items);
            })
            .addCase(fetchGoals.rejected, (s, a) => {
                s.isLoading = false;
                s.error = (a.payload as string) || "Error cargando metas";
                s.items = [];
                s.stats = calculateStats([]);
            })

            // ADD
            .addCase(addGoal.pending, (s) => {
                s.isLoading = true;
                s.error = null;
            })
            .addCase(addGoal.fulfilled, (s, a: PayloadAction<any>) => {
                s.isLoading = false;
                s.items.push(mapDocToGoal(a.payload));
                s.stats = calculateStats(s.items);
            })
            .addCase(addGoal.rejected, (s, a) => {
                s.isLoading = false;
                s.error = (a.payload as string) || "Error añadiendo meta";
            })

            // UPDATE
            .addCase(updateGoal.pending, (s) => {
                s.isLoading = true;
                s.error = null;
            })
            .addCase(updateGoal.fulfilled, (s, a: PayloadAction<any>) => {
                s.isLoading = false;
                const updated = mapDocToGoal(a.payload);
                const idx = s.items.findIndex((g) => g.id === updated.id);
                if (idx !== -1) s.items[idx] = updated;
                s.stats = calculateStats(s.items);
            })
            .addCase(updateGoal.rejected, (s, a) => {
                s.isLoading = false;
                s.error = (a.payload as string) || "Error actualizando meta";
            })

            // DELETE
            .addCase(deleteGoal.pending, (s) => {
                s.isLoading = true;
                s.error = null;
            })
            .addCase(deleteGoal.fulfilled, (s, a: PayloadAction<string>) => {
                s.isLoading = false;
                s.items = s.items.filter((g) => g.id !== a.payload);
                s.stats = calculateStats(s.items);
            })
            .addCase(deleteGoal.rejected, (s, a) => {
                s.isLoading = false;
                s.error = (a.payload as string) || "Error eliminando meta";
            })

            // UPDATE PROGRESS
            .addCase(updateGoalProgress.pending, (s) => {
                s.isLoading = true;
                s.error = null;
            })
            .addCase(
                updateGoalProgress.fulfilled,
                (s, a: PayloadAction<any>) => {
                    s.isLoading = false;
                    const updated = mapDocToGoal(a.payload);
                    const idx = s.items.findIndex((g) => g.id === updated.id);
                    if (idx !== -1) s.items[idx] = updated;
                    s.stats = calculateStats(s.items);
                }
            )
            .addCase(updateGoalProgress.rejected, (s, a) => {
                s.isLoading = false;
                s.error =
                    (a.payload as string) || "Error actualizando progreso";
            });
    },
});

export const {
    setActiveFilter,
    setCategoryFilter,
    setSearchTerm,
    resetFilters,
} = goalsSlice.actions;

export default goalsSlice.reducer;
