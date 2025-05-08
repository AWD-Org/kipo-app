import { createAsyncThunk } from "@reduxjs/toolkit";
import { Transaction } from "@/types/transaction";

/**
 * Thunk para obtener todas las transacciones del usuario actualmente logueado.
 * Se espera que el endpoint `/api/transactions` use la sesión de NextAuth para
 * identificar al usuario y devolver sólo sus transacciones.
 */
export const fetchTransactions = createAsyncThunk<
    Transaction[],
    void,
    { rejectValue: string }
>("transactions/fetchTransactions", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch("/api/transactions", {
            credentials: "include",
        });
        if (!res.ok) {
            const body = await res.json();
            return rejectWithValue(
                body.error || "Error al obtener transacciones"
            );
        }
        const body = await res.json();
        // body.data debería ser un array. Si no, devolvemos [].
        return Array.isArray(body.data) ? body.data : [];
    } catch (err) {
        console.error(err);
        return rejectWithValue("Error de red");
    }
});

/**
 * Thunk para añadir una nueva transacción para el usuario actualmente logueado.
 * El backend debe leer la sesión y asociar la transacción al userId.
 */
export const addTransaction = createAsyncThunk<
    Transaction, // retorno
    Omit<Transaction, "id" | "user">, // datos que enviamos
    { rejectValue: string }
>(
    "transactions/addTransaction",
    async (transactionData, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionData),
            });
            if (!res.ok) {
                const { error } = await res.json();
                return rejectWithValue(error ?? "Error al añadir transacción");
            }
            const { transaction } = await res.json();
            return transaction as Transaction;
        } catch (err: any) {
            return rejectWithValue(
                err.message || "Error al añadir transacción"
            );
        }
    }
);

/**
 * Thunk para actualizar una transacción existente.
 * El backend debe validar la propiedad `user` en la sesión.
 */
export const updateTransaction = createAsyncThunk<
    Transaction, // retorno
    Transaction, // datos completos de la transacción a actualizar
    { rejectValue: string }
>(
    "transactions/updateTransaction",
    async (transactionData, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/transactions/${transactionData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionData),
            });
            if (!res.ok) {
                const { error } = await res.json();
                return rejectWithValue(
                    error ?? "Error al actualizar transacción"
                );
            }
            const { transaction } = await res.json();
            return transaction as Transaction;
        } catch (err: any) {
            return rejectWithValue(
                err.message || "Error al actualizar transacción"
            );
        }
    }
);

/**
 * Thunk para eliminar una transacción por su ID.
 * El backend debe validar la sesión y la propiedad `user`.
 */
export const deleteTransaction = createAsyncThunk<
    string, // retorna el id de la transacción eliminada
    string, // recibe el id a eliminar
    { rejectValue: string }
>("transactions/deleteTransaction", async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`/api/transactions/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const { error } = await res.json();
            return rejectWithValue(error ?? "Error al eliminar transacción");
        }
        return id;
    } catch (err: any) {
        return rejectWithValue(err.message || "Error al eliminar transacción");
    }
});
