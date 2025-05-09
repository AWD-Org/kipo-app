// src/store/slices/recommendationsSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { fetchRecommendations } from "@/store/thunks/recommendationsThunks";
import { Recommendation } from "@/types/recommendation";

const recommendationsSlice = createSlice({
    name: "recommendations",
    initialState: {
        items: [] as Recommendation[],
        loading: false,
        error: "" as string | null,
    },
    reducers: {
        clearRecommendations(state) {
            state.items = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
