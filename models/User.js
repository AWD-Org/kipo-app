const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor proporciona un nombre'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor proporciona un email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor proporciona un email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor proporciona una contraseña'],
    minlength: 6,
    select: false,
  },
  monthlyIncome: {
    type: Number,
    default: 0,
  },
  monthlyExpenses: {
    type: Number,
    default: 0,
  },
  mainExpenseCategories: {
    type: [String],
    default: [],
  },
  savingsGoal: {
    type: Number,
    default: 0,
  },
  referralSource: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
  
  // 🆕 NUEVO: API Keys para Shortcuts de iOS
  apiKeys: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'iOS Shortcut Token',
    },
    hash: {
      type: String,
      required: true,
      select: false, // No incluir en consultas por defecto
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  }],
  
  // 🆕 NUEVO: Preferencias de usuario
  currency: {
    type: String,
    enum: ['MXN', 'USD', 'EUR', 'GBP', 'CAD'],
    default: 'MXN',
  },
  language: {
    type: String,
    enum: ['es', 'en'],
    default: 'es',
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  autoBackup: {
    type: Boolean,
    default: true,
  },
});

// Índice para acelerar búsquedas de tokens
UserSchema.index({ 'apiKeys.hash': 1 });
UserSchema.index({ 'apiKeys.revokedAt': 1 });

// Encriptar contraseña usando bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar contraseña
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
