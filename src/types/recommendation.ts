export type Recommendation = {
    _id?: string;
    userId: string;
    transactionId: string;
    type:
        | "ALERTA_CATEGORIA"
        | "ALERTA_GLOBAL"
        | "CONSEJO_HABITO"
        | "META_NUEVA";
    title: string;
    message: string;
    relatedCategory?: string;
    createdAt?: string;
};
