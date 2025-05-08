"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Transaction from "../../../models/Transaction";

export async function createTransaction(formData: FormData) {
    // 1) Verificar sesión en servidor
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: "No autenticado" };
    }

    try {
        // 2) Conectar a la base de datos
        await connectDB();

        // 3) Extraer campos de FormData y normalizar tipos
        const data: {
            type: string;
            amount: number;
            category: string;
            description: string;
            date: string;
            isRecurrent: boolean;
            recurrenceFrequency: string;
            tags: string[];
            user: string;
        } = {
            type: "",
            amount: 0,
            category: "",
            description: "",
            date: "",
            isRecurrent: false,
            recurrenceFrequency: "none",
            tags: [],
            user: session.user.id,
        };

        formData.forEach((value, key) => {
            switch (key) {
                case "amount":
                    data.amount = parseFloat(value.toString());
                    break;
                case "isRecurrent":
                    data.isRecurrent = value === "on";
                    break;
                case "tags":
                    data.tags.push(value.toString());
                    break;
                default:
                    // @ts-ignore
                    data[key] = value.toString();
            }
        });

        // 4) Crear la transacción asociada al usuario
        const tx = await Transaction.create(data);

        return { success: true, data: tx };
    } catch (err: any) {
        console.error("createTransaction error:", err);
        return {
            success: false,
            error: "Error interno al crear la transacción",
        };
    }
}
