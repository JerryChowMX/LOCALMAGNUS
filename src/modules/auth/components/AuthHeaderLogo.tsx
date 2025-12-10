import React from 'react';
import { Display } from '../../../components/Typography/Typography';
import './AuthHeaderLogo.css';

export const AuthHeaderLogo: React.FC = () => {
    return (
        <div className="auth-header-logo">
            <Display className="auth-header-logo__title">MAGNUS</Display>
            <div className="auth-header-logo__subtitle">
                <span className="brand-orange">VANGUARDIA</span>
            </div>
        </div>
    );
};
