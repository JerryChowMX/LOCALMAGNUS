import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { TextInput } from '../../../components/Input/TextInput';
import { Button } from '../../../components/Button/Button';
import { Icons } from '../../../components/Icons';
import { Caption } from '../../../components/Typography/Typography';
import { routes } from '../../../app/routes';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const from = location.state?.from?.pathname || '/PerfilHub';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Credenciales inválidas.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form__fields">
                <TextInput
                    placeholder="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />

                <TextInput
                    placeholder="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    rightIcon={showPassword ? <Icons.eyeOff size={20} /> : <Icons.eye size={20} />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                    autoComplete="current-password"
                    required
                />

                <div className="login-form__forgot">
                    <span
                        onClick={() => navigate(routes.forgotPassword)}
                        className="login-form__forgot-link"
                    >
                        <Caption>¿Olvidaste tu contraseña?</Caption>
                    </span>
                </div>
            </div>

            {error && <div className="login-form__error">{error}</div>}

            <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
                className="login-form__submit"
            >
                Continuar
            </Button>

            <div className="login-form__register">
                <Caption color="secondary">¿No tienes cuenta? </Caption>
                <span
                    onClick={() => navigate(routes.signup)}
                    className="login-form__register-link"
                >
                    <Caption>Registrarte</Caption>
                </span>
            </div>
        </form>
    );
};
