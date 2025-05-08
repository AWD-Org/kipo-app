// src/app/dashboard/new-goal/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, CalendarIcon } from "lucide-react";
import { createGoal } from "@/app/actions/createGoal";
import { calculateProgress, formatCurrency } from "@/lib/utils";

const CATEGORIES = ["ahorro", "inversión", "deuda", "compra", "otro"] as const;
const PRIORITIES = ["baja", "media", "alta"] as const;
const REMINDERS = [
    ["none", "Sin recordatorios"],
    ["daily", "Diario"],
    ["weekly", "Semanal"],
    ["monthly", "Mensual"],
] as const;

export default function NewGoalPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [form, setForm] = useState({
        title: "",
        description: "",
        targetAmount: "",
        currentAmount: "0",
        startDate: new Date().toISOString().substr(0, 10),
        targetDate: "",
        category: "ahorro",
        priority: "media",
        reminderFrequency: "none",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const onChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session?.user?.id) {
            setError("Debes iniciar sesión");
            return;
        }
        setLoading(true);
        setError("");
        const res = await createGoal(new FormData(e.currentTarget));
        setLoading(false);

        if (!res.success) {
            setError(res.error || "Error creando meta");
            return;
        }
        // Redirigir al listado de metas:
        router.push("/dashboard/goals");
    };

    const prog = calculateProgress(
        parseFloat(form.currentAmount) || 0,
        parseFloat(form.targetAmount) || 1
    );

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-md mx-auto py-12">
            <header className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    size="sm"
                    className="gap-1"
                >
                    <ArrowLeft size={16} /> Volver
                </Button>
                <h1 className="text-2xl font-bold">Nueva meta</h1>
            </header>

            {/* Título */}
            <Card>
                <CardHeader>
                    <CardTitle>Título</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        required
                    />
                </CardContent>
            </Card>

            {/* Descripción */}
            <Card>
                <CardHeader>
                    <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        className="w-full rounded border p-2"
                    />
                </CardContent>
            </Card>

            {/* Montos */}
            <Card>
                <CardHeader>
                    <CardTitle>Montos</CardTitle>
                    <CardDescription>Objetivo y progreso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            $
                        </span>
                        <Input
                            name="targetAmount"
                            type="number"
                            value={form.targetAmount}
                            onChange={onChange}
                            placeholder="Objetivo"
                            className="pl-8"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            $
                        </span>
                        <Input
                            name="currentAmount"
                            type="number"
                            value={form.currentAmount}
                            onChange={onChange}
                            placeholder="Actual"
                            className="pl-8"
                            step="0.01"
                            min="0"
                        />
                    </div>

                    {!!form.targetAmount && (
                        <div>
                            <div className="flex justify-between text-sm">
                                <span>Progreso</span>
                                <span>{Math.round(prog)}%</span>
                            </div>
                            <div className="w-full bg-secondary h-2.5 rounded">
                                <div
                                    className="bg-primary h-2.5 rounded"
                                    style={{ width: `${prog}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                    {formatCurrency(
                                        parseFloat(form.currentAmount) || 0
                                    )}
                                </span>
                                <span>
                                    {formatCurrency(
                                        parseFloat(form.targetAmount) || 0
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Inicio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                name="startDate"
                                type="date"
                                value={form.startDate}
                                onChange={onChange}
                                className="pl-10"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Vence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                name="targetDate"
                                type="date"
                                value={form.targetDate}
                                onChange={onChange}
                                className="pl-10"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Categoría y prioridad */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            name="category"
                            value={form.category}
                            onChange={onChange}
                            className="w-full border rounded p-2"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Prioridad</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={onChange}
                            className="w-full border rounded p-2"
                        >
                            {PRIORITIES.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>
            </div>

            {/* Recordatorios */}
            <Card>
                <CardHeader>
                    <CardTitle>Recordatorios</CardTitle>
                </CardHeader>
                <CardContent>
                    <select
                        name="reminderFrequency"
                        value={form.reminderFrequency}
                        onChange={onChange}
                        className="w-full border rounded p-2"
                    >
                        {REMINDERS.map(([v, l]) => (
                            <option key={v} value={v}>
                                {l}
                            </option>
                        ))}
                    </select>
                </CardContent>
            </Card>

            {error && <div className="text-red-600">{error}</div>}

            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar meta"
                    )}
                </Button>
            </CardFooter>
        </form>
    );
}
