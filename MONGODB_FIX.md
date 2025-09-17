# 🔧 SOLUCIÓN: Corregir variables de entorno

## ❌ Variable actual (incompleta):
MONGODB_URI=mongodb+srv://awd:ptwtoz2aEkT2TPCA@kipocluster.slx069o.mongodb.net/?retryWrites=true&w=majority&appName=KipoCluster

## ✅ Variable corregida (con base de datos):
MONGODB_URI=mongodb+srv://awd:ptwtoz2aEkT2TPCA@kipocluster.slx069o.mongodb.net/kipo?retryWrites=true&w=majority&appName=KipoCluster

## 🚀 Pasos para arreglar:

### 1. **Actualizar en Netlify:**
1. Ve a tu dashboard de Netlify
2. Tu proyecto → Settings → Environment Variables
3. Edita `MONGODB_URI` 
4. Cambia el valor a: `mongodb+srv://awd:ptwtoz2aEkT2TPCA@kipocluster.slx069o.mongodb.net/kipo?retryWrites=true&w=majority&appName=KipoCluster`
5. Save

### 2. **Actualizar localmente (archivo .env.local):**
```
MONGODB_URI=mongodb+srv://awd:ptwtoz2aEkT2TPCA@kipocluster.slx069o.mongodb.net/kipo?retryWrites=true&w=majority&appName=KipoCluster
```

### 3. **Redeploy tu aplicación:**
- Push cualquier cambio pequeño al repo
- O force redeploy en Netlify

### 4. **Crear la base de datos en MongoDB Atlas:**
1. En tu MongoDB Atlas dashboard
2. Ve a "Browse Collections" 
3. Crea nueva base de datos llamada `kipo`
4. Crea colección `transactions`

## 🧪 **Después de hacer estos cambios, prueba:**

```bash
curl -X POST https://kipo-app.netlify.app/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "type": "expense",
    "amount": 15.75,
    "category": "Prueba Fix",
    "note": "Test después del fix"
  }'
```

## 🎯 **¿Por qué pasaba esto?**

Sin especificar `/kipo` en la URI, MongoDB usaba la base de datos por defecto `test`, pero tu aplicación esperaba que fuera `kipo`. El endpoint funcionaba (por eso devolvía 201) pero guardaba en una base que no estabas revisando.

¡Después de estos cambios debería funcionar perfectamente!
