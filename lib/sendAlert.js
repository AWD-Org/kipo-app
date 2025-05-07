import sgMail from '@sendgrid/mail';

// Configurar API key de SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Función para enviar una alerta por email
 * @param {Object} options - Opciones del email
 * @param {string} options.to - Email del destinatario
 * @param {string} options.subject - Asunto del email
 * @param {string} options.text - Texto plano del email
 * @param {string} options.html - Contenido HTML del email
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function sendEmail({ to, subject, text, html }) {
  // Verificar que la API key está configurada
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY no está configurada. No se enviará el email.');
    return {
      success: false,
      message: 'API key no configurada',
    };
  }

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'notificaciones@kipo-app.com',
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    
    return {
      success: true,
      message: 'Email enviado correctamente',
    };
  } catch (error) {
    console.error('Error enviando email:', error);
    return {
      success: false,
      message: 'Error al enviar email',
      error: error.message,
    };
  }
}

/**
 * Función para enviar una alerta de objetivo cercano a cumplirse
 * @param {Object} user - Usuario al que enviar la alerta
 * @param {Object} goal - Meta que está por cumplirse
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function sendGoalNearCompletionAlert(user, goal) {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  
  return sendEmail({
    to: user.email,
    subject: `¡Estás cerca de alcanzar tu meta: ${goal.title}!`,
    text: `¡Felicidades ${user.name}! Has completado el ${percentage.toFixed(0)}% de tu meta "${goal.title}". Sigue así, ¡ya casi lo logras!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4f46e5;">¡Estás muy cerca!</h2>
        <p>Hola ${user.name},</p>
        <p>¡Felicidades! Has completado el <strong>${percentage.toFixed(0)}%</strong> de tu meta:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #4f46e5;">${goal.title}</h3>
          <p>${goal.description}</p>
          <div style="background-color: #e5e7eb; border-radius: 9999px; height: 20px; margin: 10px 0;">
            <div style="background-color: #4f46e5; border-radius: 9999px; height: 20px; width: ${Math.min(percentage, 100)}%"></div>
          </div>
          <p><strong>${goal.currentAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong> de ${goal.targetAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
        </div>
        <p>Sigue así, ¡ya casi lo logras!</p>
        <a href="https://kipo-app.com/dashboard" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Ver mi dashboard</a>
        <p style="color: #6b7280; font-size: 0.8rem; margin-top: 30px;">Este es un mensaje automático. Por favor no respondas a este correo.</p>
      </div>
    `
  });
}

/**
 * Función para enviar una alerta de gasto inusual
 * @param {Object} user - Usuario al que enviar la alerta
 * @param {Object} transaction - Transacción inusual
 * @param {String} reason - Razón por la que se considera inusual
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function sendUnusualSpendingAlert(user, transaction, reason) {
  return sendEmail({
    to: user.email,
    subject: `Alerta: Detectamos un gasto inusual`,
    text: `Hola ${user.name}. Detectamos un gasto inusual de ${transaction.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} en la categoría ${transaction.category} el ${new Date(transaction.date).toLocaleDateString('es-MX')}. Razón: ${reason}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #ef4444;">Alerta: Gasto Inusual</h2>
        <p>Hola ${user.name},</p>
        <p>Hemos detectado un gasto que parece inusual en tu cuenta:</p>
        <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Cantidad:</strong> ${transaction.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
          <p><strong>Categoría:</strong> ${transaction.category}</p>
          <p><strong>Fecha:</strong> ${new Date(transaction.date).toLocaleDateString('es-MX')}</p>
          <p><strong>Razón de alerta:</strong> ${reason}</p>
        </div>
        <p>Si este gasto fue realizado por ti y es legítimo, no necesitas hacer nada. Si no reconoces este gasto, por favor revisa tu cuenta.</p>
        <a href="https://kipo-app.com/dashboard" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Revisar mi cuenta</a>
      </div>
    `
  });
}

/**
 * Función para enviar un resumen semanal
 * @param {Object} user - Usuario al que enviar el resumen
 * @param {Object} summary - Datos del resumen semanal
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function sendWeeklySummary(user, summary) {
  return sendEmail({
    to: user.email,
    subject: `Tu resumen financiero semanal`,
    text: `Hola ${user.name}. Aquí está tu resumen financiero de la semana: Ingresos totales: ${summary.totalIncome.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}. Gastos totales: ${summary.totalExpenses.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}. Balance: ${summary.balance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4f46e5;">Tu Resumen Financiero Semanal</h2>
        <p>Hola ${user.name},</p>
        <p>Aquí está el resumen de tu actividad financiera de la última semana:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Ingresos totales:</span>
            <span style="color: #10b981; font-weight: bold;">${summary.totalIncome.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Gastos totales:</span>
            <span style="color: #ef4444; font-weight: bold;">${summary.totalExpenses.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
          </div>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 10px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Balance:</span>
            <span style="color: ${summary.balance >= 0 ? '#10b981' : '#ef4444'};">${summary.balance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
          </div>
        </div>
        
        <h3 style="color: #4f46e5;">Principales Categorías de Gasto</h3>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          ${summary.topExpenseCategories.map(cat => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>${cat.name}:</span>
              <span style="font-weight: bold;">${cat.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
            </div>
          `).join('')}
        </div>
        
        ${summary.insights ? `
          <h3 style="color: #4f46e5;">Insights</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p>${summary.insights}</p>
          </div>
        ` : ''}
        
        <a href="https://kipo-app.com/dashboard" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Ver detalles en mi dashboard</a>
        <p style="color: #6b7280; font-size: 0.8rem; margin-top: 30px;">Este es un mensaje automático. Por favor no respondas a este correo.</p>
      </div>
    `
  });
}

export default {
  sendEmail,
  sendGoalNearCompletionAlert,
  sendUnusualSpendingAlert,
  sendWeeklySummary,
};
