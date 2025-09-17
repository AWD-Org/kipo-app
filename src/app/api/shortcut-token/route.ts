// src/app/api/shortcut-token/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Verificar sesión NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Sesión requerida' },
        { status: 401 }
      );
    }

    // 2. Obtener datos del body (opcional: nombre del token)
    let name = 'iOS Shortcut Token';
    try {
      const body = await req.json();
      if (body.name && typeof body.name === 'string') {
        name = body.name.trim();
      }
    } catch {
      // Si no hay body o no es JSON válido, usar valor por defecto
    }

    await connectToDatabase();

    // 3. Verificar límite de tokens por usuario (máximo 5)
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const activeKeys = user.apiKeys?.filter((key: { revokedAt: any; }) => !key.revokedAt) || [];
    if (activeKeys.length >= 5) {
      return NextResponse.json(
        { 
          error: 'Máximo 5 tokens activos permitidos',
          suggestion: 'Revoca algún token existente antes de crear uno nuevo'
        },
        { status: 400 }
      );
    }

    // 4. Generar token seguro (32 bytes = 256 bits)
    const plainToken = crypto.randomBytes(32).toString('hex'); // 64 caracteres hex
    
    // 5. Hash del token para almacenamiento
    const saltRounds = 12;
    const hash = await bcrypt.hash(plainToken, saltRounds);

    // 6. Crear objeto apiKey
    const newApiKey = {
      _id: new (require('mongoose').Types.ObjectId)(),
      name,
      hash,
      createdAt: new Date(),
      lastUsedAt: null,
      revokedAt: null,
    };

    // 7. Agregar a usuario
    await User.findByIdAndUpdate(
      session.user.id,
      { 
        $push: { apiKeys: newApiKey } 
      },
      { new: true }
    );

    // 8. Retornar SOLO UNA VEZ el token en claro
    return NextResponse.json({
      success: true,
      data: {
        token: plainToken, // ⚠️ IMPORTANTE: Solo se muestra una vez
        keyId: newApiKey._id,
        name: newApiKey.name,
        createdAt: newApiKey.createdAt,
        instructions: {
          usage: 'Guarda este token de forma segura. No podrás volver a verlo.',
          endpoint: '/api/entries',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${plainToken}`
          }
        }
      }
    });

  } catch (error) {
    console.error('[shortcut-token] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Listar tokens activos del usuario (sin mostrar el token en claro)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Sesión requerida' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const activeKeys = (user.apiKeys || [])
      .filter((key: { revokedAt: any; }) => !key.revokedAt)
      .map((key: { _id: any; name: any; createdAt: any; lastUsedAt: any; }) => ({
        keyId: key._id,
        name: key.name,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        // ❌ NO incluir el hash o token en claro
      }));

    return NextResponse.json({
      success: true,
      data: {
        activeTokens: activeKeys,
        count: activeKeys.length,
        maxAllowed: 5,
      }
    });

  } catch (error) {
    console.error('[shortcut-token] GET Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Revocar un token específico
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Sesión requerida' },
        { status: 401 }
      );
    }

    const { keyId } = await req.json();
    if (!keyId) {
      return NextResponse.json(
        { error: 'keyId requerido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Marcar token como revocado
    const result = await User.updateOne(
      { 
        _id: session.user.id,
        'apiKeys._id': keyId,
        'apiKeys.revokedAt': null // Solo revocar si está activo
      },
      { 
        $set: { 
          'apiKeys.$.revokedAt': new Date() 
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Token no encontrado o ya está revocado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token revocado correctamente'
    });

  } catch (error) {
    console.error('[shortcut-token] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
