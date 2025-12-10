import React from 'react';
import { Icons } from '../../../components/Icons';
import './SettingsRow.css';

export interface SettingsRowProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, onClick }) => {
    return (
        <button className="settings-row" onClick={onClick}>
            <div className="settings-row__icon">
                {icon}
            </div>
            <span className="settings-row__label">{label}</span>
            <div className="settings-row__chevron">
                <Icons.chevronRight size={20} stroke={1.5} />
            </div>
        </button>
    );
};
