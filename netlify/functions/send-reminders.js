// netlify/functions/send-reminders.js
const mongoose = require("mongoose");
const sendgrid = require("@sendgrid/mail");
const Goal = require("../../models/Goal");
const User = require("../../models/User");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    isConnected = true;
}

// Genera el HTML del correo
function buildReminderHtml(userName, goals) {
    const primary = "#7c3aed";
    const items = goals
        .map(
            (g) => `
    <li style="
      display: flex;
      align-items: center;
      background: #f5f3ff;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;
    ">
      <span style="
        display: inline-block;
        width: 8px;
        height: 8px;
        background: ${primary};
        border-radius: 50%;
        margin-right: 12px;
      "></span>
      <div>
        <strong>${g.title}</strong><br/>
        ${g.currentAmount}/${g.targetAmount}
      </div>
    </li>`
        )
        .join("");

    return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>⏰ Recordatorio de Metas Financieras</title>
  </head>
  <body style="
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    color: #333;
    padding: 16px;
    background: #fafafa;
  ">
    <h1 style="
      margin: 0 0 12px 0;
      font-size: 24px;
      color: ${primary};
    ">
      ⏰ Recordatorio de Metas Financieras
    </h1>
    <p style="
      margin: 0 0 16px 0;
      font-size: 16px;
    ">
      Hola ${userName},<br/><br/>
      Este es un recordatorio de tus metas activas. A continuación encontrarás el estado de cada una:
    </p>
    <ul style="list-style: none; padding: 0; margin: 0;">
      ${items}
    </ul>
    <p style="
      margin-top: 24px;
      font-size: 14px;
      color: #666;
    ">
      ¡Sigue así y alcanza tus objetivos!<br/>
      — Equipo de Kipo
    </p>
  </body>
  </html>
`;
}

exports.handler = async function (event, context) {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        await connectDB();

        const today = new Date();
        const weekday = today.getUTCDay();
        const dayOfMonth = today.getUTCDate();

        const metas = await Goal.find({
            isActive: true,
            reminderFrequency: { $in: ["daily", "weekly", "monthly"] },
        }).lean();

        const toNotify = metas.filter((g) => {
            if (g.reminderFrequency === "daily") return true;
            if (g.reminderFrequency === "weekly") return weekday === 1; // lunes
            if (g.reminderFrequency === "monthly")
                return dayOfMonth === new Date(g.startDate).getUTCDate();
            return false;
        });

        const byUser = toNotify.reduce((acc, g) => {
            (acc[g.user] = acc[g.user] || []).push(g);
            return acc;
        }, {});

        let sentCount = 0;
        for (const userId of Object.keys(byUser)) {
            const user = await User.findById(userId).lean();
            if (!user?.email) continue;

            const html = buildReminderHtml(user.name || "", byUser[userId]);
            const text = byUser[userId]
                .map(
                    (g) => `• ${g.title}: ${g.currentAmount}/${g.targetAmount}`
                )
                .join("\n");

            await sendgrid.send({
                to: user.email,
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: "⏰ Recordatorio de Metas Financieras",
                text: `Hola ${
                    user.name || ""
                },\n\nEste es un recordatorio de tus metas activas:\n${text}\n\n¡Sigue así y alcanza tus objetivos!\n— Equipo de Kipo`,
                html,
            });
            sentCount += byUser[userId].length;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ sent: sentCount }),
        };
    } catch (err) {
        console.error("send-reminders error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
