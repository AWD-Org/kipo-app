import { createAsyncThunk } from "@reduxjs/toolkit";
import { Goal } from "@/types/goal";

export const fetchGoals = createAsyncThunk<
    Goal[],
    void,
    { rejectValue: string }
>("goals/fetchGoals", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch("/api/goals", { credentials: "include" });
        if (!res.ok) {
            const err = await res.json();
            return rejectWithValue(err.error || "Error obteniendo metas");
        }
        const body = await res.json();
        return Array.isArray(body.data) ? body.data : [];
    } catch (e: any) {
        console.error(e);
        return rejectWithValue("Error de red");
    }
});

export const addGoal = createAsyncThunk<
    Goal,
    Omit<Goal, "id">,
    { rejectValue: string }
>("goals/addGoal", async (goalData, { rejectWithValue }) => {
    try {
        const res = await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(goalData),
        });
        if (!res.ok) {
            const err = await res.json();
            return rejectWithValue(err.error || "Error añadiendo meta");
        }
        const body = await res.json();
        return body.data as Goal;
    } catch (e: any) {
        console.error(e);
        return rejectWithValue("Error de red");
    }
});

export const updateGoal = createAsyncThunk<Goal, Goal, { rejectValue: string }>(
    "goals/updateGoal",
    async (goalData, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/goals/${goalData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(goalData),
            });
            if (!res.ok) {
                const err = await res.json();
                return rejectWithValue(err.error || "Error actualizando meta");
            }
            const body = await res.json();
            return body.data as Goal;
        } catch (e: any) {
            console.error(e);
            return rejectWithValue("Error de red");
        }
    }
);

export const deleteGoal = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("goals/deleteGoal", async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const { error } = await res.json();
            return rejectWithValue(error || "Error eliminando meta");
        }
        return id;
    } catch (e: any) {
        console.error(e);
        return rejectWithValue("Error de red");
    }
});

export const updateGoalProgress = createAsyncThunk<
    Goal,
    { id: string; amount: number },
    { rejectValue: string }
>("goals/updateGoalProgress", async ({ id, amount }, { rejectWithValue }) => {
    try {
        const res = await fetch(`/api/goals/${id}/progress`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        if (!res.ok) {
            const err = await res.json();
            return rejectWithValue(err.error || "Error actualizando progreso");
        }
        const body = await res.json();
        return body.data as Goal;
    } catch (e: any) {
        console.error(e);
        return rejectWithValue("Error de red");
    }
});
