'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Plus, ChevronRight, Wallet, Target, Bell, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

// Datos dummy para demostración
const DUMMY_DATA = {
  transactions: [
    { id: 1, type: 'ingreso', amount: 25000, category: 'Salario', date: '2023-11-01', description: 'Nómina mensual' },
    { id: 2, type: 'gasto', amount: 7500, category: 'Vivienda', date: '2023-11-02', description: 'Renta' },
    { id: 3, type: 'gasto', amount: 3000, category: 'Alimentación', date: '2023-11-05', description: 'Compra semanal' },
    { id: 4, type: 'gasto', amount: 1200, category: 'Transporte', date: '2023-11-08', description: 'Gasolina' },
    { id: 5, type: 'gasto', amount: 2500, category: 'Servicios', date: '2023-11-10', description: 'Luz y agua' },
    { id: 6, type: 'gasto', amount: 1800, category: 'Entretenimiento', date: '2023-11-15', description: 'Cine y cena' },
    { id: 7, type: 'ingreso', amount: 3000, category: 'Freelance', date: '2023-11-20', description: 'Proyecto extra' },
    { id: 8, type: 'gasto', amount: 1500, category: 'Salud', date: '2023-11-25', description: 'Medicamentos' },
  ],
  goals: [
    { id: 1, title: 'Fondo de emergencia', targetAmount: 50000, currentAmount: 15000, category: 'ahorro', targetDate: '2024-06-30' },
    { id: 2, title: 'Vacaciones', targetAmount: 20000, currentAmount: 5000, category: 'ahorro', targetDate: '2024-07-15' },
    { id: 3, title: 'Nuevo laptop', targetAmount: 25000, currentAmount: 8000, category: 'compra', targetDate: '2024-03-01' },
  ],
  alerts: [
    { id: 1, type: 'warning', message: 'Has gastado 80% de tu presupuesto de Entretenimiento este mes', date: '2023-11-26' },
    { id: 2, type: 'info', message: 'Tu meta "Nuevo laptop" va por buen camino, has ahorrado 32% del objetivo. ¡Sigue así!', date: '2023-11-25' },
    { id: 3, type: 'success', message: 'Tu balance este mes es positivo, ¡felicidades!', date: '2023-11-24' },
  ]
};

