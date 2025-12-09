import React, { useState, useEffect } from 'react';
import { Heading, Text } from '../../../components/Typography/Typography';
import { Button } from '../../../components/Button/Button';
import { Icons } from '../../../components/Icons';
import './ProfileCard.css';

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl?: string;
    description?: string;
}

export interface ProfileCardProps {
    user?: UserProfile;
    onLogin?: () => void;
    onEdit?: () => void;
    onUpdateDescription?: (description: string) => void;
    onUpdateProfile?: (data: Partial<UserProfile>, file?: File) => Promise<void>;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLogin, onUpdateProfile }) => {
    const [name, setName] = useState(user?.name || '');
    const [description, setDescription] = useState(user?.description || '');
    const MAX_CHARS = 160;

    // Edit modes
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(!user?.description);
    const [isUploading, setIsUploading] = useState(false);

    // File input ref
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            if (user.description) setDescription(user.description);
        }
    }, [user]);

    const handleSaveName = async () => {
        if (!name.trim() || !onUpdateProfile) return;
        try {
            await onUpdateProfile({ name });
            setIsEditingName(false);
        } catch (error) {
            console.error(error);
            // Revert on error
            if (user) setName(user.name);
        }
    };

    const handleSaveDescription = async () => {
        if (!onUpdateProfile) return;
        try {
            await onUpdateProfile({ description });
            setIsEditingDescription(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUpdateProfile) return;

        try {
            setIsUploading(true);
            await onUpdateProfile({}, file);
        } catch (error) {
            console.error('Failed to upload image', error);
        } finally {
            setIsUploading(false);
        }
    };

    if (!user) {
        return (
            <div className="profile-card">
                <div className="profile-card__image-container">
                    <Icons.user size={64} stroke={1.5} />
                </div>
                <Heading level={3}>Bienvenido a MAGNUS</Heading>
                <Text variant="body" color="secondary">Inicia sesión para personalizar tu experiencia.</Text>
                <div className="profile-card__actions">
                    <Button onClick={onLogin}>Iniciar Sesión</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-card">
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="profile-card__image-container">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="profile-card__image" />
                ) : (
                    <Icons.user size={80} stroke={1.5} />
                )}
                <button
                    className="profile-card__edit-button"
                    onClick={handleImageClick}
                    disabled={isUploading}
                    aria-label="Editar foto"
                >
                    {isUploading ? <Icons.refresh size={18} className="animate-spin" /> : <Icons.edit size={18} stroke={1.5} />}
                </button>
            </div>

            <div className="profile-card__info">
                {isEditingName ? (
                    <div className="profile-card__name-edit">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            className="profile-card__name-input"
                            autoFocus
                        />
                        <button onClick={handleSaveName} className="profile-card__save-mini-btn">
                            <Icons.check size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="profile-card__name-display">
                        <Heading level={2}>{user.name}</Heading>
                        <button
                            className="profile-card__edit-icon-btn"
                            onClick={() => setIsEditingName(true)}
                            aria-label="Editar nombre"
                        >
                            <Icons.edit size={16} stroke={1.5} />
                        </button>
                    </div>
                )}
                <Text variant="body" color="secondary">{user.email}</Text>
            </div>

            <div className="profile-card__description-container">
                <div className="profile-card__description-header">
                    <label className="profile-card__description-label">Cuéntanos quién eres:</label>
                    {!isEditingDescription && (
                        <button
                            className="profile-card__edit-desc-btn"
                            onClick={() => setIsEditingDescription(true)}
                        >
                            <Icons.edit size={14} stroke={1.5} /> Editar
                        </button>
                    )}
                </div>

                {isEditingDescription ? (
                    <>
                        <textarea
                            className="profile-card__description-input"
                            placeholder="Agrega una descripción..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={MAX_CHARS}
                        />
                        <div className="profile-card__footer">
                            <span className="profile-card__char-count">
                                {description.length}/{MAX_CHARS}
                            </span>
                            <button
                                className="profile-card__save-btn"
                                onClick={handleSaveDescription}
                            >
                                Guardar
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="profile-card__description-text">
                        {description || "Sin descripción"}
                    </div>
                )}
            </div>
        </div>
    );
};
