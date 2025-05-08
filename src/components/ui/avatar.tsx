// src/components/ui/avatar.tsx
"use client";

import React from "react";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** URL de la imagen de avatar. Si no se pasa o está vacía, usará kipo por defecto */
    src?: string;
    /** Texto alternativo para la imagen */
    alt?: string;
    /** Clases CSS adicionales para el contenedor */
    className?: string;
}

/**
 * Avatar que muestra `src` si está definido y no vacío,
 * o el PNG de Kipo en `/icons/avatar/kipo.png` en caso contrario.
 */
export function Avatar({
    src,
    alt = "Avatar",
    className = "",
    ...imgProps
}: AvatarProps) {
    const displaySrc =
        typeof src === "string" && src.trim() !== ""
            ? src
            : "/icons/avatar/kipo.png"; // <–– ruta en public/

    return (
        <div
            className={[
                "inline-flex overflow-hidden rounded-full bg-gray-200",
                "items-center justify-center",
                className,
            ].join(" ")}
            aria-label="Avatar"
        >
            <img
                src={displaySrc}
                alt={alt}
                className="w-full h-full object-cover"
                {...imgProps}
            />
        </div>
    );
}
