import React, { useEffect, useState } from 'react';
import { setAnalyticsConsent, hasConsentBeenSet } from '../../lib/analytics';
import './ConsentBanner.css';

export const ConsentBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if consent has already been set
        const consentSet = hasConsentBeenSet();
        if (!consentSet) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        setAnalyticsConsent(true);
        setIsVisible(false);
    };

    const handleDecline = () => {
        setAnalyticsConsent(false);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="consent-banner">
            <div className="consent-content">
                <p className="consent-text">
                    ¿Nos permites usar datos de uso anónimos para mejorar la experiencia en MAGNUS?
                    <br />
                    <span className="consent-subtext">
                        No recopilamos información personal como tu nombre o correo.
                    </span>
                </p>
                <div className="consent-actions">
                    <button className="consent-button decline" onClick={handleDecline}>
                        No, gracias
                    </button>
                    <button className="consent-button accept" onClick={handleAccept}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};
