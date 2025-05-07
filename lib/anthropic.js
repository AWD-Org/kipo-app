import Anthropic from '@anthropic-ai/sdk';

// Inicializar el cliente de Anthropic con la clave API
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

/**
 * Función para generar recomendaciones financieras basadas en los datos del usuario
 * @param {Object} data - Datos del usuario y sus transacciones
 * @returns {Promise<Object>} - Objeto con recomendaciones generadas por Claude
 */
export async function generateFinancialInsights(data) {
  try {
    // Este es un stub - en producción, se enviarían datos reales a Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Analiza los siguientes datos financieros y proporciona 3 recomendaciones personalizadas:
          
          Ingresos mensuales: ${data.monthlyIncome}
          Gastos mensuales: ${data.monthlyExpenses}
          Principales categorías de gasto: ${data.expenses.join(', ')}
          Meta de ahorro: ${data.savingGoal}
          
          Proporciona recomendaciones específicas sobre cómo mejorar la situación financiera.`,
        },
      ],
    });

    return {
      success: true,
      insights: response.content[0].text,
    };
  } catch (error) {
    console.error('Error generando insights con Claude:', error);
    return {
      success: false,
      error: 'No se pudieron generar recomendaciones',
      // En producción: añadir más detalles específicos del error
    };
  }
}

/**
 * Función para analizar transacciones y detectar patrones
 * @param {Array} transactions - Lista de transacciones del usuario
 * @returns {Promise<Object>} - Objeto con análisis de patrones de gasto
 */
export async function analyzeSpendingPatterns(transactions) {
  // Este es un stub - se implementaría realmente en producción
  // Simula el análisis de patrones mediante Claude
  
  return {
    success: true,
    patterns: {
      excesiveSpending: ['restaurantes', 'entretenimiento'],
      savingOpportunities: ['transporte', 'suscripciones'],
      improvedCategories: ['comestibles'],
    },
    message: 'Análisis de patrones completado',
  };
}

export default {
  generateFinancialInsights,
  analyzeSpendingPatterns,
};
