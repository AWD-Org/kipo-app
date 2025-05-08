// src/app/dashboard/cards/[id]/edit/page.tsx
import { CardForm } from "@/components/cards/CardForm";
import connectDB from "@/lib/mongodb";
import CardModel from "../../../../../../models/Card";
import { ReduxProvider } from "@/store";

interface Props {
    params: { id: string };
}

export default async function EditCardPage({ params }: Props) {
    await connectDB();

    // 1) Sin .lean() para que TS infiera el Document con `status`
    const cardDoc = await CardModel.findById(params.id);

    // 2) Si no existe, mostramos mensaje
    if (!cardDoc) {
        return <p>Tarjeta no encontrada</p>;
    }

    // 3) Mapeamos fechas a ISO strings y _id a id
    const card = {
        id: cardDoc._id.toString(),
        name: cardDoc.name,
        brand: cardDoc.brand,
        kind: cardDoc.kind,
        cutoffDate: cardDoc.cutoffDate.toISOString(),
        dueDate: cardDoc.dueDate.toISOString(),
        minPayment: cardDoc.minPayment,
        noInterestPayment: cardDoc.noInterestPayment,
        status: cardDoc.status, // ahora sí existe
    };

    return (
        <ReduxProvider>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Editar tarjeta</h1>
                {/* @ts-ignore */}
                <CardForm initial={card} isEdit />
            </div>
        </ReduxProvider>
    );
}
