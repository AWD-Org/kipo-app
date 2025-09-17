# 📱 Configuración de iOS Shortcuts para Kipo

## 🚀 Pasos para configurar el atajo

### 1. Generar tu token
1. Ve a tu app web → Dashboard → Configuración
2. En la sección "iOS Shortcuts", haz clic en "Crear Token"
3. **¡IMPORTANTE!** Copia y guarda el token inmediatamente (solo se muestra una vez)

### 2. Crear el atajo en iPhone
1. Abre la app **"Atajos"** (Shortcuts) en tu iPhone
2. Toca el **+** para crear un nuevo atajo
3. Toca **"Agregar Acción"**

### 3. Configurar la acción principal
1. Busca y agrega **"Pedir entrada"** (Ask for Input):
   - Tipo: **Número**
   - Pregunta: **"¿Cuánto gastaste?"**
   - Variable: **Cantidad**

2. Agrega otra **"Pedir entrada"**:
   - Tipo: **Texto**
   - Pregunta: **"¿En qué categoría?"**
   - Respuesta por defecto: **"Comida"**
   - Variable: **Categoría**

3. Agrega otra **"Pedir entrada"** (opcional):
   - Tipo: **Texto**  
   - Pregunta: **"Nota adicional (opcional)"**
   - Variable: **Nota**

### 4. Configurar la petición HTTP
1. Busca y agrega **"Obtener contenidos de URL"** (Get Contents of URL)
2. Configura así:
   - **URL**: `https://tu-dominio.com/api/entries`
   - **Método**: **POST**
   - **Headers**:
     ```
     Content-Type: application/json
     Authorization: Bearer TU_TOKEN_DE_64_CARACTERES_AQUI
     ```
   - **Cuerpo de la petición**:
     ```json
     {
       "type": "expense",
       "amount": [Cantidad],
       "category": "[Categoría]", 
       "note": "[Nota]"
     }
     ```

### 5. Mostrar confirmación
1. Agrega **"Mostrar resultado"** (Show Result)
2. Texto: **"✅ Gasto registrado: $[Cantidad] en [Categoría]"**

## 🧪 Comandos de prueba

### Probar el endpoint con curl
```bash
# 1. Crear un token (desde tu navegador logueado)
curl -X POST https://tu-dominio.com/api/shortcut-token \
  -H "Content-Type: application/json" \
  -b "cookies-de-sesion" \
  -d '{"name":"Mi Token de Prueba"}'

# 2. Probar registrar gasto
curl -X POST https://tu-dominio.com/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "type": "expense",
    "amount": 25.50,
    "category": "Comida",
    "note": "Prueba desde curl"
  }'

# 3. Ver tus transacciones
curl -X GET https://tu-dominio.com/api/entries?limit=5 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### JSON de ejemplo para el atajo
```json
{
  "type": "expense",
  "amount": 25.50,
  "category": "Comida", 
  "note": "Almuerzo en restaurante",
  "currency": "USD"
}
```

## 🔒 Seguridad

- ✅ Los tokens se almacenan hasheados (bcrypt)
- ✅ Máximo 5 tokens activos por usuario
- ✅ Tokens no expiran pero se pueden revocar
- ✅ Se registra el último uso para auditoría
- ✅ HTTPS obligatorio en producción

## 🐛 Troubleshooting

### Error 401 - Token inválido
- Verifica que el header Authorization esté bien escrito
- Asegúrate de que el token no esté revocado
- El token debe empezar con "Bearer " (con espacio)

### Error 400 - Datos inválidos  
- `type` debe ser "expense" o "income"
- `amount` debe ser un número positivo
- `category` es obligatoria

### Error 500 - Error del servidor
- Revisa los logs del servidor
- Verifica la conexión a MongoDB
- Confirma que todos los modelos estén actualizados

## 📝 Notas importantes

1. **El token se muestra solo UNA VEZ** al crearlo
2. **Guárdalo en un lugar seguro** (como en el atajo mismo)
3. **No compartas tu token** con nadie
4. **Revoca tokens** que ya no uses desde la configuración web
5. Los gastos aparecerán con tags `["shortcut", "ios"]` para identificarlos

## 🎯 Ejemplo de atajo completo

1. **Pedir entrada** → Número → "¿Cuánto?"
2. **Pedir entrada** → Texto → "¿Categoría?" 
3. **Pedir entrada** → Texto → "¿Nota?"
4. **Obtener contenidos de URL** → POST a `/api/entries`
5. **Mostrar resultado** → "✅ Guardado!"

¡Listo! Ahora puedes registrar gastos desde tu iPhone sin abrir la app. 🎉
