"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Target,
    BellRing,
    LogOut,
    DollarSign,
    WalletCards
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, useEffect } from "react";
import kipo from "../../assets/icons/avatar/kipo.png";
import logo from "../../assets/logo.png";

export default function DashboardShell({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <Skeleton className="h-screen w-full" />;
    }
    if (status === "unauthenticated") {
        return null;
    }

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            name: "Transacciones",
            href: "/dashboard/transactions",
            icon: <DollarSign className="h-5 w-5" />,
        },
        {
            name: "Metas",
            href: "/dashboard/goals",
            icon: <Target className="h-5 w-5" />,
        },
        {
            name: "Wallet",
            href: "/dashboard/cards",
            icon: <WalletCards className="h-5 w-5" />,
        },
        {
            name: "Alertas",
            href: "/dashboard/alerts",
            icon: <BellRing className="h-5 w-5" />,
        },
    ];

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center justify-between p-4 bg-card border-b">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={logo}
                        alt="Kipo"
                        width={60}
                        height={60}
                        unoptimized
                        priority
                    />
                </Link>
                <Button
                    variant="ghost"
                    className="gap-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() =>
                        signOut({
                            callbackUrl: process.env.NEXT_PUBLIC_APP_URL + "/",
                        })
                    }
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                </Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:flex flex-col w-64 border-r bg-card">
                    <nav className="flex-1 px-4 py-6 space-y-1">
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
                    <div className="p-4">
                        <Card>
                            <div className="flex items-center p-4 pl-2">
                                {/** No hace falta condicional: si session.user.image está, lo muestra; si no, usa kipo.png */}
                                <Image
                                    src={session?.user?.image || kipo}
                                    alt={session?.user?.name || "Kipo"}
                                    width={40}
                                    height={40}
                                    unoptimized
                                    priority
                                    className="mr-2"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {session?.user?.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {session?.user?.email}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </aside>

                <main className="flex-1 overflow-auto p-4 md:p-6 pb-16 md:pb-0">
                    {children}
                </main>
            </div>

            <nav className="fixed bottom-0 inset-x-0 md:hidden bg-card border-t flex justify-around py-2">
                {navItems.map(({ name, href, icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center text-xs ${
                            pathname === href
                                ? "text-primary"
                                : "text-muted-foreground"
                        } hover:text-primary`}
                    >
                        {icon}
                        <span className="mt-1">{name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
