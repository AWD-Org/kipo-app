# Kipo - Aplicación de Finanzas Personales

![Kipo Logo](./public/logo.svg)

## Descripción
Kipo es una aplicación de finanzas personales que ayuda a los usuarios a controlar sus gastos, establecer metas de ahorro y recibir recomendaciones personalizadas basadas en inteligencia artificial. Diseñada con una interfaz minimalista y amigable, Kipo facilita la gestión financiera diaria.

## Características principales
- 📊 **Seguimiento inteligente**: Monitorea automáticamente tus ingresos y gastos con visualizaciones claras.
- 🎯 **Metas personalizadas**: Define objetivos financieros y sigue tu progreso.
- 🤖 **Recomendaciones IA**: Recibe consejos personalizados basados en tus hábitos de gasto.
- 📱 **Diseño minimalista**: Interfaz limpia y fácil de usar inspirada en Notion.
- 🔔 **Alertas y notificaciones**: Mantente informado sobre eventos importantes en tus finanzas.

## Tecnologías
- **Frontend**: Next.js 14 + TypeScript + App Router + Server Actions
- **UI/UX**: Tailwind CSS + shadcn/ui + lucide-react
- **Backend**: Express como Netlify Functions
- **Base de datos**: MongoDB Atlas
- **Autenticación**: NextAuth
- **Estado**: Redux Toolkit
- **IA**: Claude Haiku (Anthropic)
- **Notificaciones**: SendGrid

## Estructura del proyecto
El proyecto sigue una arquitectura unificada que integra frontend, backend y servicios de terceros:

```
kipo-app/
├── netlify/           # Funciones serverless para el backend
├── models/            # Modelos de datos para MongoDB
├── lib/               # Utilidades y conexiones a servicios
├── src/
│   ├── app/           # Rutas y páginas de Next.js (App Router)
│   ├── components/    # Componentes de UI reutilizables
│   ├── store/         # Estado global con Redux Toolkit
│   └── types/         # Definiciones de TypeScript
└── public/            # Activos estáticos
```

## Comenzando

### Prerrequisitos
- Node.js 18.x o superior
- Cuenta de MongoDB Atlas
- Cuenta de Anthropic (para Claude Haiku)
- Cuenta de SendGrid (para notificaciones por email)

### Instalación
1. Clona el repositorio
   ```bash
   git clone https://github.com/tu-usuario/kipo-app.git
   cd kipo-app
   ```

2. Instala las dependencias
   ```bash
   npm install
   ```

3. Configura las variables de entorno
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus claves de API y configuraciones
   ```

4. Inicia el servidor de desarrollo
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Despliegue
La aplicación está configurada para desplegarse fácilmente en Netlify:

```bash
# Instala la CLI de Netlify si aún no la tienes
npm install -g netlify-cli

# Inicia sesión en tu cuenta de Netlify
netlify login

# Configura el proyecto
netlify init

# Despliega a producción
netlify deploy --prod
```

## Licencia
Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto
- Autor: Tu Nombre
- Email: tu-email@ejemplo.com
- Twitter: [@tu_usuario](https://twitter.com/tu_usuario)
# kipo-app
