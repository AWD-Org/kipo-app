// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Plus,
    ChevronRight,
    Wallet,
    Target,
    TrendingUp,
    AlertTriangle,
    AlertCircle,
    Lightbulb,
    Target as TargetIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTransactions } from "@/store/thunks/transactionsThunks";
import { fetchGoals } from "@/store/thunks/goalsThunks";
import { fetchAnalyticsSummary } from "@/store/thunks/analyticsThunks";
import { fetchRecommendations } from "@/store/thunks/recommendationsThunks";
import { AnalyticsSummary } from "@/types/analytics";
import { Recommendation } from "@/types/recommendation";

const COLORS = [
    "#111111", // Muy oscuro
    "#333333",
    "#555555",
    "#777777",
    "#999999",
    "#BBBBBB",
    "#DDDDDD",
    "#EEEEEE",
    "#F5F5F5", // Casi blanco
];

// Mapeo de tipos de recomendación a iconos y colores
const RECOMMENDATION_ICONS = {
    ALERTA_CATEGORIA: { icon: AlertTriangle, color: "text-amber-500" },
    ALERTA_GLOBAL: { icon: AlertCircle, color: "text-red-500" },
    CONSEJO_HABITO: { icon: Lightbulb, color: "text-blue-500" },
    META_NUEVA: { icon: TargetIcon, color: "text-green-500" },
};

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { data: session } = useSession({ required: false });
    const userId = session?.user?.id!;

    // Redux state slices
    const transactions = useAppSelector((s) => s.transactions.items);
    const txLoading = useAppSelector((s) => s.transactions.isLoading);
    const txError = useAppSelector((s) => s.transactions.error);

    const goals = useAppSelector((s) => s.goals.items);
    const goalsLoading = useAppSelector((s) => s.goals.isLoading);

    const analytics = useAppSelector(
        (s) => s.analytics.summary
    ) as AnalyticsSummary;
    const analyticsLoading = useAppSelector((s) => s.analytics.loading);

    // Recomendaciones
    const recommendations = useAppSelector((s) => s.recommendations.items);
    const recsLoading = useAppSelector((s) => s.recommendations.loading);
    const recsError = useAppSelector((s) => s.recommendations.error);

    // Fetch data on mount
    useEffect(() => {
        if (!userId) return;

        dispatch(fetchTransactions());
        dispatch(fetchGoals());
        dispatch(fetchAnalyticsSummary({ userId }));

        dispatch(
            fetchRecommendations({
                limit: 100,
            })
        );
    }, [dispatch, userId]);

    // Prepare chart data
    const pieData = transactions
        .filter((t) => t.type === "gasto")
        .reduce<{ name: string; value: number }[]>((acc, t) => {
            const found = acc.find((c) => c.name === t.category);
            if (found) found.value += t.amount;
            else acc.push({ name: t.category, value: t.amount });
            return acc;
        }, []);

    const maxValue = Math.max(...pieData.map((d) => d.value), 0) || 1;
    const grouped = transactions.reduce<
        Record<string, { date: string; ingresos: number; gastos: number }>
    >((acc, t) => {
        const d = (t.date as string).slice(0, 10);
        if (!acc[d]) acc[d] = { date: d, ingresos: 0, gastos: 0 };
        acc[d][t.type === "ingreso" ? "ingresos" : "gastos"] += t.amount;
        return acc;
    }, {});
    const lineData = Object.values(grouped).sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    const barData = goals.map((g) => ({
        name: g.title,
        actual: g.currentAmount,
        objetivo: g.targetAmount,
        progreso: Math.round((g.currentAmount / g.targetAmount) * 100),
    }));

    if (!session) {
        return (
            <div className="p-8 text-center">
                <p>Inicia sesión para ver tu Dashboard.</p>
            </div>
        );
    }

    // Renderizar una recomendación individual
    const renderRecommendation = (rec: Recommendation) => {
        const { icon: Icon, color } = RECOMMENDATION_ICONS[rec.type] || {
            icon: Lightbulb,
            color: "text-gray-500",
        };

        return (
            <div
                key={rec._id}
                className="flex items-start gap-3 border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0"
            >
                <div className={`p-2 rounded-full ${color} bg-opacity-10 mt-1`}>
                    <Icon size={18} className={color} />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                        {rec.message}
                    </p>
                    {rec.relatedCategory && (
                        <div className="text-xs text-muted-foreground mt-2 inline-flex items-center">
                            <span className="bg-gray-200 rounded-full px-2 py-1">
                                {rec.relatedCategory}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Bienvenido, {session.user.name}.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/new-transaction">
                        <Button variant="ghost" className="gap-1">
                            <Plus size={16} /> Nueva transacción
                        </Button>
                    </Link>
                    <Link href="/dashboard/new-goal">
                        <Button variant="ghost" className="gap-1">
                            <Plus size={16} /> Nueva meta
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex justify-between pb-2">
                        <CardTitle className="text-sm">
                            Balance disponible
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {analyticsLoading ? (
                            <Skeleton className="h-8 w-24 rounded" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {formatCurrency(analytics.availableBalance)}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {analyticsLoading ? (
                                <Skeleton className="h-4 w-32 mt-1 rounded" />
                            ) : (
                                analytics.balanceDiffLabel
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex justify-between pb-2">
                        <CardTitle className="text-sm">
                            Ingresos del mes
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {analyticsLoading ? (
                            <Skeleton className="h-8 w-24 rounded" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {formatCurrency(analytics.totalIncome)}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {analyticsLoading ? (
                                <Skeleton className="h-4 w-32 mt-1 rounded" />
                            ) : (
                                analytics.incomeDiffLabel
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex justify-between pb-2">
                        <CardTitle className="text-sm">
                            Gastos del mes
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {analyticsLoading ? (
                            <Skeleton className="h-8 w-24 rounded" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {formatCurrency(analytics.totalExpenses)}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {analyticsLoading ? (
                                <Skeleton className="h-4 w-32 mt-1 rounded" />
                            ) : (
                                analytics.expenseDiffLabel
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex justify-between pb-2">
                        <CardTitle className="text-sm">
                            Ahorros actuales
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {analyticsLoading ? (
                            <Skeleton className="h-8 w-24 rounded" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {formatCurrency(analytics.totalSavings)}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {analyticsLoading ? (
                                <Skeleton className="h-4 w-32 mt-1 rounded" />
                            ) : (
                                `${Math.round(
                                    analytics.savingsRate * 100
                                )}% de la meta`
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                {/* Pie */}
                <Card className="col-span-12 md:col-span-12 lg:col-span-6">
                    <CardHeader>
                        <CardTitle>Gastos por categoría</CardTitle>
                        <CardDescription>Distribución mensual</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {txLoading ? (
                            <Skeleton className="h-[300px] w-full rounded" />
                        ) : (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={pieData}
                                        margin={{
                                            top: 20,
                                            right: 20,
                                            left: 0,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis
                                            tickFormatter={(v) =>
                                                formatCurrency(v as number)
                                            }
                                        />
                                        <Tooltip
                                            formatter={(v) =>
                                                formatCurrency(v as number)
                                            }
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={COLORS[0]}
                                            fill={COLORS[0]}
                                            fillOpacity={0.3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Line */}
                <Card className="col-span-12 md:col-span-12 lg:col-span-6">
                    <CardHeader>
                        <CardTitle>Ingresos vs Gastos</CardTitle>
                        <CardDescription>Diario</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {txLoading ? (
                            <Skeleton className="h-[300px] w-full rounded" />
                        ) : (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(v) =>
                                                formatCurrency(v as number)
                                            }
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="ingresos"
                                            stroke={COLORS[1]}
                                            dot={{ fill: COLORS[1] }}
                                            activeDot={{
                                                r: 8,
                                                fill: COLORS[1],
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="gastos"
                                            stroke={COLORS[3]}
                                            dot={{ fill: COLORS[3] }}
                                            activeDot={{
                                                r: 8,
                                                fill: COLORS[3],
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bar */}
                <Card className="col-span-12">
                    <CardHeader>
                        <CardTitle>Progreso de metas</CardTitle>
                        <CardDescription>Avance % vs objetivo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {goalsLoading ? (
                            <Skeleton className="h-[300px] w-full rounded" />
                        ) : (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis yAxisId="left" />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                        />
                                        <Tooltip
                                            formatter={(v, name) =>
                                                name === "progreso"
                                                    ? `${v}%`
                                                    : formatCurrency(
                                                          v as number
                                                      )
                                            }
                                        />
                                        <Legend />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="actual"
                                            fill={COLORS[1]} // "#333333"
                                        />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="objetivo"
                                            fill={COLORS[3]} // "#777777"
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="progreso"
                                            stroke={COLORS[2]} // "#555555"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Últimas Transacciones */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex justify-between items-center">
                        <div>
                            <CardTitle>Últimas transacciones</CardTitle>
                            <CardDescription>
                                Movimientos recientes
                            </CardDescription>
                        </div>
                        <Link href="/dashboard/transactions">
                            <Button variant="ghost" size="sm" className="gap-1">
                                Ver todas <ChevronRight size={16} />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {txLoading && (
                            <Skeleton className="h-40 w-full rounded" />
                        )}
                        {txError && <p className="text-red-600">{txError}</p>}
                        {!txLoading &&
                            !txError &&
                            transactions.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No hay transacciones.
                                </p>
                            )}

                        <div className="space-y-4">
                            {!txLoading &&
                                transactions.slice(0, 5).map((tx) => {
                                    const isIngreso = tx.type === "ingreso";
                                    const barBg = isIngreso
                                        ? "bg-green-700"
                                        : "bg-red-700";
                                    const textColor = isIngreso
                                        ? "text-green-700"
                                        : "text-red-700";

                                    return (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`
                  w-2 h-10 rounded-full
                  ${barBg}
                `}
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {tx.category}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {tx.date.slice(0, 10)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className={`font-bold ${textColor}`}
                                            >
                                                {isIngreso ? "+" : "-"}
                                                {formatCurrency(tx.amount)}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>

                {/* Alertas */}
                <Card>
                    <CardHeader className="flex justify-between items-center">
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
                        
                    </CardContent>
                </Card>
            </div>

            {/* Recomendaciones IA */}
            <Card>
                <CardHeader>
                    <CardTitle>Recomendaciones personalizadas</CardTitle>
                    <CardDescription>
                        Sugerencias inteligentes basadas en tus hábitos
                        financieros
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {recsLoading && (
                        <Skeleton className="h-60 w-full rounded" />
                    )}
                    {recsError && <p className="text-red-700">{recsError}</p>}

                    {!recsLoading && !recsError && (
                        <div className="max-h-96 overflow-y-auto space-y-4">
                            {/* Mostrar todas las recomendaciones */}
                            {recommendations.map(renderRecommendation)}

                            {recommendations.length === 0 && (
                                <p className="text-sm text-muted-foreground col-span-2 text-center py-10">
                                    No hay recomendaciones disponibles.
                                    Sigue usando la aplicación para recibir
                                    consejos personalizados.
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
