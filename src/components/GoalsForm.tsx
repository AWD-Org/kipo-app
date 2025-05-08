// src/app/dashboard/new-goal/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { createGoal } from "@/app/actions/createGoal";
import { calculateProgress, formatCurrency } from "@/lib/utils";

const CATEGORIES = ["ahorro", "inversión", "deuda", "compra", "otro"];
const PRIORITIES = ["baja", "media", "alta"];
const REMINDERS: [string, string][] = [
    ["none", "Sin recordatorios"],
    ["daily", "Diario"],
    ["weekly", "Semanal"],
    ["monthly", "Mensual"],
];

export default function NewGoalPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [form, setForm] = useState({
        title: "",
        description: "",
        targetAmount: "",
        currentAmount: "",
        startDate: new Date().toISOString().slice(0, 10),
        targetDate: "",
        category: "ahorro",
        priority: "media",
        reminderFrequency: "none",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const onChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            setError("Debes iniciar sesión para crear una meta");
            return;
        }
        setError("");
        setLoading(true);

        const res = await createGoal(
            new FormData(e.currentTarget as HTMLFormElement)
        );
        setLoading(false);

        if (!res.success) {
            setError(res.error || "Error creando meta");
        } else {
            setSuccess(true);
            router.push("/dashboard/goals");
        }
    };

    const prog = calculateProgress(
        parseFloat(form.currentAmount) || 0,
        parseFloat(form.targetAmount) || 1
    );

    return (
        <Card className="max-w-lg mx-auto mt-12">
            <form onSubmit={onSubmit}>
                <CardHeader className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-1"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Button>
                    <CardTitle>Nueva meta</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Título
                        </label>
                        <Input
                            name="title"
                            value={form.title}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {/* Objetivo y Progreso */}
                    <div>
                        <CardDescription>Objetivo y progreso</CardDescription>
                        <div className="space-y-4 mt-2">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    $
                                </span>
                                <Input
                                    name="targetAmount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Monto objetivo"
                                    className="pl-8"
                                    value={form.targetAmount}
                                    onChange={onChange}
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
                                    step="0.01"
                                    min="0"
                                    placeholder="Monto actual"
                                    className="pl-8"
                                    value={form.currentAmount}
                                    onChange={onChange}
                                />
                            </div>
                            {form.targetAmount && (
                                <>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>Progreso</span>
                                        <span>{Math.round(prog)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary h-2.5 rounded-full">
                                        <div
                                            className="bg-primary h-2.5 rounded-full"
                                            style={{ width: `${prog}%` }}
                                        />
                                    </div>
                                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                        <span>
                                            {formatCurrency(
                                                parseFloat(
                                                    form.currentAmount
                                                ) || 0
                                            )}
                                        </span>
                                        <span>
                                            {formatCurrency(
                                                parseFloat(form.targetAmount) ||
                                                    0
                                            )}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Inicio
                            </label>
                            <Input
                                name="startDate"
                                type="date"
                                value={form.startDate}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Vence
                            </label>
                            <Input
                                name="targetDate"
                                type="date"
                                value={form.targetDate}
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Categoría & Prioridad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Categoría
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={onChange}
                                className="w-full border rounded p-2"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Prioridad
                            </label>
                            <select
                                name="priority"
                                value={form.priority}
                                onChange={onChange}
                                className="w-full border rounded p-2"
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p} value={p}>
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Recordatorios */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Recordatorios
                        </label>
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
                    </div>

                    {/* Mensajes */}
                    {error && <p className="text-destructive">{error}</p>}
                    {success && (
                        <p className="text-green-600">Meta creada con éxito.</p>
                    )}
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && (
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        )}
                        Guardar meta
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
