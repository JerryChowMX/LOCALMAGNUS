import React from 'react';
import { useToast, type Toast as ToastType } from '../../context/ToastContext';
import { Icons } from '../Icons';
import './ToastContainer.css';

const iconMap = {
    success: Icons.check,
    error: Icons.x,
    warning: Icons.alertCircle,
    info: Icons.info,
};

interface ToastItemProps {
    toast: ToastType;
    onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    const Icon = iconMap[toast.type];

    return (
        <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
            <div className="toast__content">
                <Icon className="toast__icon" size={20} strokeWidth={2} />
                <p className="toast__message">{toast.message}</p>
            </div>
            <button
                className="toast__close"
                onClick={() => onClose(toast.id)}
                aria-label="Cerrar notificación"
            >
                <Icons.x size={18} strokeWidth={2} />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
};
