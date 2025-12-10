interface ArticleAuthorProps {
    name: string;
}

export const ArticleAuthor = ({ name }: ArticleAuthorProps) => {
    return (
        <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
            <div style={{
                padding: '32px 24px',
                backgroundColor: 'var(--bg-primary)',
                textAlign: 'center',
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <span style={{
                    display: 'block',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px'
                }}>
                    Por
                </span>
                <h4 style={{
                    fontFamily: '"Blinker", sans-serif',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0',
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase'
                }}>
                    {name}
                </h4>
                <div style={{
                    width: '40px',
                    height: '2px',
                    backgroundColor: '#0076AB',
                    margin: '0 auto'
                }} />
            </div>
        </div>
    );
};
