// src/app/api/debug-auth/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token requerido en body' }, { status: 400 });
    }

    console.log('[DEBUG] Token recibido:', token.substring(0, 10) + '...');
    
    await connectToDatabase();
    console.log('[DEBUG] Conexión a DB establecida');

    // Buscar usuarios con apiKeys
    const users = await User.find({}).select('+apiKeys.hash').exec();
    console.log('[DEBUG] Total usuarios encontrados:', users.length);

    type ComparisonInfo = {
      userId: string;
      keyId: string;
      result: boolean;
      error: string | null;
    };

    const debugInfo: {
      tokenLength: number;
      tokenStart: string;
      users: any[];
      comparisons: ComparisonInfo[];
    } = {
      tokenLength: token.length,
      tokenStart: token.substring(0, 10),
      users: [],
      comparisons: []
    };

    for (const user of users) {
      const userInfo = {
        userId: user._id.toString(),
        email: user.email,
        apiKeysCount: user.apiKeys?.length || 0,
        apiKeys: [] as {
          keyId: string;
          name: string;
          hasHash: boolean;
          hashLength: number;
          revokedAt: any;
          createdAt: any;
          isActive: boolean;
        }[]
      };

      if (user.apiKeys) {
        for (const apiKey of user.apiKeys) {
          const keyInfo = {
            keyId: apiKey._id.toString(),
            name: apiKey.name,
            hasHash: !!apiKey.hash,
            hashLength: apiKey.hash?.length || 0,
            revokedAt: apiKey.revokedAt,
            createdAt: apiKey.createdAt,
            isActive: !apiKey.revokedAt
          };

          userInfo.apiKeys.push(keyInfo);

          // Solo intentar comparar si hay hash y no está revocado
          if (apiKey.hash && !apiKey.revokedAt) {
            console.log(`[DEBUG] Comparando token con hash del usuario ${user.email}`);
            
            try {
              const isValid = await bcrypt.compare(token, apiKey.hash);
              debugInfo.comparisons.push({
                userId: user._id.toString(),
                keyId: apiKey._id.toString(),
                result: isValid,
                error: null
              });
              
              console.log(`[DEBUG] Resultado comparación: ${isValid}`);
              
              if (isValid) {
                return NextResponse.json({
                  success: true,
                  message: '¡Token válido encontrado!',
                  userId: user._id.toString(),
                  keyId: apiKey._id.toString(),
                  debugInfo
                });
              }
            } catch (compareError) {
              console.error('[DEBUG] Error en bcrypt.compare:', compareError);
              debugInfo.comparisons.push({
                userId: user._id.toString(),
                keyId: apiKey._id.toString(),
                result: false,
                error: typeof compareError === 'object' && compareError !== null && 'message' in compareError
                  ? (compareError as { message: string }).message
                  : String(compareError)
              });
            }
          }
        }
      }

      debugInfo.users.push(userInfo);
    }

    return NextResponse.json({
      success: false,
      message: 'Token no encontrado en ningún usuario activo',
      debugInfo
    });

  } catch (error) {
    console.error('[DEBUG] Error general:', error);
    return NextResponse.json({
      error: 'Error en debug',
      details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    }, { status: 500 });
  }
}
