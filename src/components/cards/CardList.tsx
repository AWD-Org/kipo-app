// src/components/cards/CardList.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCards } from "@/store/thunks/cardsThunks";
import { setFilter, setStatusFilter } from "@/store/slices/cardsSlice";
import { CardItem } from "./CardItem";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "../ui/card";

export function CardList() {
    const dispatch = useAppDispatch();
    const { items, isLoading, error, filter, statusFilter } = useAppSelector(
        (s) => s.cards
    );

    useEffect(() => {
        dispatch(fetchCards());
    }, [dispatch]);

    const filtered = items
        .filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()))
        .filter((c) =>
            statusFilter === "all" ? true : c.status === statusFilter
        );

    return (
        <div className="space-y-4">
            {/* Buscador + filtro de estatus */}
            <div className="flex gap-4 items-center">
                <Input
                    placeholder="Buscar por nombre..."
                    value={filter}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                />
                <select
                    className="border rounded p-2"
                    value={statusFilter}
                    onChange={(e) =>
                        dispatch(
                            setStatusFilter(
                                e.target.value as "all" | "pagada" | "sin pagar"
                            )
                        )
                    }
                >
                    <option value="all">Todas</option>
                    <option value="pagada">Pagadas</option>
                    <option value="sin pagar">Sin pagar</option>
                </select>
            </div>

            {/* Estado de carga */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card
                            key={i}
                            className="relative flex flex-col justify-between p-6 rounded-3xl overflow-hidden min-h-[220px]"
                        >
                            {/* mock logo */}
                            <Skeleton className="absolute top-4 right-4 h-10 w-10 rounded-full" />
                            {/* mock título */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/3 rounded" />
                                <Skeleton className="h-6 w-2/3 rounded" />
                            </div>
                            {/* mock datos */}
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-full rounded" />
                            </div>
                            {/* mock footer */}
                            <div className="mt-6 flex items-center justify-between">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-12 rounded" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    {/* Errores */}
                    {error && (
                        <p className="text-red-600 text-center">{error}</p>
                    )}

                    {/* Lista real */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
                        {filtered.map((c) => (
                            <CardItem key={c.id} card={c} />
                        ))}
                    </div>

                    {/* Sin resultados */}
                    {!error && filtered.length === 0 && (
                        <p className="text-center text-muted-foreground">
                            No se encontraron tarjetas.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
