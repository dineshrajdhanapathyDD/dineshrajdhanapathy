/* ==========================================================================
   Theme Switcher
   Toggle between light and dark themes with persistence and system preference.
   Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8
   ========================================================================== */

/**
 * @typedef {'light' | 'dark'} Theme
 */

const ThemeConfig = {
  light: 'light',
  dark: 'dark',
  storageKey: 'portfolio-theme',
  transitionDuration: 300,
  defaultTheme: 'light'
};

class ThemeSwitcher {
  /**
   * @param {string} toggleSelector - CSS selector for the toggle button
   */
  constructor(toggleSelector) {
    this.toggleSelector = toggleSelector;
    this.toggleButton = null;
    /** @type {Theme} */
    this._memoryTheme = null;
    this._storageAvailable = this._checkStorageAvailable();
  }

  /**
   * Check if localStorage is available (may throw in private browsing).
   * @returns {boolean}
   */
  _checkStorageAvailable() {
    try {
      const testKey = '__theme_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Detect system color scheme preference.
   * Requirement 2.4
   * @returns {Theme}
   */
  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return ThemeConfig.dark;
    }
    return ThemeConfig.light;
  }

  /**
   * Read saved preference from localStorage with validation.
   * Returns null if no valid preference is stored or storage is unavailable.
   * Requirements 2.3, 2.8
   * @returns {Theme | null}
   */
  getSavedPreference() {
    if (!this._storageAvailable) {
      return this._memoryTheme;
    }
    try {
      const saved = localStorage.getItem(ThemeConfig.storageKey);
      if (saved === ThemeConfig.light || saved === ThemeConfig.dark) {
        return saved;
      }
      return null;
    } catch (e) {
      return this._memoryTheme;
    }
  }

  /**
   * Apply a theme: set data-theme on <html>, persist to storage, update icon.
   * Requirements 2.1, 2.2, 2.6
   * @param {Theme} theme
   */
  applyTheme(theme) {
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', theme);

    // Remove transition class after animation
    setTimeout(function() {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);

    // Persist to localStorage or fall back to memory
    if (this._storageAvailable) {
      try {
        localStorage.setItem(ThemeConfig.storageKey, theme);
      } catch (e) {
        this._memoryTheme = theme;
      }
    } else {
      this._memoryTheme = theme;
    }

    this._updateToggleButton(theme);
  }

  /**
   * Toggle between light and dark themes.
   * Requirement 2.1
   */
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === ThemeConfig.dark ? ThemeConfig.light : ThemeConfig.dark;
    this.applyTheme(next);
  }

  /**
   * Initialize the theme switcher on page load.
   * Priority: saved preference → system preference → default "light".
   * Requirements 2.3, 2.4, 2.5, 2.7
   */
  init() {
    this.toggleButton = document.querySelector(this.toggleSelector);

    const saved = this.getSavedPreference();
    const system = this.getSystemPreference();
    const theme = saved || system || ThemeConfig.defaultTheme;
    this.applyTheme(theme);

    this._bindToggle();
    this._listenForSystemChanges();
  }

  /**
   * Update the toggle button icon to reflect the active theme.
   * Requirement 2.6
   * @param {Theme} theme
   */
  _updateToggleButton(theme) {
    if (!this.toggleButton) return;

    const lightIcon = this.toggleButton.querySelector('.theme-toggle__icon--light');
    const darkIcon = this.toggleButton.querySelector('.theme-toggle__icon--dark');

    if (lightIcon && darkIcon) {
      if (theme === ThemeConfig.dark) {
        lightIcon.style.display = 'none';
        darkIcon.style.display = '';
      } else {
        lightIcon.style.display = '';
        darkIcon.style.display = 'none';
      }
    }

    this.toggleButton.setAttribute(
      'aria-label',
      theme === ThemeConfig.dark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  /**
   * Bind click handler to the toggle button.
   */
  _bindToggle() {
    if (!this.toggleButton) return;
    this.toggleButton.addEventListener('click', () => {
      this.toggle();
    });
  }

  /**
   * Listen for system prefers-color-scheme changes.
   * Only applies if the user has no saved preference.
   * Requirement 2.4
   */
  _listenForSystemChanges() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only follow system changes when there's no explicit saved preference
      if (!this.getSavedPreference()) {
        this.applyTheme(e.matches ? ThemeConfig.dark : ThemeConfig.light);
      }
    });
  }
}
