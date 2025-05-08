// src/app/api/analytics/summary/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Transaction from "../../../../../models/Transaction";
import Goal from "../../../../../models/Goal";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;

    // Opcional: leer query params startDate, endDate
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    await connectDB();

    // Filtrar transacciones
    const txFilter: any = { user: userId };
    if (startDate || endDate) {
        txFilter.date = {};
        if (startDate) txFilter.date.$gte = new Date(startDate);
        if (endDate) txFilter.date.$lte = new Date(endDate);
    }
    const txs = await Transaction.find(txFilter).lean();

    // Filtrar metas activas
    const goals = await Goal.find({ user: userId }).lean();

    // Cálculos
    const totalIncome = txs
        .filter((t) => t.type === "ingreso")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = txs
        .filter((t) => t.type === "gasto")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);

    const availableBalance = totalIncome - totalExpenses;
    const savingsRate = totalGoals > 0 ? totalSavings / totalGoals : 0;

    // Diferencias vs mes anterior (puedes afinar lógica de fechas)
    // Para ejemplo rápido, asumimos valores dummy:
    const balanceDiffLabel = "+$500 vs. mes pasado";
    const incomeDiffLabel = "+$2,000 vs. mes pasado";
    const expenseDiffLabel = "-$1,500 vs. mes pasado";

    const summary = {
        availableBalance,
        totalIncome,
        totalExpenses,
        totalSavings,
        totalGoals,
        savingsRate,
        balanceDiffLabel,
        incomeDiffLabel,
        expenseDiffLabel,
    };

    return NextResponse.json({ data: summary });
}
