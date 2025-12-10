import React from 'react';
import './OptionSelector.css';

export interface Option {
    label: string;
    value: string;
}

export interface OptionSelectorProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ options, value, onChange }) => {
    return (
        <div className="option-selector">
            {options.map((option) => (
                <button
                    key={option.value}
                    className={`option-selector__option ${value === option.value ? 'option-selector__option--active' : ''}`}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
