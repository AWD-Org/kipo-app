// src/types/analytics.ts
export interface AnalyticsSummary {
    availableBalance: number;
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    totalGoals: number;
    savingsRate: number; // 0–1
    balanceDiffLabel: string;
    incomeDiffLabel: string;
    expenseDiffLabel: string;
}
