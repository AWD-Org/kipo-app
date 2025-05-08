// src/store/slices/cardsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "@/types/card";
import {
    fetchCards,
    addCard,
    updateCard,
    deleteCard,
    toggleCardStatus,
} from "../thunks/cardsThunks";

interface CardsState {
    items: Card[];
    isLoading: boolean;
    error: string | null;
    filter: string; // texto libre para buscar por nombre
    statusFilter: "all" | "pagada" | "sin pagar";
}

const initialState: CardsState = {
    items: [],
    isLoading: false,
    error: null,
    filter: "",
    statusFilter: "all",
};

const cardsSlice = createSlice({
    name: "cards",
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        setStatusFilter: (
            state,
            action: PayloadAction<"all" | "pagada" | "sin pagar">
        ) => {
            state.statusFilter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH CARDS
            .addCase(fetchCards.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchCards.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload!;
            })

            // ADD CARD
            .addCase(addCard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addCard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);
            })
            .addCase(addCard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload!;
            })

            // UPDATE CARD
            .addCase(updateCard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCard.fulfilled, (state, action) => {
                state.isLoading = false;
                const idx = state.items.findIndex(
                    (c) => c.id === action.payload.id
                );
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateCard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload!;
            })

            // DELETE CARD
            .addCase(deleteCard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(
                    (c) => c.id !== action.payload
                );
            })
            .addCase(deleteCard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload!;
            })

            // TOGGLE CARD STATUS
            .addCase(toggleCardStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(toggleCardStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const idx = state.items.findIndex(
                    (c) => c.id === action.payload.id
                );
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(toggleCardStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload!;
            });
    },
});

export const { setFilter, setStatusFilter } = cardsSlice.actions;
export default cardsSlice.reducer;
