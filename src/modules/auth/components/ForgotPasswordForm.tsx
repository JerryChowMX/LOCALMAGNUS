import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../../../components/Input/TextInput';
import { Button } from '../../../components/Button/Button';
import { Caption } from '../../../components/Typography/Typography';
import { routes } from '../../../app/routes';
import './ForgotPasswordForm.css';

export const ForgotPasswordForm: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // TODO: Implement actual password reset API call to Strapi
            // const response = await fetch('http://localhost:1337/api/auth/forgot-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });

            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSuccess(true);
        } catch (err) {
            setError('Error al enviar el correo. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="forgot-password-form forgot-password-form--success">
                <div className="forgot-password-form__success-icon">✓</div>
                <h2 className="forgot-password-form__success-title">
                    Correo Enviado
                </h2>
                <Caption color="secondary" className="forgot-password-form__success-text">
                    Si existe una cuenta con {email}, recibirás un correo con instrucciones
                    para restablecer tu contraseña.
                </Caption>

                <Button
                    onClick={() => navigate(routes.login)}
                    variant="secondary"
                    fullWidth
                    className="forgot-password-form__back-button"
                >
                    Volver al inicio de sesión
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="forgot-password-form__header">
                <h2 className="forgot-password-form__title">
                    ¿Olvidaste tu contraseña?
                </h2>
                <Caption color="secondary" className="forgot-password-form__subtitle">
                    Ingresa tu correo electrónico y te enviaremos instrucciones
                    para restablecer tu contraseña.
                </Caption>
            </div>

            <div className="forgot-password-form__fields">
                <TextInput
                    placeholder="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
            </div>

            {error && <div className="forgot-password-form__error">{error}</div>}

            <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
                className="forgot-password-form__submit"
            >
                Enviar Instrucciones
            </Button>

            <div className="forgot-password-form__back">
                <span
                    onClick={() => navigate(routes.login)}
                    className="forgot-password-form__back-link"
                >
                    <Caption>← Volver al inicio de sesión</Caption>
                </span>
            </div>
        </form>
    );
};
