// src/types/card.ts
export interface Card {
    id: string;
    name: string;
    brand: "visa" | "mastercard" | "amex" | "discover" | "other";
    kind: "debito" | "credito";
    cutoffDate: string; // ISO
    dueDate: string; // ISO
    minPayment: number;
    noInterestPayment: number;
    status: "pagada" | "sin pagar";
}
