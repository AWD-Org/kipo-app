// src/app/dashboard/new-transaction/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, TagIcon } from "lucide-react";

const EXPENSE_CATEGORIES = [
    "Vivienda",
    "Alimentación",
    "Transporte",
    "Servicios",
    "Entretenimiento",
    "Salud",
    "Educación",
    "Ropa",
    "Personal",
    "Mascotas",
    "Deudas",
    "Otros",
];
const INCOME_CATEGORIES = [
    "Salario",
    "Freelance",
    "Inversiones",
    "Venta",
    "Regalo",
    "Reembolso",
    "Otros",
];

export default function NewTransactionPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [form, setForm] = useState({
        type: "gasto",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        isRecurrent: false,
        recurrenceFrequency: "none",
        tags: [] as string[],
    });
    const [newTag, setNewTag] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const categories =
        form.type === "ingreso" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const onChange = (e: React.ChangeEvent<any>) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addTag = () => {
        if (newTag && !form.tags.includes(newTag)) {
            setForm((f) => ({ ...f, tags: [...f.tags, newTag] }));
            setNewTag("");
        }
    };

    const removeTag = (tag: string) =>
        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (status !== "authenticated") {
            setError("Debes iniciar sesión para crear una transacción");
            return;
        }
        if (!form.amount || parseFloat(form.amount) <= 0) {
            setError("El monto debe ser mayor a cero");
            return;
        }
        if (!form.category) {
            setError("Debes seleccionar una categoría");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    ...form,
                    amount: parseFloat(form.amount),
                }),
            });

            const body = await res.json();
            if (!res.ok) {
                setError(body.error || "Error al crear la transacción");
            } else {
                // Procesar las recomendaciones si existen
                if (
                    body.data?.recommendations &&
                    body.data.recommendations.length > 0
                ) {
                    // Opción 1: Almacenar las recomendaciones en el estado global (Redux)
                    // Si estás usando Redux, importa el dispatch y utilizalo:
                    // import { useDispatch } from 'react-redux';
                    // const dispatch = useDispatch();
                    // dispatch(setRecommendations(body.data.recommendations));

                    // O usar localStorage para mantenerlas temporalmente
                    localStorage.setItem(
                        "latestRecommendations",
                        JSON.stringify(body.data.recommendations)
                    );
                    router.push(
                        `/dashboard/transactions?showRecs=true&txId=${body.data.transaction._id}`
                    );
                } else {
                    // Si no hay recomendaciones, simplemente redirige
                    router.push("/dashboard/transactions");
                }
            }
        } catch (err) {
            console.error(err);
            setError("Error de red al crear la transacción");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto mt-8">
            <form onSubmit={onSubmit} className="space-y-6">
                <CardHeader className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-1"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Button>
                    <CardTitle>Nueva transacción</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Tipo */}
                    <div className="flex gap-4">
                        {["ingreso", "gasto"].map((t) => (
                            <label
                                key={t}
                                className={`
                  flex-1 text-center p-3 rounded cursor-pointer border
                  ${
                      form.type === t
                          ? t === "ingreso"
                              ? "bg-green-50 border-green-500"
                              : "bg-red-50 border-red-500"
                          : "hover:bg-muted/50"
                  }
                `}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value={t}
                                    checked={form.type === t}
                                    onChange={onChange}
                                    className="sr-only"
                                />
                                {t === "ingreso" ? "Ingreso" : "Gasto"}
                            </label>
                        ))}
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Monto
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                $
                            </span>
                            <Input
                                name="amount"
                                type="number"
                                step="0.01"
                                value={form.amount}
                                onChange={onChange}
                                className="pl-8"
                                required
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Categoría
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={onChange}
                            className="w-full border rounded p-2"
                            required
                        >
                            <option value="">Selecciona categoría</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
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
                            rows={3}
                        />
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Fecha
                        </label>
                        <Input
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {/* Recurrencia */}
                    <div>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isRecurrent"
                                checked={form.isRecurrent}
                                onChange={onChange}
                                className="h-4 w-4 rounded border"
                            />
                            Transacción recurrente
                        </label>
                        {form.isRecurrent && (
                            <select
                                name="recurrenceFrequency"
                                value={form.recurrenceFrequency}
                                onChange={onChange}
                                className="w-full border rounded p-2 mt-2"
                            >
                                <option value="none">
                                    Selecciona frecuencia
                                </option>
                                <option value="daily">Diaria</option>
                                <option value="weekly">Semanal</option>
                                <option value="monthly">Mensual</option>
                                <option value="yearly">Anual</option>
                            </select>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="block mb-1 text-sm font-medium">
                            Etiquetas
                        </label>
                        <div className="flex gap-2">
                            <TagIcon className="mt-2 text-muted-foreground" />
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Nueva etiqueta"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addTag}
                                disabled={!newTag}
                            >
                                Añadir
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {form.tags.map((t) => (
                                <span
                                    key={t}
                                    className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm"
                                >
                                    {t}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(t)}
                                        className="ml-1 text-lg leading-none"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {error && <div className="text-destructive">{error}</div>}
                </CardContent>

                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading && (
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        )}
                        Guardar
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
