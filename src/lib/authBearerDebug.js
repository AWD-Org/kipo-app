// src/lib/authBearerDebug.js - Versión con logs para debugging
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';
import User from '../../models/User';

export async function authenticateBearerDebug(request) {
  try {
    console.log('[DEBUG] 1. Iniciando autenticación Bearer');
    
    // 1. Extraer token del header Authorization
    const authHeader = request.headers.get('Authorization');
    console.log('[DEBUG] 2. Auth header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[DEBUG] 2.1. Header inválido o no Bearer');
      return null;
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    console.log('[DEBUG] 3. Token extraído, longitud:', token.length);
    console.log('[DEBUG] 3.1. Token (primeros 10 chars):', token.substring(0, 10) + '...');
    
    if (!token || token.length < 10) {
      console.log('[DEBUG] 3.2. Token muy corto o vacío');
      return null;
    }

    // 2. Conectar a DB
    console.log('[DEBUG] 4. Conectando a base de datos...');
    await connectToDatabase();
    console.log('[DEBUG] 4.1. Conexión establecida');

    // 3. Buscar usuarios con apiKeys activos
    console.log('[DEBUG] 5. Buscando usuarios con apiKeys activos...');
    const users = await User.find({
      'apiKeys.revokedAt': null,
    }).select('+apiKeys.hash').exec();
    
    console.log('[DEBUG] 5.1. Usuarios encontrados:', users.length);

    // 4. Debug: Ver estructura de usuarios
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`[DEBUG] 5.2. Usuario ${i}: ID=${user._id}, apiKeys count=${user.apiKeys?.length || 0}`);
      
      if (user.apiKeys) {
        user.apiKeys.forEach((key, keyIndex) => {
          console.log(`[DEBUG] 5.3. Key ${keyIndex}: hasHash=${!!key.hash}, revoked=${!!key.revokedAt}, name=${key.name}`);
        });
      }
    }

    // 5. Verificar token contra todos los hashes activos
    for (const user of users) {
      if (!user.apiKeys || user.apiKeys.length === 0) {
        console.log('[DEBUG] 6. Usuario sin apiKeys, saltando');
        continue;
      }
      
      for (const apiKey of user.apiKeys) {
        if (apiKey.revokedAt) {
          console.log('[DEBUG] 6.1. Key revocada, saltando');
          continue;
        }
        
        console.log('[DEBUG] 6.2. Comparando token con hash...');
        console.log('[DEBUG] 6.3. Hash presente:', !!apiKey.hash);
        
        if (!apiKey.hash) {
          console.log('[DEBUG] 6.4. ERROR: No hay hash para comparar');
          continue;
        }
        
        // Comparar token con hash
        const isValidToken = await bcrypt.compare(token, apiKey.hash);
        console.log('[DEBUG] 6.5. Comparación resultado:', isValidToken);
        
        if (isValidToken) {
          console.log('[DEBUG] 7. ¡TOKEN VÁLIDO! Actualizando lastUsedAt...');
          
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

    console.log('[DEBUG] 8. Token no encontrado en ningún usuario');
    return null;
  } catch (error) {
    console.error('[DEBUG] ERROR en authenticateBearer:', error);
    return null;
  }
}
