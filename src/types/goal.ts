// src/types/goal.ts

/**
 * Tipos para las metas financieras
 */

// Categorías de metas
export type GoalCategory = "ahorro" | "inversión" | "deuda" | "compra" | "otro";

// Prioridades
export type GoalPriority = "baja" | "media" | "alta";

// Frecuencia de recordatorios
export type ReminderFrequency = "none" | "daily" | "weekly" | "monthly";

// Plan de ahorro sugerido por IA
export interface SuggestedPlan {
    monthly: number;
    weekly: number;
}

// Interfaz para las metas
export interface Goal {
    id: string;
    userId: string;
    title: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    startDate: string;
    targetDate: string;
    category: GoalCategory;
    priority: GoalPriority;
    isCompleted: boolean;
    isActive: boolean;
    reminderFrequency: ReminderFrequency;
    // Nueva propiedad
    suggestedPlan?: SuggestedPlan;
}

// Interfaz para estadísticas de metas
export interface GoalStats {
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    completionRate: number;
    byCategory: Array<{
        name: GoalCategory;
        count: number;
        targetAmount: number;
        currentAmount: number;
        completionRate: number;
    }>;
}
