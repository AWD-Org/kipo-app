// src/app/dashboard/cards/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardList } from "@/components/cards/CardList";
import { ReduxProvider } from "@/store";

export default function CardsPage() {
    return (
        <ReduxProvider>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Mis Tarjetas</h1>
                    <Link href="/dashboard/cards/new">
                        <Button>+ Agregar tarjeta</Button>
                    </Link>
                </div>
                <CardList />
            </div>
        </ReduxProvider>
    );
}
