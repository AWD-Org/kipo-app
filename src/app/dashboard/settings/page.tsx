"use client";

import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "../../../components/settings/Section";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Configuración</h1>

            {/* Perfil */}
            <Section title="Perfil de Usuario">
                <Card>
                    <CardContent className="space-y-4">
                        <Input placeholder="Salomón Pérez" />
                        <Input placeholder="user@ejemplo.com" disabled />
                    </CardContent>
                </Card>
            </Section>

            {/* Seguridad */}
            <Section title="Seguridad">
                <Card>
                    <CardContent className="space-y-4">
                        <Input type="password" placeholder="••••••••" />
                        <Input type="password" placeholder="••••••••" />
                    </CardContent>
                    <CardFooter>
                        <Button variant="default">Guardar cambios</Button>
                    </CardFooter>
                </Card>
            </Section>

            {/* Preferencias */}
            <Section title="Preferencias">
                <Card>
                    <CardContent className="space-y-4">
                        <Input placeholder="USD" />
                    </CardContent>
                    <CardFooter>
                        <Button variant="default">Guardar cambios</Button>
                    </CardFooter>
                </Card>
            </Section>
        </div>
    );
}
