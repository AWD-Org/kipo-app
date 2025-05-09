// src/app/actions/createTransaction.ts

"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Transaction from "../../../models/Transaction";
import Recommendation from "../../../models/Recommendation";
import User from "../../../models/User";
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

export async function createTransaction(formData: FormData) {
    // 1) Sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: "No autenticado" };
    }
    const userId = session.user.id;

    try {
        // 2) Conexión
        await connectDB();

        // 3) Parsear formData
        const data: any = {
            type: "EXPENSE",
            amount: 0,
            category: "",
            description: "",
            date: new Date().toISOString(),
            isRecurrent: false,
            recurrenceFrequency: "none",
            tags: [],
        };
        formData.forEach((value, key) => {
            switch (key) {
                case "amount":
                    data.amount = parseFloat(value.toString());
                    break;
                case "type":
                    data.type =
                        value.toString() === "INCOME" ? "INCOME" : "EXPENSE";
                    break;
                case "isRecurrent":
                    data.isRecurrent = value === "on";
                    break;
                case "tags":
                    data.tags.push(value.toString());
                    break;
                default:
                    data[key] = value.toString();
            }
        });

        // 4) Crear la transacción
        const tx = await Transaction.create({
            ...data,
            user: userId,
            date: new Date(data.date),
        });

        // 5) Leer datos financieros del usuario incluyendo mainExpenseCategories
        const userDoc = await User.findById(userId).lean<IUserLean>().exec();
        const monthlyIncome = userDoc?.monthlyIncome ?? 0;
        const monthlyExpenses = userDoc?.monthlyExpenses ?? 0;
        const savingGoal = userDoc?.savingsGoal ?? 0;

        // Obtener las categorías principales del usuario
        const topExpenseCategories = userDoc?.mainExpenseCategories || [];

        console.log("[createTransaction] Datos financieros del usuario:", {
            monthlyIncome,
            monthlyExpenses,
            savingGoal,
            topExpenseCategories,
        });

        // 7) Params IA
        const recParams: RecommendationParams = {
            userId: userId.toString(),
            transactionId: tx._id.toString(),
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            monthlyIncome,
            monthlyExpenses,
            topExpenseCategories,
            savingGoal,
        };

        console.log(
            "[createTransaction] Parámetros para IA:",
            JSON.stringify(recParams, null, 2)
        );

        try {
            // 8) Generar recomendaciones
            const recs = await generateRecommendations(recParams);
            console.log(
                `[createTransaction] IA returned ${recs.length} recommendations:`,
                JSON.stringify(recs, null, 2)
            );

            // 9) Guardar recomendaciones en BD
            let savedRecs: any[] = [];
            if (recs.length > 0) {
                try {
                    savedRecs = await Recommendation.create(recs);
                    console.log(
                        `[createTransaction] saved ${savedRecs.length} recommendations`
                    );
                } catch (dbErr) {
                    console.error(
                        "[createTransaction] Error al guardar recomendaciones:",
                        dbErr
                    );
                }
            } else {
                console.log(
                    "[createTransaction] No hay recomendaciones para guardar"
                );
            }

            // 10) Retornar
            return {
                success: true,
                data: {
                    transaction: tx,
                    recommendations: savedRecs,
                },
            };
        } catch (recErr) {
            console.error(
                "[createTransaction] Error generando recomendaciones:",
                recErr
            );

            // Aún retornamos la transacción creada, pero sin recomendaciones
            return {
                success: true,
                data: {
                    transaction: tx,
                    recommendations: [],
                },
            };
        }
    } catch (err: any) {
        console.error("createTransaction error:", err);
        return {
            success: false,
            error: "Error interno al crear la transacción",
        };
    }
}
