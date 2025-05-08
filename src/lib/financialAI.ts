// src/lib/financialAI.ts

import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface SavingPlanResponse {
    monthly: number;
    weekly: number;
}

export async function generateSavingPlan(params: {
    monthlyIncome: number;
    monthlyExpenses: number;
    savingGoal: number;
    startDate: string; // ISO format
    targetDate: string; // ISO format
}): Promise<SavingPlanResponse> {
    const {
        monthlyIncome,
        monthlyExpenses,
        savingGoal,
        startDate,
        targetDate,
    } = params;

    // 1) Calcula la diferencia en días
    const start = new Date(startDate).getTime();
    const end = new Date(targetDate).getTime();
    const diffMs = Math.max(end - start, 0);
    const diffDays = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 1);

    // 2) Deriva meses y semanas
    const months = diffDays / 30;
    const weeks = diffDays / 7;

    // 3) Construye el prompt para Anthropic
    const userContent = `
Usuario con ingresos mensuales ${monthlyIncome} y gastos mensuales ${monthlyExpenses}
quiere ahorrar ${savingGoal} en ${diffDays} días.
Sugiéreme cuánto debe aportar cada mes y cada semana, RESPONDE SOLO con un objeto JSON así:
{ "monthly": X, "weekly": Y }
No incluyas ningún texto adicional, solo el objeto JSON.
  `.trim();

    console.log("[FinancialAI] prompt:", userContent);

    // 4) Llamada a Anthropic
    const resp = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 200,
        temperature: 0.5,
        system: "Eres un asistente financiero. Responde ÚNICAMENTE con JSON válido que contenga los montos de ahorro mensual y semanal sin texto adicional.",
        messages: [{ role: "user", content: userContent }],
    });

    console.log("[FinancialAI] raw response:", resp);

    // 5) Extrae el JSON de la respuesta
    let text = "";
    if (Array.isArray(resp.content) && resp.content.length > 0) {
        const block = resp.content[0];
        if (block.type === "text") {
            text = block.text;
            const match = text.match(/\{[\s\S]*\}/);
            if (match) text = match[0];
        }
    }

    // 6) Intento de parseo y fallback
    try {
        const parsed = JSON.parse(text.trim());
        console.log("[FinancialAI] parsed:", parsed);
        return {
            monthly: Number(parsed.monthly),
            weekly: Number(parsed.weekly),
        };
    } catch (err) {
        console.error("[FinancialAI] JSON parse error, fallback:", err);
        // Fallback: cálculo local
        const monthly = parseFloat((savingGoal / months).toFixed(2));
        const weekly = parseFloat((savingGoal / weeks).toFixed(2));
        return { monthly, weekly };
    }
}
