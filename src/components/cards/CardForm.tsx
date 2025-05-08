// src/components/cards/CardForm.tsx
"use client";

import { useState } from "react";
import { Card as TCard } from "@/types/card";
import { addCard, updateCard } from "@/store/thunks/cardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

interface CardFormProps {
    initial?: Partial<TCard>;
    isEdit?: boolean;
}

export function CardForm({ initial = {}, isEdit = false }: CardFormProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [form, setForm] = useState({
        name: initial.name || "",
        brand: (initial.brand || "visa") as TCard["brand"],
        kind: (initial.kind || "credito") as TCard["kind"],
        cutoffDate: initial.cutoffDate?.slice(0, 10) || "",
        dueDate: initial.dueDate?.slice(0, 10) || "",
        minPayment: initial.minPayment ?? 0,
        noInterestPayment: initial.noInterestPayment ?? 0,
        status: (initial.status || "sin pagar") as TCard["status"],
    });
    const [loading, setLoading] = useState(false);

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]: name.includes("Payment") ? Number(value) : value,
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && initial.id) {
                await dispatch(
                    updateCard({ id: initial.id, ...form })
                ).unwrap();
            } else {
                await dispatch(addCard(form as Omit<TCard, "id">)).unwrap();
            }
            router.push("/dashboard/cards");
        } catch {
            // manejar error si se desea
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto mt-8">
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
                    <CardTitle>
                        {isEdit ? "Editar tarjeta" : "Agregar tarjeta"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Nombre
                        </label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Mi tarjeta Visa"
                            required
                        />
                    </div>

                    {/* Marca y Tipo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Marca
                            </label>
                            <select
                                name="brand"
                                value={form.brand}
                                onChange={onChange}
                                className="w-full border rounded p-2"
                            >
                                {[
                                    "visa",
                                    "mastercard",
                                    "amex",
                                    "discover",
                                    "other",
                                ].map((b) => (
                                    <option key={b} value={b}>
                                        {b.charAt(0).toUpperCase() + b.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Tipo
                            </label>
                            <select
                                name="kind"
                                value={form.kind}
                                onChange={onChange}
                                className="w-full border rounded p-2"
                            >
                                <option value="credito">Crédito</option>
                                <option value="debito">Débito</option>
                            </select>
                        </div>
                    </div>

                    {/* Fecha de corte y Fecha de pago */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Fecha corte
                            </label>
                            <Input
                                type="date"
                                name="cutoffDate"
                                value={form.cutoffDate}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Fecha pago
                            </label>
                            <Input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Pagos */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Pago mínimo
                            </label>
                            <Input
                                type="number"
                                name="minPayment"
                                step="0.01"
                                value={form.minPayment}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Pago sin interés
                            </label>
                            <Input
                                type="number"
                                name="noInterestPayment"
                                step="0.01"
                                value={form.noInterestPayment}
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Estatus */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Estatus
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={onChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="sin pagar">Sin pagar</option>
                            <option value="pagada">Pagada</option>
                        </select>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading && (
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        )}
                        {isEdit ? "Actualizar tarjeta" : "Agregar tarjeta"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
