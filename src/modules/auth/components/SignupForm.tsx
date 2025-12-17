import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { TextInput } from '../../../components/Input/TextInput';
import { Button } from '../../../components/Button/Button';
import { Icons } from '../../../components/Icons';
import { Caption } from '../../../components/Typography/Typography';
import { routes } from '../../../app/routes';
import './SignupForm.css';

interface FormErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
}

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
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Por favor completa este campo';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Por favor completa este campo';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ingresa un correo electrónico válido';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Por favor completa este campo';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }

        if (!acceptedTerms) {
            newErrors.terms = 'Debes aceptar los términos y condiciones';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await register({
                username: formData.email,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName
            });

            navigate(routes.perfilHub);
        } catch (err: any) {
            setErrors({
                general: err.message || 'Error al crear la cuenta. El correo podría estar ya registrado.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof typeof formData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear specific error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <div className="signup-form__fields">
                <TextInput
                    placeholder="Nombre completo"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    autoComplete="name"
                    error={errors.fullName}
                />

                <TextInput
                    placeholder="Correo electrónico"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    autoComplete="email"
                    error={errors.email}
                />

                <TextInput
                    placeholder="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                    rightIcon={showPassword ? <Icons.eyeOff size={20} /> : <Icons.eye size={20} />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                    autoComplete="new-password"
                    error={errors.password}
                />

                <TextInput
                    placeholder="Confirmar contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    rightIcon={showConfirmPassword ? <Icons.eyeOff size={20} /> : <Icons.eye size={20} />}
                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                />

                <div className="signup-form__terms">
                    <label className="signup-form__checkbox-label">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => {
                                setAcceptedTerms(e.target.checked);
                                if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }));
                            }}
                            className="signup-form__checkbox"
                        />
                        <Caption>
                            Acepto los <span className="signup-form__link">términos y condiciones</span> y la{' '}
                            <span className="signup-form__link">política de privacidad</span>
                        </Caption>
                    </label>
                    {errors.terms && <div className="signup-form__error">{errors.terms}</div>}
                </div>
            </div>

            {errors.general && <div className="signup-form__error">{errors.general}</div>}

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
