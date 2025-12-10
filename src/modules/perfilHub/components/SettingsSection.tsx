import React from 'react';
import './SettingsSection.css';

export interface SettingsSectionProps {
    title?: string;
    children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
    return (
        <div className="settings-section">
            {title && <div className="settings-section__title">{title}</div>}
            <div className="settings-section__content">
                {children}
            </div>
        </div>
    );
};
