// src/store/slices/analyticsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnalyticsSummary } from "@/types/analytics";
import { fetchAnalyticsSummary } from "../thunks/analyticsThunks";

interface AnalyticsState {
    summary: AnalyticsSummary;
    loading: boolean;
    error?: string;
}

const initialState: AnalyticsState = {
    summary: {
        availableBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        totalGoals: 0,
        savingsRate: 0,
        balanceDiffLabel: "",
        incomeDiffLabel: "",
        expenseDiffLabel: "",
    },
    loading: false,
};

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticsSummary.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(
                fetchAnalyticsSummary.fulfilled,
                (state, action: PayloadAction<AnalyticsSummary>) => {
                    state.loading = false;
                    state.summary = action.payload;
                }
            )
            .addCase(fetchAnalyticsSummary.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export default analyticsSlice.reducer;
