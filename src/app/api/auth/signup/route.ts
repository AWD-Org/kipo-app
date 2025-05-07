// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from '../../../../../models/User';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Todos los campos son requeridos" },
                { status: 400 }
            );
        }

        await connectDB();
        if (await User.findOne({ email })) {
            return NextResponse.json(
                { error: "El usuario ya existe" },
                { status: 409 }
            );
        }

        // Deja que el hook `pre('save')` haga el hash por ti
        await User.create({ name, email, password, isOnboarded: false });

        return NextResponse.json(
            { message: "Usuario creado" },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("Signup error:", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
