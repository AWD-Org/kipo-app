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

    // 1) Calculate months between
    const msPerMonth = 1000 * 60 * 60 * 24 * 30;
    const months = Math.max(
        1,
        Math.ceil(
            (new Date(targetDate).getTime() - new Date(startDate).getTime()) /
                msPerMonth
        )
    );

    // 2) Build the user content
    const userContent = `
Usuario con ingresos mensuales ${monthlyIncome} y gastos mensuales ${monthlyExpenses}
quiere ahorrar ${savingGoal} en ${months} meses.
Sugiéreme cuánto debe aportar cada mes y cada semana, RESPONDE SOLO con un objeto JSON así:
{ "monthly": X, "weekly": Y }
No incluyas ningún texto adicional, solo el objeto JSON.
`.trim();

    console.log("[FinancialAI] prompt:", userContent);

    // 3) Call Anthropic messages API with proper structure
    const resp = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 200,
        temperature: 0.5, // Lower temperature for more predictable output
        messages: [
            { role: "user", content: userContent }
        ],
        system: "Eres un asistente financiero. Responde ÚNICAMENTE con JSON válido que contenga los montos de ahorro mensual y semanal sin texto adicional."
    });

    console.log("[FinancialAI] raw response:", resp);

    // 4) Extract text from the response content
    let text = "";
    if (resp.content && resp.content.length > 0) {
        const contentBlock = resp.content[0];
        
        if (contentBlock.type === "text") {
            text = contentBlock.text;
            
            // Try to extract just the JSON object using regex
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                text = jsonMatch[0];
            }
        }
    }

    // 5) Try to JSON.parse or fallback
    try {
        const parsed = JSON.parse(text.trim());
        console.log("[FinancialAI] parsed:", parsed);
        return {
            monthly: Number(parsed.monthly),
            weekly: Number(parsed.weekly),
        };
    } catch (err) {
        console.error("[FinancialAI] JSON parse error, fallback:", err);
        const monthly = savingGoal / months;
        const weekly = monthly / 4;
        return { monthly, weekly };
    }
}