import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeVariant = 'professional' | 'tint' | 'vibrant';
type ThemeAppearance = 'light' | 'dark' | 'system';

interface ThemeOptions {
  variant: ThemeVariant;
  primary: string;
  appearance: ThemeAppearance;
  radius: number;
}

interface ThemeContextType {
  theme: ThemeOptions;
  setTheme: (theme: Partial<ThemeOptions>) => void;
}

const defaultTheme: ThemeOptions = {
  variant: 'professional',
  primary: 'hsl(265, 80%, 58%)', // Purple from NebulaCDN design
  appearance: 'dark',
  radius: 0.75, // Rounded corners
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeOptions>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState({ ...defaultTheme, ...parsedTheme });
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  // Update theme properties
  const setTheme = (newTheme: Partial<ThemeOptions>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setThemeState(updatedTheme);
    localStorage.setItem('theme', JSON.stringify(updatedTheme));
  };

  // Update document root with theme class
  useEffect(() => {
    const root = document.documentElement;
    
    // Set appearance
    if (theme.appearance === 'dark' || 
        (theme.appearance === 'system' && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update CSS variables
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--radius', `${theme.radius}rem`);
    
    // Set variant class
    root.classList.remove('theme-professional', 'theme-tint', 'theme-vibrant');
    root.classList.add(`theme-${theme.variant}`);
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// CSS utility to generate theme-specific styles
export const nebulaTheme = {
  colors: {
    primary: { 
      DEFAULT: '#7c3aed', 
      dark: '#6d28d9', 
      light: '#8b5cf6' 
    },
    secondary: { 
      DEFAULT: '#06b6d4', 
      dark: '#0891b2', 
      light: '#22d3ee' 
    },
    accent: { 
      DEFAULT: '#f43f5e', 
      dark: '#e11d48', 
      light: '#fb7185' 
    },
    nebula: { 
      DEFAULT: '#12314F', 
      dark: '#0f172a', 
      light: '#1e293b' 
    }
  },
  animations: {
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    glow: {
      '0%': { boxShadow: '0 0 5px rgba(124, 58, 237, 0.3)' },
      '100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.7)' },
    },
    glitch: {
      '0%': { textShadow: '0.05em 0 0 rgba(244, 63, 94, 0.4), -0.05em 0 0 rgba(6, 182, 212, 0.4)' },
      '14%': { textShadow: '0.05em 0 0 rgba(244, 63, 94, 0.4), -0.05em 0 0 rgba(6, 182, 212, 0.4)' },
      '15%': { textShadow: '-0.05em -0.025em 0 rgba(244, 63, 94, 0.4), 0.025em 0.025em 0 rgba(6, 182, 212, 0.4)' },
      '49%': { textShadow: '-0.05em -0.025em 0 rgba(244, 63, 94, 0.4), 0.025em 0.025em 0 rgba(6, 182, 212, 0.4)' },
      '50%': { textShadow: '0.025em 0.05em 0 rgba(244, 63, 94, 0.4), 0.05em 0 0 rgba(6, 182, 212, 0.4)' },
      '99%': { textShadow: '0.025em 0.05em 0 rgba(244, 63, 94, 0.4), 0.05em 0 0 rgba(6, 182, 212, 0.4)' },
      '100%': { textShadow: '0.05em 0 0 rgba(244, 63, 94, 0.4), -0.05em 0 0 rgba(6, 182, 212, 0.4)' }
    }
  },
  effects: {
    glassCard: `
      background: rgba(23, 36, 65, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius);
    `,
    gradientBorder: `
      position: relative;
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: var(--radius);
        padding: 1px;
        background: linear-gradient(to right, var(--primary-color), #06b6d4);
        -webkit-mask: 
          linear-gradient(#fff 0 0) content-box, 
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }
    `
  }
};
