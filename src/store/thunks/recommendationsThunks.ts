// src/store/thunks/recommendationsThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { Recommendation } from "@/types/recommendation";

/**
 * Thunk para obtener las recomendaciones existentes mediante GET
 */
export const fetchRecommendations = createAsyncThunk<
    Recommendation[],
    {
        transactionId?: string;
        limit?: number;
        type?: "ALERTA_CATEGORIA" | "ALERTA_GLOBAL" | "CONSEJO_HABITO" | "META_NUEVA";
    }
>("recommendations/fetch", async (params = {}, { rejectWithValue }) => {
    try {
        // Construir URL con parámetros opcionales
        let url = '/api/recommendations';
        
        if (params) {
            const queryParams = new URLSearchParams();
            
            if (params?.transactionId) {
                queryParams.append('transactionId', params.transactionId!);
            }
            
            if (params?.limit) {
                queryParams.append('limit', params.limit!.toString());
            }
            
            if (params?.type) {
                queryParams.append('type', params.type!);
            }
            
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }
        
        console.log(`[Thunk] Fetching recommendations from: ${url}`);
        
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Para incluir cookies de sesión
        });
        
        if (!res.ok) {
            const error = await res.json();
            console.error("Error fetching recommendations:", error);
            return rejectWithValue(error.error || "Error obteniendo recomendaciones");
        }
        
        const data = await res.json();
        return data.recommendations as Recommendation[];
    } catch (error: any) {
        console.error("Exception in fetchRecommendations:", error);
        return rejectWithValue(error.message || "Error al obtener recomendaciones");
    }
});