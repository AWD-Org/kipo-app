'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Esquema de validación con Zod
const transactionSchema = z.object({
  type: z.enum(['ingreso', 'gasto']),
  amount: z.number().positive({ message: 'El monto debe ser positivo' }),
  category: z.string().min(1, { message: 'La categoría es requerida' }),
  description: z.string().optional(),
  date: z.string().transform(str => new Date(str)),
  isRecurrent: z.boolean().optional().default(false),
  recurrenceFrequency: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).optional().default('none'),
  tags: z.array(z.string()).optional().default([])
});

type TransactionFormData = z.infer<typeof transactionSchema>;

/**
 * Acción del servidor para crear una nueva transacción
 */
export async function createTransaction(userId: string, formData: FormData) {
  try {
    // Extraer y transformar datos del formulario
    const rawData = {
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category'),
      description: formData.get('description'),
      date: formData.get('date'),
      isRecurrent: formData.get('isRecurrent') === 'on',
      recurrenceFrequency: formData.get('recurrenceFrequency'),
      tags: formData.getAll('tags').map(tag => tag.toString())
    };
    
    // Validar datos con Zod
    const validatedData = transactionSchema.parse(rawData);

    // En producción, esto haría una llamada a la API real
    // Por ahora, simulamos una respuesta exitosa
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userId,
        ...validatedData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Error creando transacción' };
    }

    // Revalidar la página del dashboard para reflejar la nueva transacción
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      data: validatedData 
    };
  } catch (error) {
    console.error('Error en createTransaction:', error);
    
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { 
        success: false, 
        validationErrors: fieldErrors 
      };
    }
    
    return { 
      success: false, 
      error: 'Error al procesar la transacción' 
    };
  }
}

/**
 * Versión para usar directamente con datos, no con FormData
 */
export async function createTransactionDirect(userId: string, data: TransactionFormData) {
  try {
    // Validar datos con Zod
    const validatedData = transactionSchema.parse(data);

    // Simular llamada a API
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userId,
        ...validatedData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Error creando transacción' };
    }

    // Revalidar la página del dashboard
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      data: validatedData 
    };
  } catch (error) {
    console.error('Error en createTransactionDirect:', error);
    
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { 
        success: false, 
        validationErrors: fieldErrors 
      };
    }
    
    return { 
      success: false, 
      error: 'Error al procesar la transacción' 
    };
  }
}
