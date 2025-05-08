// src/app/api/cards/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Card from "../../../../../models/Card";
import { z } from "zod";

const cardSchema = z.object({
    name: z.string().min(1),
    brand: z.enum(["visa", "mastercard", "amex", "discover", "other"]),
    kind: z.enum(["debito", "credito"]),
    cutoffDate: z.string().transform((s) => new Date(s)),
    dueDate: z.string().transform((s) => new Date(s)),
    minPayment: z.number().positive(),
    noInterestPayment: z.number().positive(),
    status: z.enum(["pagada", "sin pagar"]),
});

// PUT /api/cards/:id
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return NextResponse.json({ error: "No auth" }, { status: 401 });
    const body = await req.json();
    const parsed = cardSchema.safeParse(body);
    if (!parsed.success)
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );

    await connectDB();
    const card = await Card.findById(params.id);
    if (!card || card.user.toString() !== session.user.id)
        return NextResponse.json(
            { error: "Not found/authorized" },
            { status: 404 }
        );
    Object.assign(card, parsed.data);
    await card.save();
    return NextResponse.json({ data: card });
}

// DELETE /api/cards/:id
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return NextResponse.json({ error: "No auth" }, { status: 401 });
    await connectDB();
    const card = await Card.findById(params.id);
    if (!card || card.user.toString() !== session.user.id)
        return NextResponse.json(
            { error: "Not found/authorized" },
            { status: 404 }
        );
    await card.deleteOne();
    return NextResponse.json({ data: { id: params.id } });
}

// PATCH /api/cards/:id/status
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return NextResponse.json({ error: "No auth" }, { status: 401 });
    const { status } = await req.json();
    if (!["pagada", "sin pagar"].includes(status))
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    await connectDB();
    const card = await Card.findById(params.id);
    if (!card || card.user.toString() !== session.user.id)
        return NextResponse.json(
            { error: "Not found/authorized" },
            { status: 404 }
        );
    card.status = status;
    await card.save();
    return NextResponse.json({ data: card });
}
