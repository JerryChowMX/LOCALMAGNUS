import React from 'react';
import { Button } from '../../../components/Button/Button';
import './MembershipCard.css';

export interface MembershipCardProps {
    planName: string;
    renewalDate: string;
    benefits: string[];
    onViewBenefits?: () => void;
    onManage?: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
    planName,
    renewalDate,
    benefits,
    onManage
}) => {
    return (
        <div className="membership-card">
            <div className="membership-card__header">
                <h3 className="membership-card__title">{planName}</h3>
                <span className="membership-card__renewal">Renueva: {renewalDate}</span>
            </div>

            <ul className="membership-card__benefits">
                {benefits.map((benefit, index) => (
                    <li key={index} className="membership-card__benefit">
                        {benefit}
                    </li>
                ))}
            </ul>

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
