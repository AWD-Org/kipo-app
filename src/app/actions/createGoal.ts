// src/app/actions/createGoal.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import Goal from "../../../models/Goal";
import User from "../../../models/User";
import { generateSavingPlan } from "@/lib/financialAI";

// Define aquí la interfaz de los campos que esperamos del usuario
interface IUserLean {
    monthlyIncome?: number;
    monthlyExpenses?: number;
}

const goalSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().optional(),
    targetAmount: z.coerce
        .number()
        .positive("El monto objetivo debe ser positivo"),
    currentAmount: z.coerce
        .number()
        .nonnegative("El monto actual no puede ser negativo")
        .default(0),
    startDate: z.preprocess((v) => new Date(String(v)), z.date()),
    targetDate: z.preprocess((v) => new Date(String(v)), z.date()),
    category: z.enum(["ahorro", "inversión", "deuda", "compra", "otro"]),
    priority: z.enum(["baja", "media", "alta"]),
    reminderFrequency: z.enum(["none", "daily", "weekly", "monthly"]),
});
type GoalForm = z.infer<typeof goalSchema>;

export async function createGoal(formData: FormData) {
    try {
        // 1) Verificar sesión
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: "No autenticado" };
        }

        // 2) Validar datos de entrada
        const raw = Object.fromEntries(formData.entries());
        const validated: GoalForm = goalSchema.parse(raw);

        // 3) Conectar a la BD
        await connectDB();

        // 4) Leer montos del usuario (tipando el resultado de .lean())
        const userDoc = await User.findById(session.user.id)
            .lean<IUserLean>()
            .exec();
        const monthlyIncome = userDoc?.monthlyIncome ?? 0;
        const monthlyExpenses = userDoc?.monthlyExpenses ?? 0;

        // 5) Generar plan de ahorro sugerido
        const suggestedPlan = await generateSavingPlan({
            monthlyIncome,
            monthlyExpenses,
            savingGoal: validated.targetAmount,
            startDate: validated.startDate.toISOString(),
            targetDate: validated.targetDate.toISOString(),
        });

        // 6) Crear la meta en DB
        const createdDoc = await Goal.create({
            user: session.user.id,
            ...validated,
            isCompleted: validated.currentAmount >= validated.targetAmount,
            isActive: true,
            suggestedPlan,
        });

        // 7) Revalidar ruta de listado de metas
        revalidatePath("/dashboard/goals");

        // 8) Devolver un objeto plano
        const plain = {
            id: createdDoc._id.toString(),
            title: createdDoc.title,
            description: createdDoc.description,
            targetAmount: createdDoc.targetAmount,
            currentAmount: createdDoc.currentAmount,
            startDate: createdDoc.startDate.toISOString(),
            targetDate: createdDoc.targetDate.toISOString(),
            category: createdDoc.category,
            priority: createdDoc.priority,
            reminderFrequency: createdDoc.reminderFrequency,
            isCompleted: createdDoc.isCompleted,
            isActive: createdDoc.isActive,
            suggestedPlan: {
                monthly: createdDoc.suggestedPlan.monthly,
                weekly: createdDoc.suggestedPlan.weekly,
            },
        };

        return { success: true, data: plain };
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return {
                success: false,
                validationErrors: err.flatten().fieldErrors,
            };
        }
        console.error("createGoal error:", err);
        return { success: false, error: "Error al procesar la meta" };
    }
}
