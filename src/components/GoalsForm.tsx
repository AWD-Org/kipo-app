'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, CalendarIcon, Target } from 'lucide-react';
import { createGoal } from '@/app/actions/createGoal';
import { useSession } from 'next-auth/react';
import { calculateProgress, formatCurrency } from '@/lib/utils';

// Categorías predefinidas para metas
const GOAL_CATEGORIES = [
  'ahorro', 'inversión', 'deuda', 'compra', 'otro'
];

// Prioridades disponibles
const GOAL_PRIORITIES = [
  'baja', 'media', 'alta'
];

// Frecuencias para recordatorios
const REMINDER_FREQUENCIES = [
  { value: 'none', label: 'Sin recordatorios' },
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' }
];

export default function GoalsForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    category: 'ahorro',
    priority: 'media',
    reminderFrequency: 'none'
  });

  // Manejador para cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

      // Validaciones básicas
      if (!formData.title.trim()) {
        setError('El título de la meta es requerido');
        return;
      }

      if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
        setError('El monto objetivo debe ser mayor a cero');
        return;
      }

      if (parseFloat(formData.currentAmount) < 0) {
        setError('El monto actual no puede ser negativo');
        return;
      }

      if (!formData.targetDate) {
        setError('La fecha objetivo es requerida');
        return;
      }

      const today = new Date();
      const targetDate = new Date(formData.targetDate);
      if (targetDate <= today) {
        setError('La fecha objetivo debe ser en el futuro');
        return;
      }

      // Crear FormData para enviar a la acción del servidor
      const serverFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        serverFormData.append(key, value.toString());
      });

      // Llamar a la acción del servidor
      const result = await createGoal(session.user.id, serverFormData);

      if (!result.success) {
        if (result.validationErrors) {
          const errorMessages = Object.values(result.validationErrors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(result.error || 'Error al crear la meta');
        }
        return;
      }

      // Mostrar mensaje de éxito 
      setSuccess(true);
      
      // Opcional: resetear el formulario o redirigir
      if (window.confirm('Meta creada con éxito. ¿Deseas crear otra?')) {
        setFormData({
          title: '',
          description: '',
          targetAmount: '',
          currentAmount: '0',
          startDate: new Date().toISOString().split('T')[0],
          targetDate: '',
          category: 'ahorro',
          priority: 'media',
          reminderFrequency: 'none'
        });
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error en createGoal:', error);
      setError('Error al procesar la meta');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular progreso actual
  const progress = calculateProgress(
    parseFloat(formData.currentAmount) || 0, 
    parseFloat(formData.targetAmount) || 1
  );

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
          <h1 className="text-2xl font-bold">Nueva meta financiera</h1>
        </div>

        {/* Título de la meta */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Título de la meta
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Ej. Fondo de emergencia, Vacaciones, etc."
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Descripción detallada de tu meta"
            value={formData.description}
            onChange={handleChange}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Monto objetivo */}
        <div className="space-y-2">
          <label htmlFor="targetAmount" className="text-sm font-medium">
            Monto objetivo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={handleChange}
              className="pl-8"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        {/* Monto actual */}
        <div className="space-y-2">
          <label htmlFor="currentAmount" className="text-sm font-medium">
            Monto actual (si ya tienes ahorrado algo)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="currentAmount"
              name="currentAmount"
              type="number"
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={handleChange}
              className="pl-8"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Barra de progreso */}
        {formData.targetAmount && parseFloat(formData.targetAmount) > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso actual</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(parseFloat(formData.currentAmount) || 0)}</span>
              <span>{formatCurrency(parseFloat(formData.targetAmount) || 0)}</span>
            </div>
          </div>
        )}

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Fecha de inicio
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="targetDate" className="text-sm font-medium">
              Fecha objetivo
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="targetDate"
                name="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        {/* Categoría y Prioridad */}
        <div className="grid grid-cols-2 gap-4">
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
              {GOAL_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {GOAL_PRIORITIES.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recordatorios */}
        <div className="space-y-2">
          <label htmlFor="reminderFrequency" className="text-sm font-medium">
            Recordatorios
          </label>
          <select
            id="reminderFrequency"
            name="reminderFrequency"
            value={formData.reminderFrequency}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {REMINDER_FREQUENCIES.map(freq => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Recibirás recordatorios para contribuir a esta meta según la frecuencia seleccionada.
          </p>
        </div>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        {success && (
          <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
            Meta creada con éxito.
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
              'Guardar meta'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
