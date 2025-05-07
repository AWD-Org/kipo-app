'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Esquema de validación con Zod
const goalSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  description: z.string().optional(),
  targetAmount: z.number().positive({ message: 'El monto objetivo debe ser positivo' }),
  currentAmount: z.number().nonnegative({ message: 'El monto actual no puede ser negativo' }).optional().default(0),
  startDate: z.string().transform(str => new Date(str)).optional().default(() => new Date().toISOString()),
  targetDate: z.string().transform(str => new Date(str)),
  category: z.enum(['ahorro', 'inversión', 'deuda', 'compra', 'otro']).default('ahorro'),
  priority: z.enum(['baja', 'media', 'alta']).default('media'),
  reminderFrequency: z.enum(['none', 'daily', 'weekly', 'monthly']).default('none')
});

type GoalFormData = z.infer<typeof goalSchema>;

/**
 * Acción del servidor para crear una nueva meta
 */
export async function createGoal(userId: string, formData: FormData) {
  try {
    // Extraer y transformar datos del formulario
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      targetAmount: parseFloat(formData.get('targetAmount') as string),
      currentAmount: formData.get('currentAmount') ? parseFloat(formData.get('currentAmount') as string) : 0,
      startDate: formData.get('startDate') || new Date().toISOString(),
      targetDate: formData.get('targetDate'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      reminderFrequency: formData.get('reminderFrequency')
    };
    
    // Validar datos con Zod
    const validatedData = goalSchema.parse(rawData);

    // En producción, esto haría una llamada a la API real
    // Por ahora, simulamos una respuesta exitosa
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userId,
        ...validatedData,
        isCompleted: validatedData.currentAmount >= validatedData.targetAmount,
        isActive: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Error creando meta' };
    }

    // Revalidar la página del dashboard para reflejar la nueva meta
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      data: validatedData 
    };
  } catch (error) {
    console.error('Error en createGoal:', error);
    
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { 
        success: false, 
        validationErrors: fieldErrors 
      };
    }
    
    return { 
      success: false, 
      error: 'Error al procesar la meta' 
    };
  }
}

/**
 * Versión para usar directamente con datos, no con FormData
 */
export async function createGoalDirect(userId: string, data: GoalFormData) {
  try {
    // Validar datos con Zod
    const validatedData = goalSchema.parse(data);

    // Simular llamada a API
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userId,
        ...validatedData,
        isCompleted: validatedData.currentAmount >= validatedData.targetAmount,
        isActive: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Error creando meta' };
    }

    // Revalidar la página del dashboard
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      data: validatedData 
    };
  } catch (error) {
    console.error('Error en createGoalDirect:', error);
    
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { 
        success: false, 
        validationErrors: fieldErrors 
      };
    }
    
    return { 
      success: false, 
      error: 'Error al procesar la meta' 
    };
  }
}
