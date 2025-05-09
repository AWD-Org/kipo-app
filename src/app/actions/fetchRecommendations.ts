import { createAsyncThunk } from "@reduxjs/toolkit";
import { Recommendation } from "@/types/recommendation";

export const fetchRecommendations = createAsyncThunk<
    Recommendation[],
    {
        userId: string;
        transactionId: string;
        amount: number;
        type: "INCOME" | "EXPENSE";
        category: string;
        monthlyIncome?: number;
        monthlyExpenses?: number;
        topExpenseCategories?: string[];
        savingGoal?: number;
    }
>("recommendations/fetch", async (params) => {
    const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });
    const { recommendations } = await res.json();
    return recommendations as Recommendation[];
});
