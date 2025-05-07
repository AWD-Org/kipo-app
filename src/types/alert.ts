/**
 * Tipos para las alertas y notificaciones
 */

// Tipos de alertas
export type AlertType = 'success' | 'warning' | 'info' | 'error';

// Interfaz para las alertas
export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}
