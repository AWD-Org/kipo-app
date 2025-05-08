// src/app/api/goals/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { z } from "zod";
import { generateSavingPlan } from "@/lib/financialAI";
import Goal from "../../../../models/Goal";
import User from "../../../../models/User";

const goalSchema = z.object({
    user: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    targetAmount: z.number().positive(),
    currentAmount: z.number().nonnegative(),
    startDate: z.date(),
    targetDate: z.date(),
    category: z.enum(["ahorro", "inversión", "deuda", "compra", "otro"]),
    priority: z.enum(["baja", "media", "alta"]),
    reminderFrequency: z.enum(["none", "daily", "weekly", "monthly"]),
});

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    await connectDB();
    const goals = await Goal.find({ user: session.user.id }).sort({
        targetDate: 1,
    });
    return NextResponse.json({ data: goals });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // parsear body
    const body = await req.json();

    try {
        // 1) Validar + transformar
        const parsed = goalSchema.parse({
            user: session.user.id,
            ...body,
            startDate: new Date(body.startDate),
            targetDate: new Date(body.targetDate),
        });

        // 2) Conectar DB
        await connectDB();

        // 3) Obtener datos financieros del usuario para el plan
        const user = await User.findById(session.user.id);
        const monthlyIncome = user?.monthlyIncome ?? 0;
        const monthlyExpenses = user?.monthlyExpenses ?? 0;

        // 4) Generar plan de ahorro
        const suggestedPlan = await generateSavingPlan({
            monthlyIncome,
            monthlyExpenses,
            savingGoal: parsed.targetAmount,
            startDate: parsed.startDate.toISOString(),
            targetDate: parsed.targetDate.toISOString(),
        });

        // 5) Crear la meta con el plan sugerido
        const created = await Goal.create({
            ...parsed,
            isCompleted: parsed.currentAmount >= parsed.targetAmount,
            isActive: true,
            suggestedPlan,
        });

        return NextResponse.json({ data: created }, { status: 201 });
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            // errores de validación
            return NextResponse.json(
                { error: e.flatten().fieldErrors },
                { status: 400 }
            );
        }
        console.error(e);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
