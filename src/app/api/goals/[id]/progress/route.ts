// src/app/api/goals/[id]/progress/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Goal from "../../../../../../models/Goal";
import { z } from "zod";

// Validate incoming body
const progressSchema = z.object({
    amount: z
        .number()
        .positive({ message: "El monto debe ser un número positivo" }),
});

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    // 1) Check session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2) Validate body
    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                error:
                    parsed.error.flatten().fieldErrors.amount?.[0] ||
                    "Monto inválido",
            },
            { status: 400 }
        );
    }
    const { amount } = parsed.data;

    // 3) Connect to DB and fetch the goal
    await connectDB();
    const goal = await Goal.findById(params.id);
    if (!goal) {
        return NextResponse.json(
            { error: "Meta no encontrada" },
            { status: 404 }
        );
    }
    // 4) Make sure it belongs to the session user
    if (goal.user.toString() !== session.user.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // 5) Update progress
    goal.currentAmount += amount;
    if (goal.currentAmount >= goal.targetAmount) {
        goal.isCompleted = true;
    }
    await goal.save();

    // 6) Return updated document
    return NextResponse.json({ data: goal }, { status: 200 });
}
