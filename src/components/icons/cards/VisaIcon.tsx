// src/components/icons/cards/VisaIcon.tsx
import React from "react";

export function VisaIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 30"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Visa"
        >
            <rect width="100" height="30" fill="none" />
            <text
                x="5"
                y="22"
                fill="white"
                fontSize="20"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
            >
                VISA
            </text>
        </svg>
    );
}
