"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const switchStyles = cva(
    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            checked: {
                true: "bg-green-500 focus:ring-green-500",
                false: "bg-muted",
            },
        },
        defaultVariants: {
            checked: false,
        },
    }
);

const thumbStyles = cva(
    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition-transform",
    {
        variants: {
            checked: {
                true: "translate-x-5",
                false: "translate-x-0",
            },
        },
        defaultVariants: {
            checked: false,
        },
    }
);

export interface SwitchProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked">,
        VariantProps<typeof switchStyles> {
    checked?: boolean;
}

/**
 * Switch component.
 * @example
 * <Switch checked={on} onCheckedChange={setOn} />
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, checked = false, ...props }, ref) => {
        return (
            <label className={twMerge("inline-flex items-center", className)}>
                <input
                    type="checkbox"
                    className="sr-only"
                    ref={ref}
                    checked={checked}
                    {...props}
                />
                <span className={switchStyles({ checked })}>
                    <span className={thumbStyles({ checked })} />
                </span>
            </label>
        );
    }
);

Switch.displayName = "Switch";
