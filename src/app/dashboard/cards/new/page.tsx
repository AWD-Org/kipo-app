// src/app/dashboard/cards/new/page.tsx
import { CardForm } from "@/components/cards/CardForm";
import { ReduxProvider } from "@/store";

export default function NewCardPage() {
    return (
        <ReduxProvider>
            <CardForm />
        </ReduxProvider>
    );
}
