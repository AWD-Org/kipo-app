// src/app/api/entries/route.ts
import { NextResponse } from 'next/server';
import { authenticateBearer } from '@/lib/authBearer';
import { connectToDatabase } from '@/lib/mongodb';
const mongoose = require('mongoose');

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

    // 6. Crear transacción usando MongoDB directo
    console.log('[ENTRIES] Iniciando creación de transacción con MongoDB directo...');
    await connectToDatabase();
    console.log('[ENTRIES] Conexión a DB establecida');
    
    try {
      // Obtener la conexión directa de MongoDB
      const connection = mongoose.connection;
      const db = connection.db;
      
      console.log('[ENTRIES] Base de datos obtenida:', db.databaseName);
      
      const transactionData = {
        user: new mongoose.Types.ObjectId(auth.userId),
        type: typeMapping[type as keyof typeof typeMapping],
        amount: Number(amount),
        category: category.trim(),
        description: note || `Creado desde iOS Shortcuts - ${currency}`,
        date: transactionDate,
        isRecurrent: false,
        recurrenceFrequency: 'none',
        tags: ['shortcut', 'ios'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('[ENTRIES] Datos a insertar:', JSON.stringify(transactionData, null, 2));
      
      // Insertar directamente en la colección
      const result = await db.collection('transactions').insertOne(transactionData);
      
      console.log('[ENTRIES] Resultado de inserción:', result);
      console.log('[ENTRIES] ID insertado:', result.insertedId?.toString());
      
      if (!result.insertedId) {
        throw new Error('No se pudo insertar la transacción');
      }
      
      console.log('[ENTRIES] Transacción creada exitosamente con ID:', result.insertedId.toString());
      
      // 7. Respuesta exitosa
      return NextResponse.json({
        success: true,
        data: {
          id: result.insertedId.toString(),
          type,
          amount,
          category,
          note,
          currency,
          createdAt: transactionDate.toISOString(),
          source: 'shortcut',
        },
        message: `${type === 'expense' ? 'Gasto' : 'Ingreso'} registrado correctamente`
      }, { status: 201 });
      
    } catch (insertError) {
      console.error('[ENTRIES] ERROR en inserción directa:', insertError);
      if (insertError instanceof Error) {
        console.error('[ENTRIES] Stack trace:', insertError.stack);
      }
      
      return NextResponse.json(
        { 
          error: 'Error al crear transacción',
          code: 'INSERT_FAILED',
          details: insertError instanceof Error ? insertError.message : String(insertError)
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[entries] POST Error:', error);
    
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
    // Obtener transacciones del usuario autenticado
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

    // Usar MongoDB directo
    const connection = mongoose.connection;
    const db = connection.db;
    
    const transactions = await db.collection('transactions')
      .find({ user: new mongoose.Types.ObjectId(auth.userId) })
      .sort({ date: -1 })
      .limit(Math.min(limit, 100))
      .skip(offset)
      .toArray();

    // Mapear a formato amigable para Shortcuts
    const formattedTransactions = transactions.map((tx: { _id: { toString: () => any; }; type: string; amount: any; category: any; description: any; date: { toISOString: () => any; }; tags: any; }) => ({
      id: tx._id.toString(),
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
