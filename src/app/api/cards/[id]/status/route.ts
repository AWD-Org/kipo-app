import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import Card from "../../../../../../models/Card";
import { z } from "zod";

const statusSchema = z.object({
    status: z.enum(["pagada", "sin pagar"]),
});

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }
    await connectDB();
    const card = await Card.findById(params.id);
    if (!card)
        return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    if (card.user.toString() !== session.user.id)
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    card.status = parsed.data.status;
    await card.save();
    return NextResponse.json({ data: card });
}
