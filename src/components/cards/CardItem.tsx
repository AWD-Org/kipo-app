// src/components/cards/CardItem.tsx
"use client";

import Image from "next/image";
import { Card as TCard } from "@/types/card";
import { toggleCardStatus, deleteCard } from "@/store/thunks/cardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Calendar,
    Clock,
    DollarSign,
    Edit2,
    Trash2,
    Loader2,
} from "lucide-react";
import visaLogo from "../../assets/icons/cards/visa.png";
import mastercardLogo from "../../assets/icons/cards/mastercard.png";
import amexLogo from "../../assets/icons/cards/amex.png";
import discoverLogo from "../../assets/icons/cards/discover.png";
import { useState } from "react";

// Map card.brand to the corresponding PNG filename
const brandLogos: Record<string, string> = {
    visa: visaLogo.src,
    mastercard: mastercardLogo.src,
    amex: amexLogo.src,
    discover: discoverLogo.src,
    other: "", // fallback to lucide-react icon if se desea
};

export function CardItem({ card }: { card: TCard }) {
    const dispatch = useAppDispatch();
    const [loadingToggle, setLoadingToggle] = useState(false);

    const logoSrc = brandLogos[card.brand] || brandLogos.other;

    const handleToggle = async (checked: boolean) => {
        setLoadingToggle(true);
        try {
            await dispatch(
                toggleCardStatus({
                    id: card.id,
                    status: checked ? "pagada" : "sin pagar",
                })
            ).unwrap();
        } catch (err) {
            // aquí podrías mostrar un toast de error, etc.
            console.error("Error toggling card status:", err);
        } finally {
            setLoadingToggle(false);
        }
    };

    return (
        <div
            className={`
        relative flex flex-col justify-between p-6 rounded-3xl
        bg-primary text-gray-100 shadow-lg overflow-hidden
        min-h-[220px]
      `}
        >
            {/* Logo de marca grande en semitransparente */}
            <div className="absolute top-4 right-4 w-12 h-12">
                {logoSrc ? (
                    <Image
                        src={logoSrc}
                        alt={`${card.brand} logo`}
                        width={48}
                        height={48}
                        className="object-contain opacity-20"
                    />
                ) : null}
            </div>

            {/* Tipo y nombre */}
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                    {card.kind}
                </p>
                <h2 className="font-mono text-xl text-white mt-1">
                    {card.name}
                </h2>
            </div>

            {/* Fechas y pagos */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                        Corte: {card.cutoffDate.slice(8, 10)}.
                        {card.cutoffDate.slice(5, 7)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                        Vence: {card.dueDate.slice(8, 10)}.
                        {card.dueDate.slice(5, 7)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>Min: {card.minPayment.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>NoInt: {card.noInterestPayment.toFixed(2)}</span>
                </div>
            </div>

            {/* Footer: switch y acciones */}
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {loadingToggle ? (
                        <Loader2 className="animate-spin h-6 w-6 text-gray-100" />
                    ) : (
                        <Switch
                            checked={card.status === "pagada"}
                            onChange={(e) => handleToggle(e.target.checked)}
                        />
                    )}
                    <span className="text-sm text-gray-100">
                        {card.status === "pagada" ? "Pagada" : "Sin pagar"}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/cards/${card.id}/edit`}>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-100"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-100"
                        onClick={() => dispatch(deleteCard(card.id))}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
