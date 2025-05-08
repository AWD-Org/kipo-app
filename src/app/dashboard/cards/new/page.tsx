// src/app/dashboard/cards/new/page.tsx
import { CardForm } from "@/components/cards/CardForm";
import { ReduxProvider } from "@/store";

export default function NewCardPage() {
    return (
        <ReduxProvider>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Agregar tarjeta</h1>
                <CardForm />
            </div>
        </ReduxProvider>
    );
}
