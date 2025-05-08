// src/app/dashboard/goals/[id]/add-progress/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateGoalProgress } from "@/store/thunks/goalsThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ReduxProvider } from "@/store";

function AddProgressForm() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const dispatch = useAppDispatch();
    const goal = useAppSelector((state) =>
        state.goals.items.find((g) => g.id === id)
    );

    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!goal) {
        return <p className="p-4 text-center">Meta no encontrada.</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = parseFloat(amount);
        if (isNaN(parsed) || parsed <= 0) {
            setError("Ingresa un monto válido");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            await dispatch(
                updateGoalProgress({ id: id!, amount: parsed })
            ).unwrap();
            router.push(`/dashboard/goals/${id}`);
        } catch (err: any) {
            setError(err || "Error al actualizar progreso");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto py-12 space-y-6"
        >
            <h1 className="text-2xl font-bold">Agregar progreso</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Actual: <strong>{goal.currentAmount}</strong>
                    </p>
                    <p>
                        Objetivo: <strong>{goal.targetAmount}</strong>
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Cantidad a agregar
                </label>
                <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Guardando...
                        </>
                    ) : (
                        "Guardar"
                    )}
                </Button>
            </div>
        </form>
    );
}

export default function AddProgressPage() {
    return (
        <ReduxProvider>
            <AddProgressForm />
        </ReduxProvider>
    );
}
