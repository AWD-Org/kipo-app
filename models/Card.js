// models/Card.js
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  brand: {
    type: String,
    enum: ["visa", "mastercard", "amex", "discover", "other"],
    default: "other",
  },
  kind: { type: String, enum: ["debito", "credito"], required: true },
  cutoffDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  minPayment: { type: Number, required: true },
  noInterestPayment: { type: Number, required: true },
  status: { type: String, enum: ["pagada", "sin pagar"], default: "sin pagar" },
}, { timestamps: true });

export default mongoose.models.Card || mongoose.model("Card", cardSchema);
