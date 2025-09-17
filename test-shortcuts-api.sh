#!/bin/bash

# 🧪 Script de pruebas para iOS Shortcuts API
# Uso: ./test-shortcuts-api.sh [BASE_URL] [TOKEN]

BASE_URL=${1:-"http://localhost:3000"}
TOKEN=${2:-""}

echo "🧪 Probando API de Shortcuts para Kipo"
echo "🌐 Base URL: $BASE_URL"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar resultados
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
    fi
}

echo "📋 Test 1: Health check del endpoint"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/entries" \
    -H "Authorization: Bearer invalid-token")
if [ "$response" -eq 401 ]; then
    test_result 0 "Endpoint responde correctamente a token inválido"
else
    test_result 1 "Endpoint no maneja correctamente tokens inválidos (código: $response)"
fi

if [ -z "$TOKEN" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  No se proporcionó TOKEN. Crea uno en tu app web y ejecuta:${NC}"
    echo "   ./test-shortcuts-api.sh $BASE_URL TU_TOKEN_AQUI"
    echo ""
    echo "📝 Para crear un token:"
    echo "   1. Ve a tu app web"
    echo "   2. Dashboard → Configuración → iOS Shortcuts" 
    echo "   3. Click 'Crear Token'"
    echo "   4. Copia el token generado"
    exit 0
fi

echo ""
echo "📋 Test 2: Registrar gasto válido"
response=$(curl -s "$BASE_URL/api/entries" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "type": "expense",
        "amount": 15.75,
        "category": "Prueba",
        "note": "Test desde script"
    }' \
    -w "\n%{http_code}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" -eq 201 ]; then
    test_result 0 "Gasto registrado exitosamente"
    echo "   📊 Respuesta: $(echo "$body" | jq -r '.message // .data.message // "Sin mensaje"' 2>/dev/null || echo "JSON inválido")"
else
    test_result 1 "Error al registrar gasto (código: $http_code)"
    echo "   📊 Error: $(echo "$body" | jq -r '.error // "Error desconocido"' 2>/dev/null || echo "$body")"
fi

echo ""
echo "📋 Test 3: Registrar ingreso válido"
response=$(curl -s "$BASE_URL/api/entries" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "type": "income",
        "amount": 100.00,
        "category": "Trabajo",
        "note": "Test ingreso"
    }' \
    -w "\n%{http_code}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" -eq 201 ]; then
    test_result 0 "Ingreso registrado exitosamente"
else
    test_result 1 "Error al registrar ingreso (código: $http_code)"
fi

echo ""
echo "📋 Test 4: Datos inválidos (sin amount)"
response=$(curl -s "$BASE_URL/api/entries" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "type": "expense",
        "category": "Test"
    }' \
    -w "\n%{http_code}")

http_code=$(echo "$response" | tail -n1)

if [ "$http_code" -eq 400 ]; then
    test_result 0 "Validación correcta de datos faltantes"
else
    test_result 1 "No valida correctamente datos faltantes (código: $http_code)"
fi

echo ""
echo "📋 Test 5: Tipo inválido"
response=$(curl -s "$BASE_URL/api/entries" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "type": "invalid",
        "amount": 10,
        "category": "Test"
    }' \
    -w "\n%{http_code}")

http_code=$(echo "$response" | tail -n1)

if [ "$http_code" -eq 400 ]; then
    test_result 0 "Validación correcta de tipo inválido"
else
    test_result 1 "No valida correctamente tipo inválido (código: $http_code)"
fi

echo ""
echo "📋 Test 6: Obtener transacciones (GET)"
response=$(curl -s "$BASE_URL/api/entries?limit=3" \
    -H "Authorization: Bearer $TOKEN" \
    -w "\n%{http_code}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" -eq 200 ]; then
    test_result 0 "Obtener transacciones exitoso"
    count=$(echo "$body" | jq -r '.data | length' 2>/dev/null || echo "0")
    echo "   📊 Transacciones encontradas: $count"
else
    test_result 1 "Error al obtener transacciones (código: $http_code)"
fi

echo ""
echo "🎯 Resumen de pruebas completado"
echo ""
echo "📱 Para configurar tu iPhone:"
echo "   1. Abre la app 'Atajos'"
echo "   2. Crea un nuevo atajo"
echo "   3. Sigue la guía en IOS_SHORTCUTS_SETUP.md"
echo ""
echo "🔗 Endpoints disponibles:"
echo "   POST $BASE_URL/api/entries     - Crear gasto/ingreso"
echo "   GET  $BASE_URL/api/entries     - Listar transacciones"
echo "   POST $BASE_URL/api/shortcut-token - Crear token (requiere sesión web)"
echo ""