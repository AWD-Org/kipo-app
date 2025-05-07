// src/app/api/auth/onboarding/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "../../../../../models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        // 1) Obtener y loguear cookies
        console.log("🏷 Cookies recibidas:", req.headers.get("cookie"));

        // 2) Verificar sesión en el servidor
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        // 3) Parsear y validar body
        const {
            monthlyIncome,
            monthlyExpenses,
            mainExpenseCategories,
            savingsGoal,
            referralSource,
        } = await req.json();

        if (
            monthlyIncome == null ||
            monthlyExpenses == null ||
            !Array.isArray(mainExpenseCategories) ||
            savingsGoal == null ||
            !referralSource
        ) {
            return NextResponse.json(
                { error: "Faltan campos o son inválidos" },
                { status: 400 }
            );
        }

        // 4) Conectar a MongoDB
        await connectDB();

        // 5) Actualizar usuario
        const updated = await User.findByIdAndUpdate(
            session.user.id,
            {
                monthlyIncome,
                monthlyExpenses,
                mainExpenseCategories,
                savingsGoal,
                referralSource,
                isOnboarded: true,
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // 6) Responder OK
        return NextResponse.json(
            { message: "Onboarding completado", user: { id: updated._id } },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Onboarding error:", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
