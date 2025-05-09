// src/app/api/recommendations/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Recommendation from "../../../../models/Recommendation";

export const dynamic = "force-dynamic";

// Endpoint GET para recuperar recomendaciones existentes
export async function GET(req: Request) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Analizar URL para extraer parámetros opcionales
        const url = new URL(req.url);
        const transactionId = url.searchParams.get("transactionId");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const type = url.searchParams.get("type"); // Para filtrar por tipo de recomendación

        await connectDB();

        // Construir consulta
        const query: any = { userId };

        if (transactionId) {
            query.transactionId = transactionId;
        }

        if (type) {
            query.type = type;
        }

        console.log("[API] Buscando recomendaciones con query:", query);

        // Buscar recomendaciones
        const recommendations = await Recommendation.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        console.log(
            `[API] Encontradas ${recommendations.length} recomendaciones`
        );

        return NextResponse.json({ recommendations }, { status: 200 });
    } catch (error: any) {
        console.error("[API] Error al obtener recomendaciones:", error);
        return NextResponse.json(
            { error: "Error al obtener recomendaciones" },
            { status: 500 }
        );
    }
}
