import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './LandingPage.css';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Background Effects */}
            <div className="landing-bg-gradient-1" />
            <div className="landing-bg-gradient-2" />

            <div className="landing-content-wrapper">
                <div className="landing-header">
                    <h1>MAGNUS</h1>
                    <p>Una nueva forma de informarte.</p>
                </div>

                <div className="landing-spacer" />

                <div className="landing-card">
                    <h2>Comienza tu prueba</h2>
                    <p>Acceso total por 10 días.</p>

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
