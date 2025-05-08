// src/app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Transaction from "../../../../models/Transaction";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
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

    return NextResponse.json({ data: tx }, { status: 200 });
}
