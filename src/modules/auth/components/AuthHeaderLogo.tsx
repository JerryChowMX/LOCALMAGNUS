import React from 'react';
import { Display } from '../../../components/Typography/Typography';
import './AuthHeaderLogo.css';

export const AuthHeaderLogo: React.FC = () => {
    return (
        <div className="auth-header-logo">
            <Display className="auth-header-logo__title">MAGNUS</Display>
            <span className="auth-header-logo__byline">by JerryChowMX</span>
        </div>
    );
};
