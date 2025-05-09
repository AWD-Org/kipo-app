// models/Recommendation.js
import { Schema, model, models } from "mongoose";

const RecommendationSchema = new Schema(
    {
        userId: { type: String, required: true },
        transactionId: { type: String, required: true },
        type: {
            type: String,
            enum: [
                "ALERTA_CATEGORIA",
                "ALERTA_GLOBAL",
                "CONSEJO_HABITO",
                "META_NUEVA",
            ],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        relatedCategory: { type: String },
        createdAt: { type: Date, default: () => new Date() },
    },
    { versionKey: false }
);

export default models.Recommendation ||
    model("Recommendation", RecommendationSchema);
