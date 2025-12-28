/**
 * Тема Material-UI с поддержкой доступности
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { deDE } from '@mui/material/locale';

// Базовая цветовая палитра (высокий контраст)
const colors = {
  primary: {
    main: '#0D47A1', // Темно-синий
    light: '#5472D3',
    dark: '#002171',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2E7D32', // Зеленый
    light: '#60AD5E',
    dark: '#005005',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#C62828',
    light: '#FF5F52',
    dark: '#8E0000',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F9A825',
    light: '#FFD95A',
    dark: '#C17900',
    contrastText: '#000000',
  },
  success: {
    main: '#388E3C',
    light: '#6ABF69',
    dark: '#00600F',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0288D1',
    light: '#5EB8FF',
    dark: '#005B9F',
    contrastText: '#FFFFFF',
  },
};

// Базовые настройки темы
const baseThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    ...colors,
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
      disabled: '#9E9E9E',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 16, // Базовый размер 16px для лучшей читаемости
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none', // Избегаем uppercase для лучшей читаемости
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48, // WCAG рекомендует минимум 44px, используем 48px
          minWidth: 48,
          padding: '12px 24px',
          fontSize: '1rem',
          '&:focus-visible': {
            outline: '3px solid currentColor',
            outlineOffset: '2px',
          },
        },
        sizeLarge: {
          minHeight: 56,
          padding: '16px 32px',
          fontSize: '1.125rem',
        },
      },
      defaultProps: {
        disableElevation: true, // Более плоский дизайн
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 48,
          minHeight: 48,
          '&:focus-visible': {
            outline: '3px solid currentColor',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: 48,
            fontSize: '1rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '8px',
          color: '#212121',
          '&.Mui-focused': {
            color: '#0D47A1',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '12px',
          '&:focus-visible': {
            outline: '3px solid currentColor',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: '12px',
          '&:focus-visible': {
            outline: '3px solid currentColor',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationThickness: '2px',
          textUnderlineOffset: '2px',
          '&:focus-visible': {
            outline: '3px solid currentColor',
            outlineOffset: '2px',
            borderRadius: '2px',
          },
        },
      },
    },
  },
};

// Светлая тема
export const lightTheme = createTheme(baseThemeOptions, deDE);

// Темная тема
export const darkTheme = createTheme(
  {
    ...baseThemeOptions,
    palette: {
      mode: 'dark',
      ...colors,
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
        disabled: '#757575',
      },
    },
  },
  deDE
);

// Тема с высоким контрастом
export const highContrastTheme = createTheme(
  {
    ...baseThemeOptions,
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#000000',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#FFFFFF',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#000000',
        secondary: '#000000',
      },
      error: {
        main: '#D32F2F',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#1B5E20',
        contrastText: '#FFFFFF',
      },
    },
    components: {
      ...baseThemeOptions.components,
      MuiButton: {
        styleOverrides: {
          root: {
            border: '2px solid #000000',
            minHeight: 48,
            minWidth: 48,
            '&:focus-visible': {
              outline: '4px solid #000000',
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderWidth: '2px',
                borderColor: '#000000',
              },
            },
          },
        },
      },
    },
  },
  deDE
);

// Функция для получения темы на основе настроек
export function getTheme(colorScheme: 'light' | 'dark' | 'high-contrast', fontSize: number = 100) {
  let theme;

  switch (colorScheme) {
    case 'dark':
      theme = darkTheme;
      break;
    case 'high-contrast':
      theme = highContrastTheme;
      break;
    default:
      theme = lightTheme;
  }

  // Применяем масштабирование шрифта
  if (fontSize !== 100) {
    theme = createTheme({
      ...theme,
      typography: {
        ...theme.typography,
        fontSize: (16 * fontSize) / 100,
      },
    });
  }

  return theme;
}
