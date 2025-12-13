import React from 'react';
import { Button } from '../../../components/Button/Button';
import './MembershipCard.css';

export interface MembershipCardProps {
    planName?: string;
    renewalDate?: string;
    benefits?: string[];
    isPaying?: boolean;
    onViewBenefits?: () => void;
    onManage?: () => void;
    onSubscribe?: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
    planName = 'Plan Gratuito',
    renewalDate,
    benefits = [],
    isPaying = false,
    onManage,
    onSubscribe
}) => {
    // Non-paying user state
    if (!isPaying) {
        return (
            <div className="membership-card membership-card--free">
                <div className="membership-card__header">
                    <h3 className="membership-card__title">Sin membresía activa</h3>
                </div>
                <p className="membership-card__description">
                    Obtén acceso ilimitado a todo el contenido, funciones exclusivas de MAGNUS AI, y mucho más.
                </p>
                <div className="membership-card__actions">
                    <Button
                        variant="primary"
                        onClick={onSubscribe || (() => window.open('https://Membresiavanguardia.com', '_blank'))}
                        fullWidth
                        className="membership-card__btn-subscribe"
                    >
                        Suscríbete ahora
                    </Button>
                </div>
            </div>
        );
    }

    // Paying user state
    return (
        <div className="membership-card">
            <div className="membership-card__header">
                <h3 className="membership-card__title">{planName}</h3>
                {renewalDate && <span className="membership-card__renewal">Renueva: {renewalDate}</span>}
            </div>

            {benefits.length > 0 && (
                <ul className="membership-card__benefits">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="membership-card__benefit">
                            {benefit}
                        </li>
                    ))}
                </ul>
            )}

            <div className="membership-card__actions">
                <Button
                    variant="secondary"
                    onClick={() => window.open('https://Membresiavanguardia.com', '_blank')}
                    fullWidth
                >
                    Ver beneficios
                </Button>
                <Button
                    variant="primary"
                    onClick={onManage}
                    fullWidth
                    className="membership-card__btn-manage"
                >
                    Administrar
                </Button>
            </div>
        </div>
    );
};
