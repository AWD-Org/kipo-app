// src/store/slices/transactionsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/types/transaction";
import {
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} from "../thunks/transactionsThunks";

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

const initialState: TransactionsState = {
    items: [],
    isLoading: false,
    error: null,
    filter: {
        startDate: null,
        endDate: null,
        types: [],
        categories: [],
        searchTerm: "",
    },
    stats: {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
    },
};

/**
 * Ahora `transactions` tiene valor por defecto [] si llega undefined.
 */
const calculateStats = (transactions: Transaction[] = []) => {
    // aseguramos que transactions es array
    const arr = Array.isArray(transactions) ? transactions : [];

    const totalIncome = arr
        .filter((tx) => tx.type === "ingreso")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpenses = arr
        .filter((tx) => tx.type === "gasto")
        .reduce((sum, tx) => sum + tx.amount, 0);

    return {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
    };
};

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setDateFilter: (
            state,
            action: PayloadAction<{
                startDate: string | null;
                endDate: string | null;
            }>
        ) => {
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
        builder
            // FETCH
            .addCase(fetchTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchTransactions.fulfilled,
                (state, action: PayloadAction<Transaction[]>) => {
                    state.isLoading = false;
                    // Si payload llega undefined, lo convertimos a []
                    state.items = action.payload ?? [];
                    state.stats = calculateStats(state.items);
                }
            )
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    "Error al cargar las transacciones";
                // opcionalmente limpiamos items
                state.items = [];
                state.stats = calculateStats([]);
            })

            // ADD
            .addCase(addTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                addTransaction.fulfilled,
                (state, action: PayloadAction<Transaction>) => {
                    state.isLoading = false;
                    state.items.push(action.payload);
                    state.stats = calculateStats(state.items);
                }
            )
            .addCase(addTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    "Error al añadir la transacción";
            })

            // UPDATE
            .addCase(updateTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                updateTransaction.fulfilled,
                (state, action: PayloadAction<Transaction>) => {
                    state.isLoading = false;
                    const idx = state.items.findIndex(
                        (tx) => tx.id === action.payload.id
                    );
                    if (idx !== -1) state.items[idx] = action.payload;
                    state.stats = calculateStats(state.items);
                }
            )
            .addCase(updateTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    "Error al actualizar la transacción";
            })

            // DELETE
            .addCase(deleteTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                deleteTransaction.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.isLoading = false;
                    state.items = state.items.filter(
                        (tx) => tx.id !== action.payload
                    );
                    state.stats = calculateStats(state.items);
                }
            )
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    "Error al eliminar la transacción";
            });
    },
});

export const {
    setDateFilter,
    setTypeFilter,
    setCategoryFilter,
    setSearchTerm,
    resetFilters,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
