/**
 * Утилиты для обеспечения доступности (WCAG 2.1 Level AA)
 */

import { AccessibilityPreferences } from '@/models/types';

/**
 * Проверка контрастности цветов (WCAG AA требует минимум 4.5:1 для обычного текста)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Применение пользовательских настроек доступности
 */
export function applyAccessibilityPreferences(
  preferences: AccessibilityPreferences
): void {
  const root = document.documentElement;

  // Цветовая схема
  root.setAttribute('data-color-scheme', preferences.colorScheme);

  // Высокая контрастность
  if (preferences.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Увеличенный текст
  root.style.fontSize = `${preferences.fontSize}%`;

  // Редуцированная анимация
  if (preferences.reducedMotion) {
    root.style.setProperty('--transition-duration', '0ms');
  } else {
    root.style.setProperty('--transition-duration', '200ms');
  }

  // Упрощенный режим
  if (preferences.simpleMode) {
    root.classList.add('simple-mode');
  } else {
    root.classList.remove('simple-mode');
  }
}

/**
 * Объявление для screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Управление фокусом
 */
export class FocusManager {
  private focusStack: HTMLElement[] = [];

  /**
   * Сохранить текущий фокус и переместить на новый элемент
   */
  pushFocus(element: HTMLElement): void {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus) {
      this.focusStack.push(currentFocus);
    }
    element.focus();
  }

  /**
   * Вернуть фокус на предыдущий элемент
   */
  popFocus(): void {
    const previousFocus = this.focusStack.pop();
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  /**
   * Очистить стек фокуса
   */
  clearFocus(): void {
    this.focusStack = [];
  }
}

/**
 * Trap фокуса внутри контейнера (для модальных окон)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  // Фокус на первый элемент при открытии
  firstElement?.focus();

  // Функция для удаления обработчика
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Форматирование валюты для screen readers
 */
export function formatCurrencyForScreenReader(
  amount: number,
  currency: string = 'EUR'
): string {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  });

  const formatted = formatter.format(amount);
  // Заменяем символ € на слово "Euro" для лучшего произношения
  return formatted.replace('€', 'Euro');
}

/**
 * Проверка, использует ли пользователь клавиатуру для навигации
 */
export function detectKeyboardNavigation(): void {
  let isUsingKeyboard = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isUsingKeyboard = true;
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    isUsingKeyboard = false;
    document.body.classList.remove('keyboard-navigation');
  });
}

/**
 * Skip links для быстрой навигации
 */
export function addSkipLinks(): void {
  const skipLinks = document.createElement('div');
  skipLinks.className = 'skip-links';
  skipLinks.innerHTML = `
    <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
    <a href="#navigation" class="skip-link">Zur Navigation springen</a>
    <a href="#footer" class="skip-link">Zum Footer springen</a>
  `;
  document.body.insertBefore(skipLinks, document.body.firstChild);
}

/**
 * Проверка, поддерживает ли браузер необходимые accessibility features
 */
export function checkBrowserAccessibilitySupport(): {
  screenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
} {
  return {
    screenReader: 'speechSynthesis' in window,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

/**
 * Получение рекомендаций по доступности на основе системных настроек
 */
export function getSystemAccessibilityPreferences(): Partial<AccessibilityPreferences> {
  const browserSupport = checkBrowserAccessibilitySupport();

  return {
    highContrast: browserSupport.highContrast,
    reducedMotion: browserSupport.reducedMotion,
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  };
}

/**
 * Валидация ARIA атрибутов
 */
export function validateAriaLabel(element: HTMLElement): boolean {
  const hasAriaLabel = element.hasAttribute('aria-label');
  const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
  const hasTextContent = !!element.textContent?.trim();

  return hasAriaLabel || hasAriaLabelledBy || hasTextContent;
}
