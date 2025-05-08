// src/components/icons/cards/AmexIcon.tsx
import React from "react";

export function AmexIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 30"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="American Express"
        >
            <rect width="100" height="30" fill="none" />
            <text
                x="5"
                y="22"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
            >
                AMERICAN
            </text>
            <text
                x="5"
                y="30"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
            >
                EXPRESS
            </text>
        </svg>
    );
}