// Preparar datos para gráficos
const prepareChartData = () => {
  // Gastos por categoría para gráfico de pie
  const expensesByCategory = DUMMY_DATA.transactions
    .filter(tx => tx.type === 'gasto')
    .reduce((acc, tx) => {
      const existingCategory = acc.find(item => item.name === tx.category);
      if (existingCategory) {
        existingCategory.value += tx.amount;
      } else {
        acc.push({ name: tx.category, value: tx.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // Datos para gráfico de línea (ingresos vs gastos por día)
  const transactionsByDate = DUMMY_DATA.transactions.reduce((acc, tx) => {
    const date = tx.date.substring(0, 10);
    if (!acc[date]) {
      acc[date] = { date, ingresos: 0, gastos: 0 };
    }
    if (tx.type === 'ingreso') {
      acc[date].ingresos += tx.amount;
    } else {
      acc[date].gastos += tx.amount;
    }
    return acc;
  }, {} as Record<string, { date: string; ingresos: number; gastos: number }>);

  const lineChartData = Object.values(transactionsByDate).sort((a, b) => a.date.localeCompare(b.date));

  // Datos para gráfico de barras (progreso de metas)
  const goalsProgress = DUMMY_DATA.goals.map(goal => ({
    name: goal.title,
    actual: goal.currentAmount,
    objetivo: goal.targetAmount,
    progreso: Math.round((goal.currentAmount / goal.targetAmount) * 100)
  }));

  return {
    expensesByCategory,
    lineChartData,
    goalsProgress
  };
};

export default function Dashboard() {
  // Usar sesión o crear una sesión simulada para desarrollo
  const { data: session } = useSession({ required: false });
  const userName = session?.user?.name || 'Usuario';
  
  const [chartData, setChartData] = useState(() => prepareChartData());

  // Calcular resumen financiero
  const financialSummary = {
    totalIncome: DUMMY_DATA.transactions
      .filter(tx => tx.type === 'ingreso')
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalExpenses: DUMMY_DATA.transactions
      .filter(tx => tx.type === 'gasto')
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalSavings: DUMMY_DATA.goals.reduce((sum, goal) => sum + goal.currentAmount, 0),
    totalGoals: DUMMY_DATA.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  };

  // Balance disponible
  const availableBalance = financialSummary.totalIncome - financialSummary.totalExpenses;

  // Colores para los gráficos
  const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

  return (
    <div className="kipo-dashboard-layout">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {userName}. Aquí está tu resumen financiero.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Exportar datos
          </Button>
          <Link href="/dashboard/new-transaction">
            <Button className="gap-1">
              <Plus size={16} /> Nueva transacción
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Balance disponible
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(availableBalance)}</div>
            <p className="text-xs text-muted-foreground">
              {availableBalance >= 0 
                ? '+' + formatCurrency(availableBalance - 10000) + ' vs. mes pasado'
                : formatCurrency(availableBalance - 10000) + ' vs. mes pasado'
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(2000)} vs. mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gastos del mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              -{formatCurrency(1500)} vs. mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ahorros actuales
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalSavings)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((financialSummary.totalSavings / financialSummary.totalGoals) * 100)}% de la meta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico de gastos por categoría */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Gastos por categoría</CardTitle>
            <CardDescription>
              Distribución de tus gastos este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de ingresos vs gastos por día */}
        <Card className="col-span-full md:col-span-1 lg:col-span-5">
          <CardHeader>
            <CardTitle>Ingresos vs Gastos</CardTitle>
            <CardDescription>
              Comparativa diaria del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#4f46e5" activeDot={{ r: 8 }} name="Ingresos" />
                  <Line type="monotone" dataKey="gastos" stroke="#ef4444" name="Gastos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de progreso de metas */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Progreso de metas</CardTitle>
            <CardDescription>
              Avance actual hacia tus objetivos financieros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.goalsProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
                  <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'progreso') return `${value}%`;
                    return formatCurrency(value as number);
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="actual" name="Ahorrado" fill="#4f46e5" />
                  <Bar yAxisId="left" dataKey="objetivo" name="Objetivo" fill="#8b5cf6" />
                  <Line yAxisId="right" type="monotone" dataKey="progreso" name="Progreso %" stroke="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secciones inferiores */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Últimas transacciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Últimas transacciones</CardTitle>
              <CardDescription>
                Movimientos recientes en tu cuenta
              </CardDescription>
            </div>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todas <ChevronRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DUMMY_DATA.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${transaction.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${transaction.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'ingreso' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Alertas y notificaciones</CardTitle>
              <CardDescription>
                Información importante sobre tus finanzas
              </CardDescription>
            </div>
            <Link href="/dashboard/alerts">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todas <ChevronRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DUMMY_DATA.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    alert.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sugerencias de la IA */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones personalizadas</CardTitle>
          <CardDescription>
            Sugerencias inteligentes basadas en tus hábitos financieros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-primary/5">
              <h3 className="font-semibold mb-2">Oportunidad de ahorro detectada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tus gastos en la categoría de Entretenimiento han aumentado un 15% en los últimos dos meses. 
                Considerando tu meta de ahorro, podrías reducir este gasto para alcanzar tu objetivo más rápido.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Ver detalles</Button>
                <Button size="sm">Establecer límite</Button>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-primary/5">
              <h3 className="font-semibold mb-2">Planifica para próximos gastos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Basado en tu historial, es probable que tengas gastos de servicios públicos en los próximos 5 días. 
                Asegúrate de tener suficiente saldo disponible.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Ver detalles</Button>
                <Button size="sm">Crear recordatorio</Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">Ver más recomendaciones</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
