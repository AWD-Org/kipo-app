"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    User, 
    Shield, 
    Settings as SettingsIcon, 
    Eye, 
    EyeOff,
    CheckCircle,
    AlertCircle 
} from "lucide-react";
import Section from "../../../components/settings/Section";
import ShortcutTokens from "../../../components/settings/ShortcutTokens";

interface UserProfile {
    name: string;
    email: string;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsGoal: number;
    mainExpenseCategories: string[];
    referralSource: string;
    createdAt: string;
    isOnboarded: boolean;
}

export default function SettingsPage() {
    const { data: session, status } = useSession();
    
    // Estados para Perfil
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");

    // Estados para Seguridad
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    // Estados para Preferencias
    const [preferences, setPreferences] = useState({
        currency: "MXN",
        language: "es",
        notifications: true,
        darkMode: false,
        autoBackup: true
    });
    const [preferencesLoading, setPreferencesLoading] = useState(false);
    const [preferencesMessage, setPreferencesMessage] = useState("");

    // Cargar datos del usuario al montar
    useEffect(() => {
        if (session?.user) {
            loadUserProfile();
        }
    }, [session]);

    const loadUserProfile = async () => {
        try {
            setProfileLoading(true);
            const response = await fetch('/api/user/profile');
            const data = await response.json();
            
            if (data.success) {
                setProfile(data.data);
                setPreferences(prev => ({
                    ...prev,
                    currency: data.data.currency || "MXN",
                    language: data.data.language || "es"
                }));
            } else {
                setProfileMessage("Error al cargar perfil");
            }
        } catch (error) {
            setProfileMessage("Error de conexión");
        } finally {
            setProfileLoading(false);
        }
    };

    const updateProfile = async () => {
        if (!profile) return;
        
        try {
            setProfileLoading(true);
            setProfileMessage("");
            
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profile.name,
                    monthlyIncome: profile.monthlyIncome,
                    monthlyExpenses: profile.monthlyExpenses,
                    savingsGoal: profile.savingsGoal,
                    mainExpenseCategories: profile.mainExpenseCategories
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                setProfileMessage("✅ Perfil actualizado correctamente");
                setTimeout(() => setProfileMessage(""), 3000);
            } else {
                setProfileMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            setProfileMessage("❌ Error de conexión");
        } finally {
            setProfileLoading(false);
        }
    };

    const updatePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setPasswordMessage("❌ Todos los campos son obligatorios");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setPasswordMessage("❌ Las contraseñas nuevas no coinciden");
            return;
        }

        if (passwords.new.length < 6) {
            setPasswordMessage("❌ La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            setPasswordLoading(true);
            setPasswordMessage("");
            
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                setPasswordMessage("✅ Contraseña actualizada correctamente");
                setPasswords({ current: "", new: "", confirm: "" });
                setTimeout(() => setPasswordMessage(""), 3000);
            } else {
                setPasswordMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            setPasswordMessage("❌ Error de conexión");
        } finally {
            setPasswordLoading(false);
        }
    };

    const updatePreferences = async () => {
        try {
            setPreferencesLoading(true);
            setPreferencesMessage("");
            
            const response = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            const data = await response.json();
            
            if (data.success) {
                setPreferencesMessage("✅ Preferencias guardadas correctamente");
                setTimeout(() => setPreferencesMessage(""), 3000);
            } else {
                setPreferencesMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            setPreferencesMessage("❌ Error de conexión");
        } finally {
            setPreferencesLoading(false);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: preferences.currency
        }).format(amount);
    };

    if (status === "loading") {
        return <div className="text-center py-8">Cargando configuración...</div>;
    }

    if (!session) {
        return <div className="text-center py-8">Debes iniciar sesión para acceder a la configuración.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <SettingsIcon className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Configuración</h1>
            </div>

            {/* Perfil de Usuario */}
            <Section title="Perfil de Usuario">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información Personal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profileMessage && (
                            <div className={`text-sm p-2 rounded ${
                                profileMessage.includes('✅') 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                {profileMessage}
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Nombre completo
                                </label>
                                <Input 
                                    value={profile?.name || session.user?.name || ""} 
                                    onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input 
                                    value={profile?.email || session.user?.email || ""} 
                                    disabled 
                                    className="bg-gray-50"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    El email no se puede cambiar
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Ingresos mensuales
                                </label>
                                <Input 
                                    type="number"
                                    value={profile?.monthlyIncome || 0} 
                                    onChange={(e) => setProfile(prev => prev ? {...prev, monthlyIncome: Number(e.target.value)} : null)}
                                    placeholder="0"
                                />
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Gastos mensuales estimados
                                </label>
                                <Input 
                                    type="number"
                                    value={profile?.monthlyExpenses || 0} 
                                    onChange={(e) => setProfile(prev => prev ? {...prev, monthlyExpenses: Number(e.target.value)} : null)}
                                    placeholder="0"
                                />
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Meta de ahorro mensual
                                </label>
                                <Input 
                                    type="number"
                                    value={profile?.savingsGoal || 0} 
                                    onChange={(e) => setProfile(prev => prev ? {...prev, savingsGoal: Number(e.target.value)} : null)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Categorías principales de gastos
                            </label>
                            <Input 
                                value={profile?.mainExpenseCategories?.join(', ') || ""} 
                                onChange={(e) => setProfile(prev => prev ? {...prev, mainExpenseCategories: e.target.value.split(',').map(s => s.trim()).filter(s => s)} : null)}
                                placeholder="Comida, Transporte, Entretenimiento, ..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Separa las categorías con comas
                            </p>
                        </div>

                        {profile && (
                            <div className="flex items-center gap-4 pt-2">
                                <Badge variant={profile.isOnboarded ? "default" : "secondary"}>
                                    {profile.isOnboarded ? "✅ Configuración completa" : "⚠️ Configuración pendiente"}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    Miembro desde: {new Date(profile.createdAt).toLocaleDateString('es-MX')}
                                </span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={updateProfile}
                            disabled={profileLoading || !profile}
                            className="flex items-center gap-2"
                        >
                            {profileLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Guardar cambios
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </Section>

            {/* Seguridad */}
            <Section title="Seguridad">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Cambiar Contraseña
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {passwordMessage && (
                            <div className={`text-sm p-2 rounded ${
                                passwordMessage.includes('✅') 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                {passwordMessage}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-sm font-medium text-gray-700">
                                    Contraseña actual
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showPasswords.current ? "text" : "password"}
                                        value={passwords.current}
                                        onChange={(e) => setPasswords(prev => ({...prev, current: e.target.value}))}
                                        placeholder="Ingresa tu contraseña actual"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility('current')}
                                    >
                                        {showPasswords.current ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-sm font-medium text-gray-700">
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showPasswords.new ? "text" : "password"}
                                        value={passwords.new}
                                        onChange={(e) => setPasswords(prev => ({...prev, new: e.target.value}))}
                                        placeholder="Mínimo 6 caracteres"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility('new')}
                                    >
                                        {showPasswords.new ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-sm font-medium text-gray-700">
                                    Confirmar nueva contraseña
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showPasswords.confirm ? "text" : "password"}
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords(prev => ({...prev, confirm: e.target.value}))}
                                        placeholder="Repite la nueva contraseña"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                    >
                                        {showPasswords.confirm ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium">Consejos para una contraseña segura:</p>
                                    <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                                        <li>Usa al menos 8 caracteres</li>
                                        <li>Combina letras, números y símbolos</li>
                                        <li>Evita información personal</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={updatePassword}
                            disabled={passwordLoading || !passwords.current || !passwords.new || !passwords.confirm}
                            variant="default"
                            className="flex items-center gap-2"
                        >
                            {passwordLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-4 w-4" />
                                    Cambiar contraseña
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </Section>

            {/* iOS Shortcuts */}
            <Section title="iOS Shortcuts">
                <ShortcutTokens />
            </Section>

            {/* Preferencias */}
            <Section title="Preferencias">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SettingsIcon className="h-5 w-5" />
                            Configuración General
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {preferencesMessage && (
                            <div className={`text-sm p-2 rounded ${
                                preferencesMessage.includes('✅') 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                {preferencesMessage}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Moneda principal
                                </label>
                                <select 
                                    value={preferences.currency}
                                    onChange={(e) => setPreferences(prev => ({...prev, currency: e.target.value}))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="MXN">🇲🇽 Peso Mexicano (MXN)</option>
                                    <option value="USD">🇺🇸 Dólar Americano (USD)</option>
                                    <option value="EUR">🇪🇺 Euro (EUR)</option>
                                    <option value="GBP">🇬🇧 Libra Esterlina (GBP)</option>
                                    <option value="CAD">🇨🇦 Dólar Canadiense (CAD)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Idioma
                                </label>
                                <select 
                                    value={preferences.language}
                                    onChange={(e) => setPreferences(prev => ({...prev, language: e.target.value}))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="es">🇪🇸 Español</option>
                                    <option value="en">🇺🇸 English</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">
                                Opciones adicionales
                            </label>
                            
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications}
                                        onChange={(e) => setPreferences(prev => ({...prev, notifications: e.target.checked}))}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Recibir notificaciones por email</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.autoBackup}
                                        onChange={(e) => setPreferences(prev => ({...prev, autoBackup: e.target.checked}))}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Respaldo automático de datos</span>
                                </label>
                            </div>
                        </div>

                        {/* Resumen financiero */}
                        {profile && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-3">Resumen Financiero</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Ingresos</p>
                                        <p className="font-medium text-green-600">
                                            {formatCurrency(profile.monthlyIncome)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Gastos</p>
                                        <p className="font-medium text-red-600">
                                            {formatCurrency(profile.monthlyExpenses)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Meta de ahorro</p>
                                        <p className="font-medium text-blue-600">
                                            {formatCurrency(profile.savingsGoal)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={updatePreferences}
                            disabled={preferencesLoading}
                            variant="default"
                            className="flex items-center gap-2"
                        >
                            {preferencesLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Guardar preferencias
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </Section>
        </div>
    );
}
