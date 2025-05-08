// src/app/api/goals/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Goal from "../../../../../models/Goal";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    await connectDB();
    const goal = await Goal.findById(params.id);
    if (!goal) {
        return NextResponse.json(
            { error: "Meta no encontrada" },
            { status: 404 }
        );
    }
    if (goal.user.toString() !== session.user.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await Goal.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, id: params.id }, { status: 200 });
}

// (Opcional) aquí también podrías poner PUT para actualizar la meta completa
