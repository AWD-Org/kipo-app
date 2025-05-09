// src/app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Transaction from "../../../../models/Transaction";
import Recommendation from "../../../../models/Recommendation";
import User from "../../../../models/User";
import {
    generateRecommendations,
    RecommendationParams,
} from "@/lib/aiRecommendations";

// Define aquí la interfaz de los campos que esperamos del usuario
interface IUserLean {
    monthlyIncome?: number;
    monthlyExpenses?: number;
    mainExpenseCategories?: string[];
    savingsGoal?: number;
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    await connectDB();
    const items = await Transaction.find({ user: session.user.id }).sort({
        date: -1,
    });
    return NextResponse.json({ data: items });
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const form = (await req.json?.()) ?? (await req.formData());
        // Si envías JSON desde el cliente, usa req.json(); si usas FormData, maneja form.get(...)

        const {
            type,
            amount,
            category,
            description = "",
            date,
            isRecurrent = false,
            recurrenceFrequency = "none",
            tags = [],
        } = typeof form === "object" && !(form instanceof FormData)
            ? form
            : {
                  // si fuera FormData:
                  type: form.get("type"),
                  amount: parseFloat(form.get("amount") as string),
                  category: form.get("category"),
                  description: form.get("description"),
                  date: form.get("date"),
                  isRecurrent: form.get("isRecurrent") === "on",
                  recurrenceFrequency: form.get("recurrenceFrequency"),
                  tags: form.getAll("tags"),
              };

        // Validaciones básicas
        if (!type || !amount || !category || !date) {
            return NextResponse.json(
                { error: "Campos obligatorios faltantes" },
                { status: 400 }
            );
        }

        await connectDB();
        // 1. Crear la transacción
        const tx = await Transaction.create({
            user: session.user.id,
            type,
            amount,
            category,
            description,
            date: new Date(date),
            isRecurrent,
            recurrenceFrequency,
            tags,
        });

        // 2. Leer datos financieros del usuario incluyendo mainExpenseCategories
        const userDoc = await User.findById(session.user.id)
            .lean<IUserLean>()
            .exec();
        const monthlyIncome = userDoc?.monthlyIncome ?? 0;
        const monthlyExpenses = userDoc?.monthlyExpenses ?? 0;
        const savingGoal = userDoc?.savingsGoal ?? 0;

        // Obtener las categorías principales del usuario
        const topExpenseCategories = userDoc?.mainExpenseCategories || [];

        console.log("[API] Datos financieros del usuario:", {
            monthlyIncome,
            monthlyExpenses,
            savingGoal,
            topExpenseCategories,
        });

        // 4. Preparar parámetros para IA
        const recParams: RecommendationParams = {
            userId: session.user.id.toString(),
            transactionId: tx._id.toString(),
            amount,
            type,
            category,
            monthlyIncome,
            monthlyExpenses,
            topExpenseCategories,
            savingGoal,
        };

        console.log(
            "[API] Generando recomendaciones con params:",
            JSON.stringify(recParams, null, 2)
        );

        // 5. Generar recomendaciones
        const recsData = await generateRecommendations(recParams);
        console.log(`[API] IA generó ${recsData.length} recomendaciones`);

        // 6. Guardar recomendaciones en BD usando create() en lugar de insertMany()
        let savedRecs: any[] = [];
        if (recsData.length > 0) {
            try {
                savedRecs = await Recommendation.create(recsData);
                console.log(
                    `[API] Guardadas ${savedRecs.length} recomendaciones en BD`
                );
            } catch (error) {
                console.error("[API] Error al guardar recomendaciones:", error);
            }
        }

        // 7. Retornar la transacción y las recomendaciones
        return NextResponse.json(
            {
                data: {
                    transaction: tx,
                    recommendations: savedRecs,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("[API] Error en POST /api/transactions:", error);
        return NextResponse.json(
            { error: "Error al procesar la transacción" },
            { status: 500 }
        );
    }
}
