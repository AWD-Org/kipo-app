// src/app/api/user/preferences/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '../../../../../models/User';

const VALID_CURRENCIES = ['MXN', 'USD', 'EUR', 'GBP', 'CAD'];
const VALID_LANGUAGES = ['es', 'en'];

export async function PUT(req: Request) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      currency,
      language,
      notifications,
      darkMode,
      autoBackup
    } = body;

    // Validaciones
    if (currency && !VALID_CURRENCIES.includes(currency)) {
      return NextResponse.json(
        { error: 'Moneda no válida' },
        { status: 400 }
      );
    }

    if (language && !VALID_LANGUAGES.includes(language)) {
      return NextResponse.json(
        { error: 'Idioma no válido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Preparar datos para actualizar
    const updateData: any = {};
    if (currency) updateData.currency = currency;
    if (language) updateData.language = language;
    if (typeof notifications === 'boolean') updateData.notifications = notifications;
    if (typeof darkMode === 'boolean') updateData.darkMode = darkMode;
    if (typeof autoBackup === 'boolean') updateData.autoBackup = autoBackup;

    // Actualizar preferencias
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('currency language notifications darkMode autoBackup');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Preferencias actualizadas correctamente',
      data: {
        currency: updatedUser.currency || 'MXN',
        language: updatedUser.language || 'es',
        notifications: updatedUser.notifications !== false, // Default true
        darkMode: updatedUser.darkMode || false,
        autoBackup: updatedUser.autoBackup !== false // Default true
      }
    });

  } catch (error) {
    console.error('[preferences] PUT Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
