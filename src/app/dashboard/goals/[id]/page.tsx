// src/app/dashboard/goals/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import Goal from "../../../../../models/Goal";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
    params: { id: string };
}

type LeanGoal = {
    _id: string;
    user: string;
    title: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    startDate: Date;
    targetDate: Date;
    category: string;
    priority: string;
    isCompleted: boolean;
    isActive: boolean;
    reminderFrequency: string;
    suggestedPlan?: {
        monthly: number;
        weekly: number;
    };
};

export const dynamic = "force-dynamic";

export default async function GoalDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    await connectDB();
    const raw = await Goal.findById(params.id).lean();
    if (!raw || Array.isArray(raw)) notFound();

    const goal = raw as unknown as LeanGoal;
    if (goal.user.toString() !== session.user.id) notFound();

    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const daysLeft = Math.max(
        0,
        Math.ceil(
            (new Date(goal.targetDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
        )
    );

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Título + días restantes */}
            <div className="col-span-full flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold inline-block mr-4">
                        {goal.title}
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        {goal.isCompleted
                            ? "Completada"
                            : daysLeft > 0
                            ? `${daysLeft} días restantes`
                            : "Vencida"}
                    </span>
                </div>
                <Link href="/dashboard/goals">
                    <Button variant="ghost">← Volver a Metas</Button>
                </Link>
            </div>

            {/* Descripción */}
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    {goal.description ? (
                        <p className="text-muted-foreground">
                            {goal.description}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Sin descripción
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Montos y progreso */}
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Montos y Progreso</CardTitle>
                    <CardDescription>Objetivo vs. ahorrado</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <div className="flex justify-between">
                        <span>Meta:</span>
                        <span className="font-medium">
                            {formatCurrency(goal.targetAmount)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Actual:</span>
                        <span className="font-medium">
                            {formatCurrency(goal.currentAmount)}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Progreso</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2.5 rounded-full">
                            <div
                                className={`h-2.5 rounded-full ${
                                    goal.isCompleted
                                        ? "bg-green-500"
                                        : "bg-primary"
                                }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    {!goal.isCompleted && (
                        <Link
                            href={`/dashboard/goals/${goal._id}/add-progress`}
                        >
                            <Button size="sm">+ Progreso</Button>
                        </Link>
                    )}
                </CardFooter>
            </Card>

            {/* Fechas */}
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Fechas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <strong>Inicio:</strong>{" "}
                        {new Date(goal.startDate).toLocaleDateString()}
                    </div>
                    <div>
                        <strong>Vence:</strong>{" "}
                        {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                </CardContent>
            </Card>

            {/* Categoría y Prioridad */}
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Categoría / Prioridad</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <strong>Categoría:</strong>{" "}
                        {goal.category.charAt(0).toUpperCase() +
                            goal.category.slice(1)}
                    </div>
                    <div>
                        <strong>Prioridad:</strong>{" "}
                        {goal.priority.charAt(0).toUpperCase() +
                            goal.priority.slice(1)}
                    </div>
                </CardContent>
            </Card>

            {/* Recordatorios */}
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Recordatorios</CardTitle>
                </CardHeader>
                <CardContent>
                    {goal.reminderFrequency === "none"
                        ? "Sin recordatorios"
                        : goal.reminderFrequency.charAt(0).toUpperCase() +
                          goal.reminderFrequency.slice(1)}
                </CardContent>
            </Card>

            {/* Plan sugerido (IA) */}
            {goal.suggestedPlan && (
                <Card className="h-full border-blue-400">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle>Plan de Ahorro Sugerido</CardTitle>
                            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                Creado con IA
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <strong>Aporte mensual:</strong>{" "}
                            {formatCurrency(goal.suggestedPlan.monthly)}
                        </div>
                        <div>
                            <strong>Aporte semanal:</strong>{" "}
                            {formatCurrency(goal.suggestedPlan.weekly)}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
