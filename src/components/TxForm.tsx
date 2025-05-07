'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, CalendarIcon, TagIcon, RefreshCw } from 'lucide-react';
import { createTransaction } from '@/app/actions/createTransaction';
import { useSession } from 'next-auth/react';

// Categorías predefinidas para gastos e ingresos
const EXPENSE_CATEGORIES = [
  'Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Entretenimiento',
  'Salud', 'Educación', 'Ropa', 'Personal', 'Mascotas', 'Deudas', 'Otros'
];

const INCOME_CATEGORIES = [
  'Salario', 'Freelance', 'Inversiones', 'Venta', 'Regalo', 'Reembolso', 'Otros'
];

export default function TxForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    type: 'gasto',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurrent: false,
    recurrenceFrequency: 'none',
    tags: [] as string[],
  });

  // Estado para nuevo tag
  const [newTag, setNewTag] = useState('');

  // Manejador para cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Añadir un nuevo tag
  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  // Eliminar un tag
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      setSuccess(false);

      if (!session?.user?.id) {
        setError('Debes iniciar sesión para realizar esta acción');
        return;
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError('El monto debe ser mayor a cero');
        return;
      }

      if (!formData.category) {
        setError('Debes seleccionar una categoría');
        return;
      }

      // Crear FormData para enviar a la acción del servidor
      const serverFormData = new FormData();
      serverFormData.append('type', formData.type);
      serverFormData.append('amount', formData.amount);
      serverFormData.append('category', formData.category);
      serverFormData.append('description', formData.description);
      serverFormData.append('date', formData.date);
      serverFormData.append('isRecurrent', formData.isRecurrent ? 'on' : 'off');
      serverFormData.append('recurrenceFrequency', formData.recurrenceFrequency);
      formData.tags.forEach(tag => {
        serverFormData.append('tags', tag);
      });

      // Llamar a la acción del servidor
      const result = await createTransaction(session.user.id, serverFormData);

      if (!result.success) {
        if (result.validationErrors) {
          const errorMessages = Object.values(result.validationErrors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(result.error || 'Error al crear la transacción');
        }
        return;
      }

      // Mostrar mensaje de éxito y resetear el formulario si lo desea
      setSuccess(true);
      
      // Opcional: resetear el formulario o redirigir
      if (window.confirm('Transacción creada con éxito. ¿Deseas crear otra?')) {
        setFormData({
          type: 'gasto',
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          isRecurrent: false,
          recurrenceFrequency: 'none',
          tags: [],
        });
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error en createTransaction:', error);
      setError('Error al procesar la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener las categorías según el tipo de transacción
  const categories = formData.type === 'ingreso' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="kipo-form-container">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-1"
          >
            <ArrowLeft size={16} /> Volver
          </Button>
          <h1 className="text-2xl font-bold">Nueva transacción</h1>
        </div>

        {/* Tipo de transacción */}
        <div className="space-y-4">
          <label className="text-sm font-medium block">Tipo de transacción</label>
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 rounded-md border p-3 cursor-pointer ${
              formData.type === 'ingreso' 
                ? 'bg-green-50 border-green-500 text-green-700' 
                : 'bg-background hover:bg-muted/50'
            }`}>
              <input
                type="radio"
                name="type"
                value="ingreso"
                checked={formData.type === 'ingreso'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Ingreso</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 rounded-md border p-3 cursor-pointer ${
              formData.type === 'gasto' 
                ? 'bg-red-50 border-red-500 text-red-700' 
                : 'bg-background hover:bg-muted/50'
            }`}>
              <input
                type="radio"
                name="type"
                value="gasto"
                checked={formData.type === 'gasto'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Gasto</span>
            </label>
          </div>
        </div>

        {/* Monto */}
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              className="pl-8"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Descripción de la transacción"
            value={formData.description}
            onChange={handleChange}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Fecha
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Recurrencia */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="isRecurrent"
              name="isRecurrent"
              type="checkbox"
              checked={formData.isRecurrent}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isRecurrent" className="ml-2 text-sm font-medium">
              Es una transacción recurrente
            </label>
          </div>
          
          {formData.isRecurrent && (
            <div className="ml-6">
              <label htmlFor="recurrenceFrequency" className="text-sm font-medium">
                Frecuencia
              </label>
              <select
                id="recurrenceFrequency"
                name="recurrenceFrequency"
                value={formData.recurrenceFrequency}
                onChange={handleChange}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="none">Selecciona una frecuencia</option>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          )}
        </div>

        {/* Etiquetas */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Etiquetas (opcional)</label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Añadir etiqueta"
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={addTag}
              disabled={!newTag}
            >
              Añadir
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 h-4 w-4 rounded-full flex items-center justify-center hover:bg-background/80"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        {success && (
          <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
            Transacción creada con éxito.
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar transacción'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
