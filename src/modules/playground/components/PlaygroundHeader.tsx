import { useNavigate } from 'react-router-dom';
import './PlaygroundHeader.css';

interface PlaygroundHeaderProps {
    showBackButton?: boolean;
}

export const PlaygroundHeader = ({ showBackButton = true }: PlaygroundHeaderProps) => {
    const navigate = useNavigate();

    return (
        <header className="playground-header">
            {showBackButton && (
                <button
                    className="playground-header-back"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            )}

            <h1
                className="playground-header-title"
                onClick={() => navigate('/dev/playground')}
                style={{ cursor: 'pointer' }}
            >
                Playground
            </h1>

            {showBackButton && <div className="playground-header-spacer"></div>}
        </header>
    );
};
