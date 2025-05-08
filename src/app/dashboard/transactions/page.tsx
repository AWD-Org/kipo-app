"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTransactions } from "@/store/thunks/transactionsThunks";
import { ReduxProvider } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types/transaction";

function TransactionsList() {
    const { status } = useSession({ required: true });
    const dispatch = useAppDispatch();
    const {
        items: transactions,
        isLoading,
        error,
    } = useAppSelector((s) => s.transactions);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"ingreso" | "gasto" | null>(
        null
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        if (status === "authenticated") {
            dispatch(fetchTransactions());
        }
    }, [dispatch, status]);

    const filtered = transactions
        .filter((tx) => {
            const matchesSearch =
                !searchTerm ||
                (tx.description || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tx.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = !filterType || tx.type === filterType;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            const ta = new Date(a.date).getTime();
            const tb = new Date(b.date).getTime();
            return sortOrder === "asc" ? ta - tb : tb - ta;
        });

    const renderTx = (tx: Transaction) => (
        <div
            key={tx.id}
            className="flex items-center justify-between p-4 border-b last:border-0"
        >
            <div className="flex items-start gap-3">
                <div
                    className={`w-2 h-10 rounded-full ${
                        tx.type === "ingreso" ? "bg-green-500" : "bg-red-500"
                    }`}
                />
                <div>
                    <p className="font-medium">{tx.category}</p>
                    <p className="text-sm text-muted-foreground">
                        {tx.description || "Sin descripción"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString("es-MX")}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p
                    className={`font-bold ${
                        tx.type === "ingreso"
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    {tx.type === "ingreso" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                </p>
                {tx.isRecurrent && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        Recurrente
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Transacciones</h1>
                    <p className="text-muted-foreground">
                        Administra tus ingresos y gastos
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/new-transaction">
                        <Button className="gap-1">
                            <Plus size={16} /> Nueva transacción
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => {
                            /* TODO: export handler */
                        }}
                    >
                        <Download size={16} /> Exportar
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por descripción o categoría..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filterType === null ? "default" : "outline"}
                        onClick={() => setFilterType(null)}
                    >
                        Todos
                    </Button>
                    <Button
                        variant={
                            filterType === "ingreso" ? "default" : "outline"
                        }
                        onClick={() => setFilterType("ingreso")}
                        className="text-green-500"
                    >
                        Ingresos
                    </Button>
                    <Button
                        variant={filterType === "gasto" ? "default" : "outline"}
                        onClick={() => setFilterType("gasto")}
                        className="text-red-500"
                    >
                        Gastos
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                        }
                        className="gap-1"
                    >
                        <ArrowUpDown size={16} />{" "}
                        {sortOrder === "asc" ? "Más antiguos" : "Más recientes"}
                    </Button>
                </div>
            </div>

            {/* Lista */}
            <Card>
                <CardHeader>
                    <CardTitle>Historial de transacciones</CardTitle>
                    <CardDescription>
                        {isLoading
                            ? "Cargando..."
                            : error
                            ? error
                            : `${filtered.length} transacciones encontradas`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 border-b last:border-0"
                            >
                                <div className="flex items-start gap-3">
                                    <Skeleton className="h-10 w-2 rounded" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24 rounded" />
                                        <Skeleton className="h-3 w-32 rounded" />
                                        <Skeleton className="h-3 w-12 rounded" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <Skeleton className="h-4 w-16 rounded" />
                                    <Skeleton className="h-4 w-20 rounded" />
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="p-8 text-center text-destructive">
                            {error}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No hay transacciones
                        </div>
                    ) : (
                        filtered.map(renderTx)
                    )}
                </CardContent>
                {/* Se ha eliminado el CardFooter para export */}
            </Card>
        </div>
    );
}

export default function TransactionsPage() {
    return (
        <ReduxProvider>
            <TransactionsList />
        </ReduxProvider>
    );
}
