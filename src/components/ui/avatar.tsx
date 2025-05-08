import React from "react";

interface AvatarRootProps {
    /** Container classes */
    className?: string;
    /** Children: AvatarImage or AvatarFallback */
    children: React.ReactNode;
}

/**
 * Root wrapper for Avatar component.
 * Usage:
 * <Avatar className="w-10 h-10">
 *   <AvatarImage src={...} alt="..." />
 *   <AvatarFallback>AB</AvatarFallback>
 * </Avatar>
 */
export function Avatar({ className = "", children }: AvatarRootProps) {
    return (
        <div
            className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-600 ${className}`.trim()}
        >
            {children}
        </div>
    );
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** URL of the avatar image */
    src: string;
    /** Alt text for the image */
    alt?: string;
    /** Additional classes */
    className?: string;
}

/**
 * Renders the avatar image.
 */
export function AvatarImage({
    src,
    alt = "",
    className = "",
    ...props
}: AvatarImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${className}`.trim()}
            {...props}
        />
    );
}

interface AvatarFallbackProps {
    /** Fallback content (initials or icon) */
    children: React.ReactNode;
    /** Additional classes */
    className?: string;
}

/**
 * Fallback shown when no image is provided.
 */
export function AvatarFallback({
    children,
    className = "",
}: AvatarFallbackProps) {
    return (
        <span className={`font-medium ${className}`.trim()}>{children}</span>
    );
}
