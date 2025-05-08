// src/components/icons/cards/DiscoverIcon.tsx
import React from "react";

export function DiscoverIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 30"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Discover"
        >
            <rect width="100" height="30" fill="none" />
            <text
                x="5"
                y="20"
                fill="white"
                fontSize="16"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
            >
                DISCOVER
            </text>
        </svg>
    );
}
