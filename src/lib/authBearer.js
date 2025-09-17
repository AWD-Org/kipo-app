// src/lib/authBearer.js
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';
import User from '../../models/User';

/**
 * Autentica una request usando Bearer token
 * @param {Request} request - Request object de Next.js
 * @returns {Promise<{userId: string} | null>} - Usuario autenticado o null
 */
export async function authenticateBearer(request) {
  try {
    // 1. Extraer token del header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    if (!token || token.length < 10) {
      return null;
    }

    // 2. Conectar a DB
    await connectToDatabase();

    // 3. Buscar usuarios con apiKeys activos (no revocados)
    // Incluimos el hash de los apiKeys para comparar
    const users = await User.find({
      'apiKeys.revokedAt': null,
    }).select('+apiKeys.hash').exec();

    // 4. Verificar token contra todos los hashes activos
    for (const user of users) {
      if (!user.apiKeys || user.apiKeys.length === 0) continue;
      
      for (const apiKey of user.apiKeys) {
        // Solo verificar keys activos
        if (apiKey.revokedAt) continue;
        
        // Comparar token con hash
        const isValidToken = await bcrypt.compare(token, apiKey.hash);
        if (isValidToken) {
          // 5. Actualizar lastUsedAt (opcional, para auditoría)
          await User.updateOne(
            { _id: user._id, 'apiKeys._id': apiKey._id },
            { 
              $set: { 
                'apiKeys.$.lastUsedAt': new Date() 
              } 
            }
          );

          return {
            userId: user._id.toString(),
            keyId: apiKey._id.toString(),
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('[authenticateBearer] Error:', error);
    return null;
  }
}

/**
 * Middleware para rutas que requieren Bearer token
 * Uso: const auth = await requireBearer(request); if (!auth) return 401;
 */
export async function requireBearer(request) {
  const auth = await authenticateBearer(request);
  if (!auth) {
    throw new Error('Token inválido o expirado');
  }
  return auth;
}
