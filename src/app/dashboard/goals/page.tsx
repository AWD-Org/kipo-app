'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals } from '@/store/thunks/goalsThunks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Filter, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, calculateProgress } from '@/lib/utils';
import { ReduxProvider } from '@/store';

// Componente principal de la lista de metas
function GoalsList() {
  const dispatch = useAppDispatch();
  const { items: goals, isLoading, error } = useAppSelector(state => state.goals);
  const [filterActive, setFilterActive] = useState<boolean | null>(true);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Cargar las metas al montar el componente
  useEffect(() => {
    // Simular ID de usuario para la demo
    dispatch(fetchGoals('demo-user-id'));
  }, [dispatch]);

  // Filtrar metas
  const filteredGoals = goals.filter(goal => {
    // Filtro por estado (activo/completado)
    const matchesActive = filterActive === null || goal.isActive === filterActive;
    
    // Filtro por categoría
    const matchesCategory = !filterCategory || goal.category === filterCategory;
    
    return matchesActive && matchesCategory;
  });

  // Categorías para filtrado
  const categories = [
    { value: 'ahorro', label: 'Ahorro' },
    { value: 'inversión', label: 'Inversión' },
    { value: 'deuda', label: 'Deuda' },
    { value: 'compra', label: 'Compra' },
    { value: 'otro', label: 'Otro' }
  ];

  // Renderizar cada meta
  const renderGoal = (goal: any) => {
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const daysLeft = Math.max(0, Math.ceil(
      (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    ));
    
    return (
      <Card key={goal.id} className={goal.isCompleted ? 'border-green-500' : ''}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{goal.title}</CardTitle>
              <CardDescription>{goal.description || 'Sin descripción'}</CardDescription>
            </div>
            {goal.isCompleted && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Completado
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${goal.isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(goal.currentAmount)}</span>
              <span>{formatCurrency(goal.targetAmount)}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {daysLeft > 0 ? `${daysLeft} días restantes` : 'Fecha vencida'}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Target className="h-4 w-4" />
              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/goals/${goal.id}`}>
              Ver detalles
            </Link>
          </Button>
          {!goal.isCompleted && (
            <Button size="sm" asChild>
              <Link href={`/dashboard/goals/${goal.id}/add-progress`}>
                Agregar progreso
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas financieras</h1>
          <p className="text-muted-foreground">
            Establece y gestiona tus objetivos financieros
          </p>
        </div>
        <Link href="/dashboard/new-goal">
          <Button className="gap-1">
            <Plus size={16} /> Nueva meta
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterActive === null ? 'default' : 'outline'}
          onClick={() => setFilterActive(null)}
        >
          Todas
        </Button>
        <Button
          variant={filterActive === true ? 'default' : 'outline'}
          onClick={() => setFilterActive(true)}
        >
          Activas
        </Button>
        <Button
          variant={filterActive === false ? 'default' : 'outline'}
          onClick={() => setFilterActive(false)}
        >
          Inactivas
        </Button>
        <div className="ml-auto">
          <select
            className="px-3 py-2 rounded-md border bg-background text-sm"
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value || null)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de metas */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-12 text-center text-destructive">
          {error}
        </div>
      ) : filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay metas</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {filterActive === true
                ? 'No tienes metas activas que coincidan con los filtros seleccionados.'
                : filterActive === false
                ? 'No tienes metas inactivas que coincidan con los filtros seleccionados.'
                : 'No tienes metas que coincidan con los filtros seleccionados.'}
            </p>
            <Link href="/dashboard/new-goal">
              <Button>Crear meta</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(renderGoal)}
        </div>
      )}
    </div>
  );
}

// Página con proveedor de Redux
export default function GoalsPage() {
  return (
    <ReduxProvider>
      <GoalsList />
    </ReduxProvider>
  );
}
