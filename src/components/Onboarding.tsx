'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

// Categorías de gastos comunes para seleccionar
const EXPENSE_CATEGORIES = [
  'Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Entretenimiento',
  'Salud', 'Educación', 'Ropa', 'Ahorro', 'Deudas', 'Inversiones', 'Otros'
];

// Opciones para conocer la app
const REFERRAL_OPTIONS = [
  'Amigo o familiar', 'Redes sociales', 'Búsqueda en internet', 
  'Anuncio', 'Artículo o blog', 'Otro'
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Datos del onboarding
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [mainExpenseCategories, setMainExpenseCategories] = useState<string[]>([]);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [referralSource, setReferralSource] = useState('');

  const handleNextStep = () => {
    // Validación según el paso actual
    if (step === 1 && !monthlyIncome) {
      setError('Por favor ingresa tu ingreso mensual aproximado');
      return;
    } else if (step === 2 && !monthlyExpenses) {
      setError('Por favor ingresa tu gasto mensual aproximado');
      return;
    } else if (step === 3 && mainExpenseCategories.length === 0) {
      setError('Por favor selecciona al menos una categoría de gasto');
      return;
    } else if (step === 4 && !savingsGoal) {
      setError('Por favor ingresa cuánto deseas ahorrar mensualmente');
      return;
    }

    setError('');
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleCategory = (category: string) => {
    if (mainExpenseCategories.includes(category)) {
      setMainExpenseCategories(mainExpenseCategories.filter(cat => cat !== category));
    } else {
      setMainExpenseCategories([...mainExpenseCategories, category]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Llamar a la API para completar onboarding (simulado)
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        credentials: 'include',              
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyIncome: parseFloat(monthlyIncome),
          monthlyExpenses: parseFloat(monthlyExpenses),
          mainExpenseCategories,
          savingsGoal: parseFloat(savingsGoal),
          referralSource,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Ocurrió un error al guardar tus datos');
        return;
      }

      // Redireccionar al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en onboarding:', error);
      setError('Ocurrió un error al guardar tus datos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2 space-x-1">
            {[1, 2, 3, 4, 5].map(stepNumber => (
              <div 
                key={stepNumber}
                className={`h-2 w-10 rounded-full ${
                  stepNumber === step 
                    ? 'bg-primary' 
                    : stepNumber < step 
                      ? 'bg-primary/70' 
                      : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl font-bold">Configuremos tu cuenta</CardTitle>
          <CardDescription>
            {step === 1 && 'Para brindarte la mejor experiencia, necesitamos conocer un poco sobre tus finanzas'}
            {step === 2 && 'Ahora cuéntanos sobre tus gastos mensuales'}
            {step === 3 && 'Selecciona tus principales categorías de gasto'}
            {step === 4 && '¿Cuánto te gustaría ahorrar mensualmente?'}
            {step === 5 && 'Última pregunta, ¿cómo nos conociste?'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Paso 1: Ingreso mensual */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="monthlyIncome" className="text-sm font-medium">
                    ¿Cuál es tu ingreso mensual aproximado?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="0.00"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="pl-8"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este valor nos ayudará a personalizar tus metas financieras
                  </p>
                </div>
              </div>
            )}

            {/* Paso 2: Gastos mensuales */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="monthlyExpenses" className="text-sm font-medium">
                    ¿Cuál es tu gasto mensual aproximado?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="monthlyExpenses"
                      type="number"
                      placeholder="0.00"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(e.target.value)}
                      className="pl-8"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye todos tus gastos regulares como vivienda, alimentación, transporte, etc.
                  </p>
                </div>
              </div>
            )}

            {/* Paso 3: Categorías de gasto */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Selecciona tus principales categorías de gasto
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {EXPENSE_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          mainExpenseCategories.includes(category)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecciona todas las que apliquen (máximo 5)
                  </p>
                </div>
              </div>
            )}

            {/* Paso 4: Meta de ahorro */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="savingsGoal" className="text-sm font-medium">
                    ¿Cuánto te gustaría ahorrar mensualmente?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="savingsGoal"
                      type="number"
                      placeholder="0.00"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                      className="pl-8"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Establecer una meta de ahorro te ayudará a construir un futuro financiero sólido
                  </p>
                </div>
              </div>
            )}

            {/* Paso 5: Fuente de referencia */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    ¿Cómo conociste Kipo?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {REFERRAL_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setReferralSource(option)}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          referralSource === option
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={step === 1 || isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : step === 5 ? (
              <>
                Finalizar
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
