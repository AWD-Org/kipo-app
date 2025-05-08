import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un valor monetario
 * @param value - Valor a formatear
 * @param currency - Moneda (por defecto MXN)
 * @returns String formateado como moneda
 */
export function formatCurrency(value: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency
  }).format(value);
}

/**
 * Formatea una fecha
 * @param date - Fecha a formatear
 * @param options - Opciones de formato
 * @returns String con la fecha formateada
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-MX', options).format(dateObj);
}

/**
 * Calcula el porcentaje de progreso
 * @param current - Valor actual
 * @param target - Valor objetivo
 * @returns Porcentaje de progreso (0-100)
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.max(progress, 0), 100); // Limitar entre 0 y 100
}

/**
 * Genera un color basado en una cadena (útil para categorías)
 * @param str - Cadena para generar el color
 * @returns String con color hex en escala de grises
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convertir a escala de grises
  const grayValue = Math.abs(hash) % 200; // Valor entre 0 y 200
  const hexValue = (55 + grayValue).toString(16).padStart(2, '0'); // Asegurar valor entre 55 y 255
  const color = `#${hexValue}${hexValue}${hexValue}`;
  return color;
}

/**
 * Genera colores para gráficos basados en categorías
 * @param categories - Lista de categorías
 * @returns Objeto con categorías como claves y colores como valores
 */
export function generateCategoryColors(categories: string[]): Record<string, string> {
  const baseColors = [
    '#000000', // Negro
    '#333333', // Gris oscuro
    '#666666', // Gris medio
    '#999999', // Gris claro
    '#CCCCCC', // Muy claro
    '#444444', // Gris oscuro alternativo
    '#777777', // Gris medio alternativo
    '#AAAAAA', // Gris claro alternativo
  ];

  return categories.reduce((acc, category, index) => {
    // Usar colores base si hay suficientes, o generar desde la cadena
    acc[category] = index < baseColors.length 
      ? baseColors[index]
      : stringToColor(category);
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Trunca un texto para previsualizaciones
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima (por defecto 100)
 * @returns Texto truncado con elipsis si es necesario
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}