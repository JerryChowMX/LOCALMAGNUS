import { useState } from 'react';
import type { QuoteProps } from './types';

export const Quote = ({ quote, author }: QuoteProps) => {
    const [showAuthor, setShowAuthor] = useState(false);

    return (
        <div style={{
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto'
        }}>
            <div
                onClick={() => setShowAuthor(!showAuthor)}
                style={{
                    position: 'relative',
                    padding: '20px 0',
                    cursor: 'pointer',
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 450ms ease'
                }}
            >
                {/* Quote */}
                <div style={{
                    opacity: showAuthor ? 0 : 1,
                    transition: 'opacity 450ms ease',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 0'
                }}>
                    <p style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        fontStyle: 'italic',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        color: '#4B5563',
                        margin: 0,
                        borderLeft: '2px solid #0076ab',
                        paddingLeft: '20px'
                    }}>
                        {quote}
                    </p>
                </div>

                {/* Author */}
                <div style={{
                    opacity: showAuthor ? 1 : 0,
                    transition: 'opacity 450ms ease 40ms',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 0'
                }}>
                    <p style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: '#9CA3AF',
                        margin: 0,
                        textAlign: 'center'
                    }}>
                        – {author}
                    </p>
                </div>
            </div>
        </div>
    );
};
