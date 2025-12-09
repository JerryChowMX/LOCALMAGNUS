import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { TextInput } from '../../../components/Input/TextInput';
import { Button } from '../../../components/Button/Button';
import { Icons } from '../../../components/Icons';
import { Caption } from '../../../components/Typography/Typography';
import { routes } from '../../../app/routes';
import './SignupForm.css';

export const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const validateForm = () => {
        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        if (!acceptedTerms) {
            setError('Debes aceptar los términos y condiciones');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await register({
                username: formData.email, // Using email as username for now as per Strapi often defaults
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName
            });

            // On success, redirect to login or home (since register auto-logs in now)
            // Let's go to PerfilHub or wherever login goes
            navigate(routes.login, {
                state: { message: 'Cuenta creada exitosamente.' }
            });
        } catch (err: any) {
            // Display the actual error message from the backend
            setError(err.message || 'Error al crear la cuenta. El correo podría estar ya registrado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof typeof formData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setError(null);
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-form__fields">
                <TextInput
                    placeholder="Nombre completo"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    autoComplete="name"
                    required
                />

                <TextInput
                    placeholder="Correo electrónico"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    autoComplete="email"
                    required
                />

                <TextInput
                    placeholder="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                    rightIcon={showPassword ? <Icons.eyeOff size={20} /> : <Icons.eye size={20} />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                    autoComplete="new-password"
                    required
                />

                <TextInput
                    placeholder="Confirmar contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    rightIcon={showConfirmPassword ? <Icons.eyeOff size={20} /> : <Icons.eye size={20} />}
                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    autoComplete="new-password"
                    required
                />

                <div className="signup-form__terms">
                    <label className="signup-form__checkbox-label">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="signup-form__checkbox"
                        />
                        <Caption>
                            Acepto los <span className="signup-form__link">términos y condiciones</span> y la{' '}
                            <span className="signup-form__link">política de privacidad</span>
                        </Caption>
                    </label>
                </div>
            </div>

            {error && <div className="signup-form__error">{error}</div>}

            <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
                className="signup-form__submit"
            >
                Crear Cuenta
            </Button>

            <div className="signup-form__login">
                <Caption color="secondary">¿Ya tienes cuenta? </Caption>
                <span
                    onClick={() => navigate(routes.login)}
                    className="signup-form__login-link"
                >
                    <Caption>Iniciar sesión</Caption>
                </span>
            </div>
        </form>
    );
};
