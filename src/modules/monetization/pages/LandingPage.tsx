import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AuthHeaderLogo } from '../../auth/components/AuthHeaderLogo';
import './LandingPage.css';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-content-wrapper">
                <AuthHeaderLogo />

                <div className="landing-card">
                    <h2 className="landing-card__title">COMIENZA TU PRUEBA</h2>
                    <p className="landing-card__description">
                        Acceso total por 10 días.<br />
                        Sin compromiso.
                    </p>

                    <div className="landing-actions">
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn-primary"
                        >
                            <span>Iniciar prueba gratis</span>
                            <ArrowRight size={20} />
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="btn-secondary"
                        >
                            Ya tengo cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
