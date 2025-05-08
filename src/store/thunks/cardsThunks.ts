// src/store/thunks/cardsThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card } from "@/types/card";

export const fetchCards = createAsyncThunk<
    Card[],
    void,
    { rejectValue: string }
>("cards/fetchCards", async (_, { rejectWithValue }) => {
    const res = await fetch("/api/cards", { credentials: "include" });
    if (!res.ok)
        return rejectWithValue((await res.json()).error || "Error fetching");
    const { data } = await res.json();
    return data.map((c: any) => ({ ...c, id: c._id })) as Card[];
});

export const addCard = createAsyncThunk<
    Card,
    Omit<Card, "id">,
    { rejectValue: string }
>("cards/addCard", async (cardData, { rejectWithValue }) => {
    const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cardData),
    });
    if (!res.ok)
        return rejectWithValue((await res.json()).error || "Error adding");
    const { data } = await res.json();
    return { ...data, id: data._id } as Card;
});

export const updateCard = createAsyncThunk<Card, Card, { rejectValue: string }>(
    "cards/updateCard",
    async (cardData, { rejectWithValue }) => {
        const res = await fetch(`/api/cards/${cardData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(cardData),
        });
        if (!res.ok)
            return rejectWithValue(
                (await res.json()).error || "Error updating"
            );
        const { data } = await res.json();
        return { ...data, id: data._id } as Card;
    }
);

export const deleteCard = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("cards/deleteCard", async (id, { rejectWithValue }) => {
    const res = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok)
        return rejectWithValue((await res.json()).error || "Error deleting");
    return id;
});

export const toggleCardStatus = createAsyncThunk<
    Card,
    { id: string; status: "pagada" | "sin pagar" },
    { rejectValue: string }
>("cards/toggleCardStatus", async ({ id, status }, { rejectWithValue }) => {
    const res = await fetch(`/api/cards/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
    });
    if (!res.ok)
        return rejectWithValue(
            (await res.json()).error || "Error toggling status"
        );
    const { data } = await res.json();
    return { ...data, id: data._id } as Card;
});
