// src/app/api/entries/route.ts
import { NextResponse } from 'next/server';
import { authenticateBearer } from '@/lib/authBearer';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '../../../../models/Transaction';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log('[ENTRIES] POST request iniciado');
  try {
    // 1. Autenticar usando Bearer token
    console.log('[ENTRIES] Iniciando autenticación Bearer...');
    const auth = await authenticateBearer(req);
    console.log('[ENTRIES] Resultado autenticación:', auth ? 'SUCCESS' : 'FAILED');
    
    if (!auth) {
      console.log('[ENTRIES] Token inválido - retornando 401');
      return NextResponse.json(
        { 
          error: 'Token inválido o expirado',
          code: 'INVALID_TOKEN',
          debug: {
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }

    console.log('[ENTRIES] Usuario autenticado:', auth.userId);

    // 2. Parsear body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'JSON inválido en el body',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    }

    // 3. Validar campos requeridos
    const {
      type,           // 'expense' | 'income' (inglés para Shortcuts)
      amount,         // number
      category,       // string
      note = '',      // string opcional
      currency = 'USD', // string opcional
      createdAt,      // string ISO opcional
    } = body;

    // Validaciones
    if (!type || !['expense', 'income'].includes(type)) {
      return NextResponse.json(
        { 
          error: 'type debe ser "expense" o "income"',
          code: 'INVALID_TYPE',
          received: type
        },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { 
          error: 'amount debe ser un número positivo',
          code: 'INVALID_AMOUNT',
          received: amount
        },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { 
          error: 'category es requerida y debe ser un string',
          code: 'INVALID_CATEGORY',
          received: category
        },
        { status: 400 }
      );
    }

    // 4. Mapear tipos de inglés a español (para compatibilidad con tu DB)
    const typeMapping = {
      'expense': 'gasto',
      'income': 'ingreso'
    };

    // 5. Preparar fecha
    let transactionDate;
    if (createdAt) {
      transactionDate = new Date(createdAt);
      if (isNaN(transactionDate.getTime())) {
        return NextResponse.json(
          { 
            error: 'createdAt debe ser una fecha ISO válida',
            code: 'INVALID_DATE',
            received: createdAt
          },
          { status: 400 }
        );
      }
    } else {
      transactionDate = new Date();
    }

    // 6. Crear transacción
    console.log('[ENTRIES] Iniciando creación de transacción...');
    await connectToDatabase();
    console.log('[ENTRIES] Conexión a DB para transacción establecida');
    
    console.log('[ENTRIES] Datos para crear transacción:', {
      userId: auth.userId,
      type: typeMapping[type as keyof typeof typeMapping],
      amount: Number(amount),
      category: category.trim(),
      description: note || `Creado desde iOS Shortcuts - ${currency}`,
      date: transactionDate,
      isRecurrent: false,
      recurrenceFrequency: 'none',
      tags: ['shortcut', 'ios']
    });
    
    console.log('[ENTRIES] Llamando a Transaction.create...');
    
    // Convertir userId string a ObjectId
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(auth.userId);
    console.log('[ENTRIES] UserID convertido a ObjectId:', userObjectId);
    
    let transaction;
    try {
      transaction = await Transaction.create({
        user: userObjectId, // Usar ObjectId en lugar de string
        type: typeMapping[type as keyof typeof typeMapping],
        amount: Number(amount),
        category: category.trim(),
        description: note || `Creado desde iOS Shortcuts - ${currency}`,
        date: transactionDate,
        isRecurrent: false,
        recurrenceFrequency: 'none',
        tags: ['shortcut', 'ios'], // Tags para identificar origen
      });
      
      console.log('[ENTRIES] Transaction.create completado exitosamente!');
      console.log('[ENTRIES] ID de transacción creada:', transaction._id?.toString());
      console.log('[ENTRIES] Objeto transacción completo:', JSON.stringify(transaction, null, 2));
      
    } catch (createError) {
      console.error('[ENTRIES] ERROR en Transaction.create:', createError);
      if (createError && typeof createError === 'object' && 'stack' in createError) {
        console.error('[ENTRIES] Stack trace:', (createError as { stack?: string }).stack);
      }
      
      return NextResponse.json(
        { 
          error: 'Error al crear transacción',
          code: 'CREATE_FAILED',
          details: (createError && typeof createError === 'object' && 'message' in createError) ? (createError as { message?: string }).message : String(createError)
        },
        { status: 500 }
      );
    }
    
    console.log('[ENTRIES] Transaction.create completado. ID:', transaction._id?.toString());
    console.log('[ENTRIES] Transacción creada exitosamente:', transaction);

    // 7. Respuesta exitosa
    return NextResponse.json({
      success: true,
      data: {
        id: transaction._id.toString(),
        type,
        amount,
        category,
        note,
        currency,
        createdAt: transaction.date.toISOString(),
        source: 'shortcut',
      },
      message: `${type === 'expense' ? 'Gasto' : 'Ingreso'} registrado correctamente`
    }, { status: 201 });

  } catch (error) {
    console.error('[entries] POST Error:', error);
    
    // Manejo de errores específicos de Mongoose
    if (error && typeof error === 'object' && 'name' in error && (error as any).name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          code: 'VALIDATION_ERROR',
          details: (error as any).message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Obtener transacciones del usuario autenticado (opcional para debug)
    const auth = await authenticateBearer(req);
    if (!auth) {
      return NextResponse.json(
        { 
          error: 'Token inválido o expirado',
          code: 'INVALID_TOKEN'
        },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Obtener parámetros de query
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const transactions = await Transaction.find({ 
      user: auth.userId 
    })
    .sort({ date: -1 })
    .limit(Math.min(limit, 100)) // Máximo 100
    .skip(offset)
    .lean();

    // Mapear a formato amigable para Shortcuts
    const formattedTransactions = transactions.map(tx => ({
      id: (tx._id as string | { toString(): string }).toString(),
      type: tx.type === 'gasto' ? 'expense' : 'income',
      amount: tx.amount,
      category: tx.category,
      note: tx.description,
      createdAt: tx.date.toISOString(),
      tags: tx.tags,
    }));

    return NextResponse.json({
      success: true,
      data: formattedTransactions,
      pagination: {
        limit,
        offset,
        count: formattedTransactions.length,
      }
    });

  } catch (error) {
    console.error('[entries] GET Error:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
