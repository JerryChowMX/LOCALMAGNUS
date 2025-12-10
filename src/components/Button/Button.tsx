import React from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "glass";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    className,
    children,
    disabled,
    ...rest
}) => {
    const classes = [
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && "btn--fullWidth",
        loading && "btn--loading",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button className={classes} disabled={disabled || loading} {...rest}>
            {loading ? "Loading..." : children}
        </button>
    );
};
