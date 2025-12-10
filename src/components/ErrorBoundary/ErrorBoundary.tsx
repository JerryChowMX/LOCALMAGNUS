import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch React errors and display fallback UI
 * Prevents entire app from crashing when a component throws an error
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Call optional error handler
        this.props.onError?.(error, errorInfo);

        // TODO: In production, send to error tracking service (Sentry, etc.)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '24px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                }}>
                    <div style={{
                        maxWidth: '480px',
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            marginBottom: '16px',
                        }}>
                            Algo salió mal
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)',
                            marginBottom: '24px',
                        }}>
                            Lo sentimos, ha ocurrido un error inesperado.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <pre style={{
                                textAlign: 'left',
                                padding: '16px',
                                backgroundColor: 'var(--bg-tertiary)',
                                borderRadius: '8px',
                                fontSize: '12px',
                                overflow: 'auto',
                                marginBottom: '24px',
                            }}>
                                {this.state.error.message}
                            </pre>
                        )}
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: 600,
                                backgroundColor: 'var(--color-brand-orange)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 'var(--radius-btn)',
                                cursor: 'pointer',
                            }}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
