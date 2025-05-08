// src/app/layout.tsx
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/AuthProvider";

// 1. Carga Quicksand con pesos que necesites
const fontQuicksand = Quicksand({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: {
        default: "Kipo",
        template: "%s | Kipo – Finanzas Personales",
    },
    description:
        "Kipo te ayuda a controlar gastos, establecer metas de ahorro y recibir recomendaciones inteligentes basadas en IA. Gestiona tu dinero de forma sencilla, segura y visual.",
    keywords: [
        "finanzas personales",
        "ahorro",
        "control de gastos",
        "metas de ahorro",
        "gestión financiera",
        "inteligencia artificial",
        "dashboard financiero",
        "Kipo",
    ],
    authors: [
        { name: "Amoxtli Web Developers", url: "https://www.amoxtli.tech" },
    ],
    creator: "Amoxtli Web Developers",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#333333" },
    ],
    viewport: "width=device-width, initial-scale=1.0",
    manifest: "/site.webmanifest",
    icons: {
        icon: "/favicon.png",
        apple: "/favicon.png",
        shortcut: "/favicon.png",
        other: [
            { rel: "apple-touch-icon", url: "/favicon.png" },
            { rel: "manifest", url: "/site.webmanifest" },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        title: "Kipo – Control de Finanzas Personales",
        description:
            "Descubre Kipo: tu aliado para controlar gastos, fijar metas de ahorro y recibir recomendaciones inteligentes basadas en IA.",
        url: "https://tusitio.com",
        siteName: "Kipo",
        images: [
            {
                url: "https://tusitio.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "Kipo – Finanzas Personales",
            },
        ],
        locale: "es_ES",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Kipo – Control de Finanzas Personales",
        description:
            "Gestiona tus finanzas fácilmente: gastos, metas de ahorro y consejos de IA con Kipo.",
        creator: "@tuTwitterHandle",
        images: ["https://tusitio.com/twitter-card.png"],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="light">
            <head />
            <body
                className={cn(
                    // 2. Aplica la variable CSS de Quicksand globalmente
                    "min-h-screen bg-background antialiased",
                    fontQuicksand.variable,
                    "font-sans"
                )}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
