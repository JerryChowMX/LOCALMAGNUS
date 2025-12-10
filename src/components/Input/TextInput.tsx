import React from 'react';
import './TextInput.css';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    error,
    rightIcon,
    onRightIconClick,
    className,
    id,
    ...props
}) => {
    const inputId = id || props.name;

    return (
        <div className={`text-input-group ${className || ''}`}>
            {label && (
                <label htmlFor={inputId} className="text-input-label">
                    {label}
                </label>
            )}
            <div className="text-input-wrapper">
                <input
                    id={inputId}
                    className={`text-input ${error ? 'text-input--error' : ''}`}
                    {...props}
                />
                {rightIcon && (
                    <button
                        type="button"
                        className="text-input-icon-btn"
                        onClick={onRightIconClick}
                        tabIndex={-1}
                    >
                        {rightIcon}
                    </button>
                )}
            </div>
            {error && <span className="text-input-error">{error}</span>}
        </div>
    );
};
