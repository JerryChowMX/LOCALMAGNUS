export interface ValidationResult {
    valid: boolean;
    error?: string;
}

// Same list as backend for consistency
const STOPWORDS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'y', 'e', 'o', 'u',
    'de', 'del', 'al', 'en', 'con', 'por', 'para', 'sin', 'sus', 'su',
    'ante', 'bajo', 'contra', 'desde', 'entre', 'hacia', 'hasta', 'segun', 'sobre', 'tras'
]);

export const searchUtils = {
    tokenize(query: string): string[] {
        if (!query) return [];

        return query
            .toLowerCase()
            // Retain letters, numbers, whitespace. u flag for unicode
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .split(/\s+/)
            .filter(t => t.length >= 3)
            .filter(t => !STOPWORDS.has(t));
    },

    validateQuery(query: string): ValidationResult {
        if (!query || query.trim().length === 0) {
            return { valid: false }; // Empty is not "error", just invalid to search
        }

        if (query.trim().length < 2) {
            return { valid: false, error: 'Ingresa al menos 2 caracteres' };
        }

        if (query.length > 100) {
            return { valid: false, error: 'Consulta demasiado larga' };
        }

        const tokens = this.tokenize(query);
        // We might want to allow 2-char queries if it's a specific acronym?
        // But backend enforces token length >= 3.
        // Wait, backend logic: .filter(t => t.length >= 3).
        // If query is "AI", backend filters it out -> finalTokens empty -> returns 0 results.

        // Frontend should match backend logic
        if (tokens.length === 0 && query.trim().length >= 3) {
            // User typed something long enough but it was all stopwords or valid chars removed
            return { valid: false, error: 'Término de búsqueda demasiado genérico' };
        }

        return { valid: true };
    }
};
