import { Anthropic } from "@anthropic-ai/sdk";
import { Recommendation } from "@/types/recommendation";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface RecommendationParams {
    userId: string;
    transactionId: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    topExpenseCategories?: string[];
    savingGoal?: number;
}

export async function generateRecommendations(
    params: RecommendationParams
): Promise<Omit<Recommendation, "_id">[]> {
    try {
        const {
            userId,
            transactionId,
            amount,
            type,
            category,
            monthlyIncome,
            monthlyExpenses,
            topExpenseCategories,
            savingGoal,
        } = params;

        // Confirma clave
        console.log(
            "[aiRecommendations] API Key present:",
            !!process.env.ANTHROPIC_API_KEY
        );

        if (!process.env.ANTHROPIC_API_KEY) {
            console.error("[aiRecommendations] API Key no encontrada");
            return [];
        }

        // Construye el prompt
        const lines: string[] = [
            `Eres un asesor financiero IA.`,
            `Usuario: ${userId}`,
            `Transacción:`,
            `  - ID: ${transactionId}`,
            `  - Tipo: ${type === "INCOME" ? "Ingreso" : "Gasto"}`,
            `  - Monto: $${amount}`,
            `  - Categoría: ${category}`,
        ];

        if (monthlyIncome !== undefined)
            lines.push(`Ingresos mensuales: $${monthlyIncome}`);
        if (monthlyExpenses !== undefined)
            lines.push(`Gastos mensuales: $${monthlyExpenses}`);
        if (topExpenseCategories?.length) {
            lines.push(
                `Principales categorías de gasto: ${topExpenseCategories.join(
                    ", "
                )}`
            );
        }
        if (savingGoal !== undefined)
            lines.push(`Meta de ahorro: $${savingGoal}`);

        lines.push(
            `\nAnaliza esta transacción y genera recomendaciones financieras personalizadas.`,
            `Debes devolver SOLO un array JSON con objetos como este:`,
            `[`,
            `  {`,
            `    "type": "ALERTA_CATEGORIA",`,
            `    "title": "Título corto",`,
            `    "message": "Mensaje detallado para el usuario",`,
            `    "relatedCategory": "Categoría relacionada"`,
            `  }`,
            `]`,
            `Si no hay recomendaciones relevantes, devuelve [].`,
            `Los tipos posibles son: "ALERTA_CATEGORIA", "ALERTA_GLOBAL", "CONSEJO_HABITO", "META_NUEVA".`,
            `NO incluyas explicaciones, solo devuelve el array JSON.`
        );

        const prompt = lines.join("\n");
        console.log("[aiRecommendations] prompt:", prompt);

        // Llamada a la API de Anthropic
        const resp = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500, // Aumentado para asegurar respuesta completa
            temperature: 0.3,
        });

        // Extrae el texto de la respuesta
        const rawCompletion =
            resp.content[0]?.type === "text" ? resp.content[0].text : "";
        console.log("[aiRecommendations] raw completion:", rawCompletion);

        // Busca cualquier array JSON en la respuesta usando regex más robusta
        const jsonRegex = /\[\s*\{[\s\S]*?\}\s*\]/;
        const match = rawCompletion.match(jsonRegex);
        let rawJson = match ? match[0] : "[]";

        // Parseo
        try {
            const arr = JSON.parse(rawJson) as Omit<Recommendation, "_id">[];
            console.log("[aiRecommendations] parsed recommendations:", arr);

            if (!Array.isArray(arr)) {
                console.error(
                    "[aiRecommendations] Resultado no es un array:",
                    rawJson
                );
                return [];
            }

            // No incluimos _id para que MongoDB lo genere automáticamente
            return arr.map((r) => ({
                userId,
                transactionId,
                type: r.type,
                title: r.title,
                message: r.message,
                relatedCategory: r.relatedCategory,
                createdAt: new Date().toISOString(),
            }));
        } catch (err) {
            console.error(
                "[aiRecommendations] JSON parse error:",
                err,
                "\nrawJson:",
                rawJson
            );
            return [];
        }
    } catch (error) {
        console.error("[aiRecommendations] Error general:", error);
        return [];
    }
}
