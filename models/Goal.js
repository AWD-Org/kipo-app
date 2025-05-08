const mongoose = require("mongoose");

// Subesquema para el plan de ahorro inteligente
const SuggestedPlanSchema = new mongoose.Schema(
    {
        monthly: {
            type: Number,
            required: true,
        },
        weekly: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const GoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: [true, "El título de la meta es requerido"],
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    targetAmount: {
        type: Number,
        required: [true, "El monto objetivo es requerido"],
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    targetDate: {
        type: Date,
        required: [true, "La fecha objetivo es requerida"],
    },
    category: {
        type: String,
        enum: ["ahorro", "inversión", "deuda", "compra", "otro"],
        default: "ahorro",
    },
    priority: {
        type: String,
        enum: ["baja", "media", "alta"],
        default: "media",
    },
    reminderFrequency: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none",
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    // Campo para almacenar el plan de ahorro sugerido por IA
    suggestedPlan: {
        type: SuggestedPlanSchema,
        default: null,
    },
});

// Índices para mejorar consultas
GoalSchema.index({ user: 1, isActive: 1 });
GoalSchema.index({ user: 1, category: 1 });
GoalSchema.index({ user: 1, targetDate: 1 });

module.exports = mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
