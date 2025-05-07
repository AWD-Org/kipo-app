const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['ingreso', 'gasto'],
    required: [true, 'El tipo de transacción es requerido'],
  },
  amount: {
    type: Number,
    required: [true, 'El monto es requerido'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isRecurrent: {
    type: Boolean,
    default: false,
  },
  recurrenceFrequency: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'none',
  },
  tags: {
    type: [String],
    default: [],
  },
});

// Índices para mejorar consultas
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, category: 1 });
TransactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
