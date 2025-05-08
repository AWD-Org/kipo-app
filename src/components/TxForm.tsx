"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, CalendarIcon, TagIcon } from "lucide-react";
import { createTransaction } from "@/app/actions/createTransaction";

// Categorías predefinidas
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [newTag, setNewTag] = useState("");

    const [formData, setFormData] = useState({
        type: "gasto",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        isRecurrent: false,
        recurrenceFrequency: "none",
        tags: [] as string[],
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag],
            }));
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (status !== "authenticated") {
            setError("Debes iniciar sesión para crear una transacción");
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError("El monto debe ser mayor a cero");
            return;
        }
        if (!formData.category) {
            setError("Debes seleccionar una categoría");
            return;
        }

        setIsLoading(true);
        try {
            // Preparar FormData para enviar
            const fd = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    val.forEach((v) => fd.append(key, v));
                } else if (typeof val === "boolean") {
                    fd.append(key, val ? "on" : "off");
                } else {
                    fd.append(key, String(val));
                }
            });

            const result = await createTransaction(fd);

            if (!result.success) {
                setError(result.error || "Error al crear la transacción");
            } else {
                setSuccess(true);
                if (
                    !confirm(
                        "Transacción creada con éxito. ¿Quieres agregar otra?"
                    )
                ) {
                    router.push("/dashboard");
                } else {
                    setFormData({
                        type: "gasto",
                        amount: "",
                        category: "",
                        description: "",
                        date: new Date().toISOString().split("T")[0],
                        isRecurrent: false,
                        recurrenceFrequency: "none",
                        tags: [],
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setError("Error al procesar la transacción");
        } finally {
            setIsLoading(false);
        }
    };

    const categories =
        formData.type === "ingreso" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <div className="max-w-xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        size="sm"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Button>
                    <h1 className="text-2xl font-bold">Nueva transacción</h1>
                </div>

                {/* Tipo */}
                <div className="flex gap-4">
                    {["ingreso", "gasto"].map((t) => (
                        <label
                            key={t}
                            className={`flex-1 text-center p-3 border rounded cursor-pointer ${
                                formData.type === t
                                    ? t === "ingreso"
                                        ? "bg-green-50 border-green-500"
                                        : "bg-red-50 border-red-500"
                                    : "hover:bg-muted/50"
                            }`}
                        >
                            <input
                                type="radio"
                                name="type"
                                value={t}
                                checked={formData.type === t}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            {t === "ingreso" ? "Ingreso" : "Gasto"}
                        </label>
                    ))}
                </div>

                {/* Monto */}
                <div>
                    <label htmlFor="amount">Monto</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            $
                        </span>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={handleChange}
                            className="pl-8"
                            required
                        />
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <label htmlFor="category">Categoría</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        rows={3}
                    />
                </div>

                {/* Fecha */}
                <div className="relative">
                    <label htmlFor="date">Fecha</label>

                    <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Recurrencia */}
                <div>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="isRecurrent"
                            checked={formData.isRecurrent}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Transacción recurrente
                    </label>
                    {formData.isRecurrent && (
                        <select
                            name="recurrenceFrequency"
                            value={formData.recurrenceFrequency}
                            onChange={handleChange}
                            className="w-full border rounded p-2 mt-2"
                        >
                            <option value="none">Selecciona frecuencia</option>
                            <option value="daily">Diaria</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensual</option>
                            <option value="yearly">Anual</option>
                        </select>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label>Etiquetas</label>
                    <div className="flex gap-2">
                        <TagIcon className="mt-2" />
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
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center bg-secondary px-3 py-1 rounded-full"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-2"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Errores y éxito */}
                {error && <div className="text-destructive">{error}</div>}
                {success && (
                    <div className="text-green-600">
                        Transacción creada con éxito.
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />{" "}
                                Guardando...
                            </>
                        ) : (
                            "Guardar"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
