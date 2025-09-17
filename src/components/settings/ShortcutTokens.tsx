"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Smartphone, Trash2, Plus } from "lucide-react";

interface ApiKey {
    keyId: string;
    name: string;
    createdAt: string;
    lastUsedAt?: string;
}

interface TokenResponse {
    token: string;
    keyId: string;
    name: string;
    createdAt: string;
    instructions: {
        usage: string;
        endpoint: string;
        headers: {
            "Content-Type": string;
            Authorization: string;
        };
    };
}

export default function ShortcutTokens() {
    const [tokens, setTokens] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newTokenName, setNewTokenName] = useState("");
    const [showNewToken, setShowNewToken] = useState(false);
    const [newTokenData, setNewTokenData] = useState<TokenResponse | null>(null);
    const [copied, setCopied] = useState(false);

    // Cargar tokens existentes
    useEffect(() => {
        loadTokens();
    }, []);

    const loadTokens = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/shortcut-token");
            const data = await response.json();

            if (data.success) {
                setTokens(data.data.activeTokens);
            } else {
                setError(data.error || "Error al cargar tokens");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const createToken = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/shortcut-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newTokenName || "iOS Shortcut Token",
                }),
            });

            const data = await response.json();

            if (data.success) {
                setNewTokenData(data.data);
                setShowNewToken(true);
                setNewTokenName("");
                loadTokens(); // Recargar lista
            } else {
                setError(data.error || "Error al crear token");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const revokeToken = async (keyId: string) => {
        if (
            !confirm(
                "¿Estás seguro de revocar este token? Esta acción no se puede deshacer."
            )
        ) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/shortcut-token", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ keyId }),
            });

            const data = await response.json();

            if (data.success) {
                loadTokens(); // Recargar lista
            } else {
                setError(data.error || "Error al revocar token");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error al copiar:", err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Tokens para iOS Shortcuts
                </CardTitle>
                <CardDescription>
                    Crea tokens para usar con Atajos de iOS y registrar gastos
                    sin abrir la app.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Crear nuevo token */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Nombre del token (opcional)"
                        value={newTokenName}
                        onChange={(e) => setNewTokenName(e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        onClick={createToken}
                        disabled={loading || tokens.length >= 5}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Crear Token
                    </Button>
                </div>

                {tokens.length >= 5 && (
                    <p className="text-amber-600 text-sm">
                        Límite alcanzado (5 tokens máximo). Revoca alguno para
                        crear uno nuevo.
                    </p>
                )}

                {/* Lista de tokens */}
                {loading ? (
                    <div className="text-center py-4">Cargando...</div>
                ) : (
                    <div className="space-y-2">
                        {tokens.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No tienes tokens creados
                            </p>
                        ) : (
                            tokens.map((token) => (
                                <div
                                    key={token.keyId}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {token.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Creado: {formatDate(token.createdAt)}
                                        </p>
                                        {token.lastUsedAt && (
                                            <p className="text-sm text-gray-500">
                                                Último uso:{" "}
                                                {formatDate(token.lastUsedAt)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">Activo</Badge>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                revokeToken(token.keyId)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Dialog para mostrar nuevo token */}
                <Dialog
                    open={showNewToken}
                    onOpenChange={(open) => {
                        setShowNewToken(open);
                        if (!open) {
                            setNewTokenData(null);
                        }
                    }}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>✅ Token Creado Exitosamente</DialogTitle>
                            <DialogDescription>
                                <strong className="text-red-600">
                                    ⚠️ Guarda este token ahora - no podrás volver
                                    a verlo
                                </strong>
                            </DialogDescription>
                        </DialogHeader>

                        {newTokenData && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">
                                        Tu Token:
                                    </label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            value={newTokenData.token}
                                            readOnly
                                            className="font-mono text-xs"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(
                                                    newTokenData.token
                                                )
                                            }
                                        >
                                            <Copy className="h-4 w-4" />
                                            {copied ? "¡Copiado!" : "Copiar"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <h4 className="font-medium">
                                        Para configurar en iOS Shortcuts:
                                    </h4>
                                    <ol className="text-sm space-y-1 ml-4 list-decimal">
                                        <li>Abre la app "Atajos" en tu iPhone</li>
                                        <li>Crea un nuevo atajo</li>
                                        <li>
                                            Agrega la acción "Obtener contenidos
                                            de URL"
                                        </li>
                                        <li>
                                            URL:{" "}
                                            <code className="bg-white px-1 rounded">
                                                {window.location.origin}
                                                /api/entries
                                            </code>
                                        </li>
                                        <li>Método: POST</li>
                                        <li>
                                            Headers:
                                            <ul className="ml-4 mt-1">
                                                <li>
                                                    <code>Content-Type: application/json</code>
                                                </li>
                                                <li>
                                                    <code>
                                                        Authorization: Bearer {newTokenData.token}
                                                    </code>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            Body JSON: 
                                            <pre className="bg-white p-2 mt-1 rounded text-xs overflow-x-auto">
{`{
  "type": "expense",
  "amount": 25.50,
  "category": "Comida",
  "note": "Almuerzo"
}`}
                                            </pre>
                                        </li>
                                    </ol>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() =>
                                            copyToClipboard(
                                                `${window.location.origin}/api/entries`
                                            )
                                        }
                                        variant="outline"
                                        size="sm"
                                    >
                                        Copiar URL del endpoint
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            copyToClipboard(
                                                `Bearer ${newTokenData.token}`
                                            )
                                        }
                                        variant="outline"
                                        size="sm"
                                    >
                                        Copiar Authorization header
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
