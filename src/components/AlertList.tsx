'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { CheckCircle, AlertTriangle, Info, X, Bell } from 'lucide-react';

// Componente Badge
const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'outline'; 
  className?: string;
}) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-input"
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Tipos para las alertas
type AlertType = 'success' | 'warning' | 'info' | 'error';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

// Datos de ejemplo para alertas
const DUMMY_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Gasto inusual detectado',
    message: 'Hemos detectado un gasto de $2,500 en la categoría Entretenimiento, que es un 80% más alto que tu promedio mensual.',
    date: '2023-11-26',
    isRead: false,
    actionUrl: '/dashboard/transactions',
    actionText: 'Ver transacción'
  },
  {
    id: '2',
    type: 'info',
    title: 'Actualización de meta',
    message: 'Tu meta "Nuevo laptop" va por buen camino, has ahorrado 32% del objetivo. ¡Sigue así!',
    date: '2023-11-25',
    isRead: true,
    actionUrl: '/dashboard/goals/3',
    actionText: 'Ver meta'
  },
  {
    id: '3',
    type: 'success',
    title: 'Balance positivo',
    message: 'Tu balance este mes es positivo, tus ingresos superan tus gastos en $8,500. ¡Felicidades!',
    date: '2023-11-24',
    isRead: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Riesgo de sobregiro',
    message: 'Basado en tus gastos recientes, podrías quedarte sin fondos antes de fin de mes. Considera reducir gastos no esenciales.',
    date: '2023-11-23',
    isRead: false,
    actionUrl: '/dashboard/budget',
    actionText: 'Revisar presupuesto'
  },
  {
    id: '5',
    type: 'info',
    title: 'Recordatorio de pago',
    message: 'Tienes un pago programado de $1,800 para el servicio de internet en 3 días.',
    date: '2023-11-22',
    isRead: false
  },
  {
    id: '6',
    type: 'success',
    title: 'Meta completada',
    message: '¡Felicidades! Has completado tu meta "Fondo para vacaciones" de $15,000.',
    date: '2023-11-20',
    isRead: true,
    actionUrl: '/dashboard/goals/2',
    actionText: 'Ver meta'
  },
];

export default function AlertList() {
  const router = useRouter();
  const { data: session } = useSession();
  const [alerts, setAlerts] = useState<Alert[]>(DUMMY_ALERTS);
  const [filter, setFilter] = useState<AlertType | 'all'>('all');
  const [showRead, setShowRead] = useState<boolean>(true);

  // Filtrar alertas basado en los criterios seleccionados
  const filteredAlerts = alerts.filter(alert => {
    if (!showRead && alert.isRead) return false;
    if (filter !== 'all' && alert.type !== filter) return false;
    return true;
  });

  // Marcar una alerta como leída
  const markAsRead = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  // Marcar todas las alertas como leídas
  const markAllAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, isRead: true }))
    );
  };

  // Eliminar una alerta
  const deleteAlert = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.id !== id)
    );
  };

  // Contar alertas no leídas
  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  // Renderizar icono según el tipo de alerta
  const renderAlertIcon = (type: AlertType) => {
    switch(type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas y notificaciones</h1>
          <p className="text-muted-foreground">
            Mantente al día con información importante sobre tus finanzas.
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Todas
        </Button>
        <Button 
          variant={filter === 'info' ? 'default' : 'outline'}
          onClick={() => setFilter('info')}
          className="gap-2"
        >
          <Info className="h-4 w-4 text-blue-500" />
          Informativas
        </Button>
        <Button 
          variant={filter === 'success' ? 'default' : 'outline'}
          onClick={() => setFilter('success')}
          className="gap-2"
        >
          <CheckCircle className="h-4 w-4 text-green-500" />
          Éxitos
        </Button>
        <Button 
          variant={filter === 'warning' ? 'default' : 'outline'}
          onClick={() => setFilter('warning')}
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          Advertencias
        </Button>
        <Button 
          variant={filter === 'error' ? 'default' : 'outline'}
          onClick={() => setFilter('error')}
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Errores
        </Button>
        <div className="ml-auto flex items-center space-x-2">
          <label htmlFor="showRead" className="text-sm">
            Mostrar leídas
          </label>
          <input
            id="showRead"
            type="checkbox"
            checked={showRead}
            onChange={(e) => setShowRead(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      </div>

      {/* Lista de alertas */}
      {filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay alertas</h3>
            <p className="text-muted-foreground mt-1">
              {showRead 
                ? 'No tienes alertas que coincidan con los filtros seleccionados.'
                : 'No tienes alertas sin leer que coincidan con los filtros seleccionados.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <Card 
              key={alert.id} 
              className={`${!alert.isRead ? 'border-l-4 border-l-primary' : ''}`}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-start gap-2">
                  {renderAlertIcon(alert.type)}
                  <div>
                    <CardTitle>{alert.title}</CardTitle>
                    <CardDescription>
                      {new Date(alert.date).toLocaleDateString('es-MX', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!alert.isRead && (
                    <Badge variant="default" className="">
                      Nueva
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p>{alert.message}</p>
              </CardContent>
              {(alert.actionUrl || !alert.isRead) && (
                <CardFooter className="flex justify-between">
                  <div>
                    {!alert.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Marcar como leída
                      </Button>
                    )}
                  </div>
                  {alert.actionUrl && (
                    <Button 
                      size="sm"
                      onClick={() => router.push(alert.actionUrl!)}
                    >
                      {alert.actionText || 'Ver detalles'}
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
