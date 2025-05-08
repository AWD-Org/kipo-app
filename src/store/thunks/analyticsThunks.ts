// src/store/thunks/analyticsThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AnalyticsSummary } from "@/types/analytics";

export const fetchAnalyticsSummary = createAsyncThunk<
    AnalyticsSummary,
    { userId: string; startDate?: string; endDate?: string },
    { rejectValue: string }
>(
    "analytics/fetchSummary",
    async ({ userId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const res = await fetch(`/api/analytics/summary?${params}`, {
                credentials: "include",
            });
            if (!res.ok) {
                const { error } = await res.json();
                return rejectWithValue(error || "Error obteniendo resumen");
            }
            const { data } = await res.json();
            return data as AnalyticsSummary;
        } catch (err: any) {
            console.error(err);
            return rejectWithValue("Error de red");
        }
    }
);
