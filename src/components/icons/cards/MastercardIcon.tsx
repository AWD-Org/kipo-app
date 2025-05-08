// src/components/icons/cards/MastercardIcon.tsx
import React from "react";

export function MastercardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 30"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Mastercard"
        >
            <rect width="100" height="30" fill="none" />
            <circle cx="40" cy="15" r="10" fill="#EB001B" />
            <circle cx="60" cy="15" r="10" fill="#F79E1B" />
        </svg>
    );
}
