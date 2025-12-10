import React from 'react';
import './Typography.css';

export interface TypographyProps {
    variant:
    | "display"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "body"
    | "body-sm"
    | "caption"
    | "label";
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
    children: React.ReactNode;
    color?: "primary" | "secondary" | "accent" | "error" | "success";
    align?: "left" | "center" | "right";
    style?: React.CSSProperties;
}

const variantToClass: Record<TypographyProps["variant"], string> = {
    "display": "text-display",
    "heading-1": "text-heading-1",
    "heading-2": "text-heading-2",
    "heading-3": "text-heading-3",
    body: "text-body",
    "body-sm": "text-body-sm",
    caption: "text-caption",
    label: "text-label",
};

export const Typography: React.FC<TypographyProps> = ({
    variant,
    as: Component = "p",
    className,
    children,
    color,
    align,
    style
}) => {
    const classes = [
        variantToClass[variant],
        color ? `text-color-${color}` : '',
        align ? `text-align-${align}` : '',
        className
    ].filter(Boolean).join(" ");

    const Tag = Component as React.ElementType;
    return <Tag className={classes} style={style}>{children}</Tag>;
};

// Legacy Wrappers for Backward Compatibility

export const Display: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="display" as="h1" {...props} />
);

export const Headline: React.FC<Omit<TypographyProps, 'variant'> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }> = ({ level = 1, ...props }) => {
    let variant: TypographyProps['variant'] = 'heading-1';
    if (level === 2) variant = 'heading-2';
    if (level >= 3) variant = 'heading-3';

    const Component = `h${level}` as keyof React.JSX.IntrinsicElements;
    return <Typography variant={variant} as={Component} {...props} />;
};

export const Title: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="heading-3" as="h3" {...props} />
);

export const Subtitle: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body" as="h4" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'> & { size?: 'lg' | 'md' | 'sm' }> = ({ size = 'md', ...props }) => {
    const variant = size === 'sm' ? 'body-sm' : 'body';
    return <Typography variant={variant} as="p" {...props} />;
};

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption" as="span" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="label" as="span" {...props} />
);

// Deprecated aliases
export const Text: React.FC<any> = (props) => <Body {...props} />;
export const Heading: React.FC<any> = (props) => <Headline {...props} />;
