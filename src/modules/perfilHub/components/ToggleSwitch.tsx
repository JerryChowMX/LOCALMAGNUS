import React from 'react';
import './ToggleSwitch.css';

export interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="toggle-switch__slider"></span>
        </label>
    );
};
