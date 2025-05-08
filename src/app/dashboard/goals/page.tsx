"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGoals } from "@/store/thunks/goalsThunks";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Target as TargetIcon } from "lucide-react";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { ReduxProvider } from "@/store";

export default function GoalsPage() {
    return (
        <ReduxProvider>
            <GoalsList />
        </ReduxProvider>
    );
}

function GoalsList() {
    const dispatch = useAppDispatch();
    const { items: goals, isLoading, error } = useAppSelector((s) => s.goals);
    const [filterActive, setFilterActive] = useState<boolean | null>(true);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchGoals());
    }, [dispatch]);

    const filtered = goals.filter(
        (g) =>
            (filterActive === null || g.isActive === filterActive) &&
            (!filterCategory || g.category === filterCategory)
    );

    const categories = [
        { value: "ahorro", label: "Ahorro" },
        { value: "inversión", label: "Inversión" },
        { value: "deuda", label: "Deuda" },
        { value: "compra", label: "Compra" },
        { value: "otro", label: "Otro" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Metas financieras</h1>
                    <p className="text-muted-foreground">
                        Gestiona tus objetivos
                    </p>
                </div>
                <Link href="/dashboard/new-goal">
                    <Button className="gap-1">
                        <Plus size={16} /> Nueva meta
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    variant={filterActive === null ? "default" : "outline"}
                    onClick={() => setFilterActive(null)}
                >
                    Todas
                </Button>
                <Button
                    variant={filterActive === true ? "default" : "outline"}
                    onClick={() => setFilterActive(true)}
                >
                    Activas
                </Button>
                <Button
                    variant={filterActive === false ? "default" : "outline"}
                    onClick={() => setFilterActive(false)}
                >
                    Inactivas
                </Button>
                <select
                    className="ml-auto px-2 py-1 border rounded"
                    value={filterCategory ?? ""}
                    onChange={(e) => setFilterCategory(e.target.value || null)}
                >
                    <option value="">Todas categorías</option>
                    {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Cards */}
            {error ? (
                <div className="p-12 text-center text-red-600">{error}</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        (isLoading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                  <Card
                                      key={i}
                                      className="h-72 flex flex-col relative overflow-hidden"
                                  >
                                      <CardHeader>
                                          <Skeleton className="h-6 w-1/3 rounded" />
                                          <Skeleton className="h-4 w-1/4 rounded mt-2" />
                                      </CardHeader>
                                      <CardContent className="space-y-4 flex-1">
                                          <Skeleton className="h-4 w-full rounded" />
                                          <Skeleton className="h-4 w-3/4 rounded" />
                                          <Skeleton className="h-2 w-full rounded" />
                                      </CardContent>
                                      <div className="absolute bottom-4 right-4">
                                          <Skeleton className="h-8 w-8 rounded-full" />
                                      </div>
                                  </Card>
                              ))
                            : filtered.map((g) => {
                                  const prog = calculateProgress(
                                      g.currentAmount,
                                      g.targetAmount
                                  );
                                  const daysLeft = Math.max(
                                      0,
                                      Math.ceil(
                                          (new Date(g.targetDate).getTime() -
                                              Date.now()) /
                                              (1000 * 60 * 60 * 24)
                                      )
                                  );
                                  return (
                                      <Link
                                          key={g.id}
                                          href={`/dashboard/goals/${g.id}`}
                                          className="block h-72"
                                      >
                                          <Card className="h-full flex flex-col relative hover:shadow-lg transition-shadow">
                                              <CardHeader>
                                                  <div className="flex justify-between items-center">
                                                      <div>
                                                          <CardTitle>
                                                              {g.title}
                                                          </CardTitle>
                                                          <CardDescription>
                                                              {g.description ||
                                                                  "—"}
                                                          </CardDescription>
                                                      </div>
                                                      <div className="inline-flex items-center space-x-1">
                                                          <Clock size={12} />
                                                          <span
                                                              className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
                                                                  daysLeft > 0
                                                                      ? "bg-blue-500"
                                                                      : "bg-red-500"
                                                              }`}
                                                          >
                                                              {daysLeft > 0
                                                                  ? `${daysLeft}d`
                                                                  : "Vencida"}
                                                          </span>
                                                      </div>
                                                  </div>
                                              </CardHeader>

                                              <CardContent className="space-y-4 flex-1">
                                                  <div className="space-y-2">
                                                      <div className="flex justify-between text-sm">
                                                          <span>Progreso</span>
                                                          <span>
                                                              {Math.round(prog)}
                                                              %
                                                          </span>
                                                      </div>
                                                      <div className="w-full bg-secondary rounded-full h-2.5">
                                                          <div
                                                              className={`h-2.5 rounded-full ${
                                                                  g.isCompleted
                                                                      ? "bg-green-500"
                                                                      : "bg-primary"
                                                              }`}
                                                              style={{
                                                                  width: `${prog}%`,
                                                              }}
                                                          />
                                                      </div>
                                                      <div className="flex justify-between text-xs text-muted-foreground">
                                                          <span>
                                                              {formatCurrency(
                                                                  g.currentAmount
                                                              )}
                                                          </span>
                                                          <span>
                                                              {formatCurrency(
                                                                  g.targetAmount
                                                              )}
                                                          </span>
                                                      </div>
                                                  </div>

                                                  {g.suggestedPlan && (
                                                      <div className="mt-4 p-2 bg-gray-50 rounded">
                                                          <div className="flex items-center justify-between">
                                                              <span className="text-sm font-medium">
                                                                  Plan de Ahorro
                                                                  Sugerido
                                                              </span>
                                                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                                                                  Creado con IA
                                                              </span>
                                                          </div>
                                                          <div className="text-sm mt-1">
                                                              <div>
                                                                  Mensual:{" "}
                                                                  {formatCurrency(
                                                                      g
                                                                          .suggestedPlan
                                                                          .monthly
                                                                  )}
                                                              </div>
                                                              <div>
                                                                  Semanal:{" "}
                                                                  {formatCurrency(
                                                                      g
                                                                          .suggestedPlan
                                                                          .weekly
                                                                  )}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  )}
                                              </CardContent>

                                              {/* Icon button para agregar progreso */}
                                              {!g.isCompleted && (
                                                  <Link
                                                      href={`/dashboard/goals/${g.id}/add-progress`}
                                                      onClick={(e) =>
                                                          e.stopPropagation()
                                                      }
                                                      className="absolute bottom-4 right-4 inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full shadow"
                                                      title="Agregar progreso"
                                                      aria-label="Agregar progreso a esta meta"
                                                  >
                                                      <Plus size={16} />
                                                  </Link>
                                              )}
                                          </Card>
                                      </Link>
                                  );
                              })) as React.ReactNode
                    }
                </div>
            )}
        </div>
    );
}
