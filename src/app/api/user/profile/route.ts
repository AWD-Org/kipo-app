// src/app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '../../../../../models/User';

export async function GET(req: Request) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Obtener datos del usuario
    const userResult = await User.findById(session.user.id)
      .select('-password') // Excluir contraseña
      .lean();

    const user = Array.isArray(userResult) ? userResult[0] : userResult;

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome || 0,
        monthlyExpenses: user.monthlyExpenses || 0,
        savingsGoal: user.savingsGoal || 0,
        mainExpenseCategories: user.mainExpenseCategories || [],
        referralSource: user.referralSource || '',
        createdAt: user.createdAt,
        isOnboarded: user.isOnboarded || false,
        currency: user.currency || 'MXN',
        language: user.language || 'es'
      }
    });

  } catch (error) {
    console.error('[profile] GET Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

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
      name,
      monthlyIncome,
      monthlyExpenses,
      savingsGoal,
      mainExpenseCategories
    } = body;

    // Validaciones básicas
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: name.trim(),
        monthlyIncome: Number(monthlyIncome) || 0,
        monthlyExpenses: Number(monthlyExpenses) || 0,
        savingsGoal: Number(savingsGoal) || 0,
        mainExpenseCategories: Array.isArray(mainExpenseCategories) 
          ? mainExpenseCategories.filter(cat => typeof cat === 'string' && cat.trim() !== '')
          : [],
        isOnboarded: true // Marcar como configurado al actualizar perfil
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: updatedUser
    });

  } catch (error) {
    console.error('[profile] PUT Error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && (error as any).name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Datos inválidos: ' + (error as any).message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
