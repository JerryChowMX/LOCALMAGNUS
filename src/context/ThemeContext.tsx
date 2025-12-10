import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { track } from '../lib/analytics';

type Theme = 'light' | 'dark';
export type FontSizePreference = 'small' | 'medium' | 'large';

interface UserPreferencesState {
    theme: Theme;
    fontSize: FontSizePreference;
}

interface UserPreferencesContextType extends UserPreferencesState {
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    setFontSize: (size: FontSizePreference) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'magnus-theme';
const FONT_SIZE_STORAGE_KEY = 'magnus-font-size';
const DEFAULT_FONT_SIZE: FontSizePreference = 'medium';

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize theme from localStorage or system preference
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    // Initialize fontSize from localStorage
    const [fontSize, setFontSizeState] = useState<FontSizePreference>(() => {
        const savedFontSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
        if (savedFontSize === 'small' || savedFontSize === 'medium' || savedFontSize === 'large') {
            return savedFontSize;
        }
        return DEFAULT_FONT_SIZE;
    });

    // Update DOM immediately when theme changes
    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    // Update DOM immediately when fontSize changes
    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-font-size', fontSize);
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    }, [fontSize]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setThemeState((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            track({ name: 'theme_changed', properties: { new_theme: newTheme } });
            return newTheme;
        });
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        track({ name: 'theme_changed', properties: { new_theme: newTheme } });
    };

    const setFontSize = (size: FontSizePreference) => {
        setFontSizeState(size);
        track({ name: 'font_size_changed', properties: { new_font_size: size } });
    };

    return (
        <UserPreferencesContext.Provider value={{ theme, fontSize, toggleTheme, setTheme, setFontSize }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (context === undefined) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
};

// Backward compatibility alias
export const useTheme = () => {
    const { theme, toggleTheme, setTheme } = useUserPreferences();
    return { theme, toggleTheme, setTheme };
};

// Backward compatibility alias
export const ThemeProvider = UserPreferencesProvider;
