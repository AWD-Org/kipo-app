// src/app/api/cards/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Card from "../../../../models/Card";
import { z } from "zod";

const cardSchema = z.object({
    name: z.string().min(1),
    brand: z.enum(["visa", "mastercard", "amex", "discover", "other"]),
    kind: z.enum(["debito", "credito"]),
    cutoffDate: z.string().transform((s) => new Date(s)),
    dueDate: z.string().transform((s) => new Date(s)),
    minPayment: z.number().positive(),
    noInterestPayment: z.number().positive(),
    status: z.enum(["pagada", "sin pagar"]).optional(),
});

// GET /api/cards
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return NextResponse.json({ error: "No auth" }, { status: 401 });
    await connectDB();
    const cards = await Card.find({ user: session.user.id }).lean();
    return NextResponse.json({ data: cards });
}

// POST /api/cards
export async function POST(req: NextRequest) {
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
    const card = await Card.create({ user: session.user.id, ...parsed.data });
    return NextResponse.json({ data: card }, { status: 201 });
}
