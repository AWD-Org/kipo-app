const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const transactionsRoutes = require('./routes/transactions');
const goalsRoutes = require('./routes/goals');

// Inicializar app Express
const app = express();

// Middleware para parsing JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Conectar a MongoDB
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('=> Usando conexión a MongoDB existente');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    isConnected = !!db.connections[0].readyState;
    console.log('=> Conexión a MongoDB establecida');
  } catch (error) {
    console.error('=> Error conectando a MongoDB:', error);
    throw error;
  }
};

// Middleware para conectar a MongoDB antes de cada solicitud
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error de conexión a la base de datos' });
  }
});

// Rutas principales
app.get('/', (req, res) => {
  res.json({ message: 'API de Kipo funcionando correctamente' });
});

// Rutas de la API
app.use('/transactions', transactionsRoutes);
app.use('/goals', goalsRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Ha ocurrido un error inesperado',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Exportar handler para Netlify Functions
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // Para mantener la conexión a MongoDB con Netlify Functions
  context.callbackWaitsForEmptyEventLoop = false;
  return await handler(event, context);
};
