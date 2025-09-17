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
  console.log('[AUTH] Iniciando authenticateBearer');
  try {
    // 1. Extraer token del header Authorization
    const authHeader = request.headers.get('Authorization');
    console.log('[AUTH] Header Authorization:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH] Header inválido o no es Bearer');
      return null;
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    console.log('[AUTH] Token extraído, longitud:', token.length);
    
    if (!token || token.length < 10) {
      console.log('[AUTH] Token muy corto');
      return null;
    }

    // 2. Conectar a DB
    console.log('[AUTH] Conectando a MongoDB...');
    await connectToDatabase();
    console.log('[AUTH] Conexión a MongoDB establecida');

    // 3. Buscar usuarios con apiKeys activos (no revocados)
    console.log('[AUTH] Buscando usuarios con apiKeys activos...');
    const users = await User.find({
      'apiKeys.revokedAt': null,
    }).select('+apiKeys.hash').exec();
    
    console.log('[AUTH] Usuarios encontrados:', users.length);

    // 4. Verificar token contra todos los hashes activos
    for (const user of users) {
      if (!user.apiKeys || user.apiKeys.length === 0) {
        console.log('[AUTH] Usuario sin apiKeys, saltando');
        continue;
      }
      
      for (const apiKey of user.apiKeys) {
        // Solo verificar keys activos
        if (apiKey.revokedAt) {
          console.log('[AUTH] Key revocado, saltando');
          continue;
        }
        
        console.log('[AUTH] Comparando token con hash...');
        // Comparar token con hash
        const isValidToken = await bcrypt.compare(token, apiKey.hash);
        console.log('[AUTH] Resultado comparación:', isValidToken);
        
        if (isValidToken) {
          console.log('[AUTH] ¡TOKEN VÁLIDO! Usuario:', user._id.toString());
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

    console.log('[AUTH] Token no encontrado en ningún usuario activo');
    return null;
  } catch (error) {
    console.error('[AUTH] Error:', error);
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
