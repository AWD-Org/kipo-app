// src/app/dashboard/DashboardShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    CreditCard,
    Target,
    BellRing,
    Settings,
    LogOut,
    PlusCircle,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";

export default function DashboardShell({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            name: "Transacciones",
            href: "/dashboard/transactions",
            icon: <CreditCard className="h-5 w-5" />,
        },
        {
            name: "Metas",
            href: "/dashboard/goals",
            icon: <Target className="h-5 w-5" />,
        },
        {
            name: "Alertas",
            href: "/dashboard/alerts",
            icon: <BellRing className="h-5 w-5" />,
        },
        {
            name: "Configuración",
            href: "/dashboard/settings",
            icon: <Settings className="h-5 w-5" />,
        },
    ];

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar escritorio */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-2xl kipo-gradient">
                            Kipo
                        </span>
                    </Link>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map(({ name, href, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                                pathname === href
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                            {icon}
                            {name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t flex flex-col gap-2">
                    
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 mt-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                    </Button>
                </div>
            </aside>

            {/* Sidebar móvil */}
            <div
                className={`fixed inset-0 z-40 md:hidden ${
                    sidebarOpen ? "block" : "hidden"
                }`}
            >
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-lg flex flex-col">
                    <div className="p-6 flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-bold text-2xl kipo-gradient">
                                Kipo
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map(({ name, href, icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                                    pathname === href
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent hover:text-accent-foreground"
                                }`}
                            >
                                {icon}
                                {name}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesión
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
    );
}
