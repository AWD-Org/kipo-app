'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTransactions } from '@/store/thunks/transactionsThunks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, Filter, Download, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { ReduxProvider } from '@/store';

// Componente principal de la lista de transacciones
function TransactionsList() {
  const dispatch = useAppDispatch();
  const { items: transactions, isLoading, error } = useAppSelector(state => state.transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Cargar las transacciones al montar el componente
  useEffect(() => {
    // Simular ID de usuario para la demo
    dispatch(fetchTransactions('demo-user-id'));
  }, [dispatch]);

  // Filtrar y ordenar transacciones
  const filteredTransactions = transactions
    .filter(tx => {
      // Filtro por término de búsqueda
      const matchesSearch = !searchTerm || 
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por tipo (ingreso/gasto)
      const matchesType = !filterType || tx.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Ordenar por fecha
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Renderizar cada transacción
  const renderTransaction = (tx: any) => (
    <div key={tx.id} className="flex items-center justify-between p-4 border-b last:border-0">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-10 rounded-full ${tx.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div>
          <p className="font-medium">{tx.category}</p>
          <p className="text-sm text-muted-foreground">{tx.description || 'Sin descripción'}</p>
          <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('es-MX')}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className={`font-bold ${tx.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
          {tx.type === 'ingreso' ? '+' : '-'}{formatCurrency(tx.amount)}
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
    <div className="kipo-dashboard-layout">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transacciones</h1>
          <p className="text-muted-foreground">
            Administra tus ingresos y gastos
          </p>
        </div>
        <Link href="/dashboard/new-transaction">
          <Button className="gap-1">
            <Plus size={16} /> Nueva transacción
          </Button>
        </Link>
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
            variant={filterType === null ? 'default' : 'outline'}
            onClick={() => setFilterType(null)}
          >
            Todos
          </Button>
          <Button
            variant={filterType === 'ingreso' ? 'default' : 'outline'}
            onClick={() => setFilterType('ingreso')}
            className="text-green-500"
          >
            Ingresos
          </Button>
          <Button
            variant={filterType === 'gasto' ? 'default' : 'outline'}
            onClick={() => setFilterType('gasto')}
            className="text-red-500"
          >
            Gastos
          </Button>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="gap-1"
          >
            <ArrowUpDown size={16} />
            {sortOrder === 'asc' ? 'Más antiguos' : 'Más recientes'}
          </Button>
        </div>
      </div>

      {/* Lista de transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de transacciones</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transacciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              {error}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron transacciones con los filtros actuales.
            </div>
          ) : (
            <div>
              {filteredTransactions.map(renderTransaction)}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" className="gap-1">
            <Filter size={16} />
            Más filtros
          </Button>
          <Button variant="outline" className="gap-1">
            <Download size={16} />
            Exportar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Página con proveedor de Redux
export default function TransactionsPage() {
  return (
    <ReduxProvider>
      <TransactionsList />
    </ReduxProvider>
  );
}
