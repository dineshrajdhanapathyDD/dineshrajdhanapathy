# Implementation Plan: Portfolio Redesign

## Overview

Modernize the existing static portfolio website with a design token system, glassmorphism cards, dark/light theme switching, scroll-driven entrance animations, and responsive navigation enhancements. All changes use vanilla HTML/CSS/JS with no build tools or frameworks. Implementation proceeds layer by layer: tokens → theme → components → animations → page integration → polish.

## Tasks

- [x] 1. Create the design token system and base CSS layer
  - [x] 1.1 Create `assets/css/design-tokens.css` with all CSS custom properties
    - Define brand gradients (`--gradient-primary`, `--gradient-accent`, `--gradient-hero`)
    - Define surface colors, text colors, glassmorphism tokens, soft shadows, border radii, typography, spacing scale, and transition easings on `:root`
    - Add `[data-theme="dark"]` overrides for surface colors, text colors, glass properties, and shadow values
    - Ensure all text-to-background pairings meet 4.5:1 contrast ratio in both themes
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 1.2 Write property test for design token dark theme overrides
    - **Property 4: Dark theme overrides all token values**
    - **Validates: Requirement 1.2**

  - [x] 1.3 Link `design-tokens.css` in all HTML pages before `main.css`
    - Update `index.html`, `projects.html`, `contact.html`, `404.html`, `offline.html`
    - Ensure load order: `reset.css` → `design-tokens.css` → `main.css` → other stylesheets
    - _Requirements: 1.1_

- [x] 2. Implement the theme switcher
  - [x] 2.1 Create `assets/js/theme-switcher.js` with the ThemeSwitcher class
    - Implement `getSystemPreference()` using `window.matchMedia('(prefers-color-scheme: dark)')`
    - Implement `getSavedPreference()` reading from `localStorage` key `"portfolio-theme"` with validation (must be `"light"` or `"dark"`)
    - Implement `applyTheme(theme)` setting `data-theme` on `<html>`, saving to `localStorage`, updating toggle button icon
    - Implement `toggle()` to switch between light and dark
    - Implement `init()` with priority: saved preference → system preference → default `"light"`
    - Wrap `localStorage` access in try/catch for private browsing fallback (in-memory only)
    - Listen for system `prefers-color-scheme` changes via `matchMedia.addEventListener('change', ...)`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 2.2 Write property test for theme toggle inverse
    - **Property 1: Theme toggle is its own inverse**
    - **Validates: Requirement 2.1**

  - [ ]* 2.3 Write property test for theme persistence round-trip
    - **Property 2: Theme persistence round-trip**
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 2.4 Write property test for theme validation rejects invalid values
    - **Property 3: Theme validation rejects invalid values**
    - **Validates: Requirement 2.8**

  - [x] 2.5 Add theme toggle button to the navigation in all pages
    - Add a `<button class="theme-toggle">` with sun/moon icons and `aria-label="Toggle dark mode"` to the `<nav>` in `index.html`, `projects.html`, `contact.html`, `404.html`, `offline.html`
    - Style the toggle button in `main.css` or `design-tokens.css`
    - _Requirements: 2.1, 2.6_

  - [x] 2.6 Add inline theme initialization script to prevent flash of wrong theme
    - Add a small inline `<script>` in the `<head>` of each page that reads `localStorage` and sets `data-theme` before CSS renders
    - _Requirements: 2.3, 2.7_

- [x] 3. Checkpoint - Ensure theme system works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement glassmorphism card component
  - [x] 4.1 Create glass card CSS styles
    - Add `.glass-card` base styles: semi-transparent background, `backdrop-filter: blur()`, translucent border, `var(--radius-lg)` corners, box shadow
    - Add `.glass-card--hoverable` hover state: `translateY(-4px)` and increased shadow
    - Add `@supports not (backdrop-filter: blur(1px))` fallback with solid semi-transparent background
    - Add styles to `assets/css/main.css` or a new `assets/css/components.css`
    - _Requirements: 3.1, 3.2, 3.3, 9.4_

  - [ ]* 4.2 Write property test for toggle button icon matches theme
    - **Property 6: Toggle button icon matches active theme**
    - **Validates: Requirement 2.6**

- [x] 5. Implement scroll-driven entrance animations
  - [x] 5.1 Create `assets/js/scroll-animator.js` with the ScrollAnimator class
    - Implement constructor accepting config options (threshold, rootMargin, staggerDelay)
    - Implement `observe(selector)` that queries elements, sets staggered `transitionDelay`, and observes with IntersectionObserver
    - On intersection, add `.animate-in` class and unobserve the element
    - Check `prefers-reduced-motion: reduce` — if active, immediately add `.animate-in` to all elements without observer
    - If IntersectionObserver is unavailable, immediately add `.animate-in` to all elements
    - Implement `destroy()` to disconnect observer
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.3_

  - [ ]* 5.2 Write property test for scroll animation triggers and unobserves
    - **Property 7: Scroll animation triggers and unobserves**
    - **Validates: Requirements 4.1, 4.3**

  - [ ]* 5.3 Write property test for stagger delays monotonically increasing
    - **Property 8: Stagger delays are monotonically increasing**
    - **Validates: Requirement 4.2**

  - [ ]* 5.4 Write property test for reduced motion disables all animations
    - **Property 9: Reduced motion disables all animations**
    - **Validates: Requirements 4.4, 8.4**

  - [x] 5.5 Update CSS animation classes in `main.css`
    - Ensure `.animate-on-scroll` starts with `opacity: 0` and `transform: translateY(30px)`
    - Ensure `.animate-in` transitions to `opacity: 1` and `transform: translateY(0)` using design token easings
    - Add `@media (prefers-reduced-motion: reduce)` rule that sets `.animate-on-scroll` to `opacity: 1; transform: none; transition: none`
    - Add `will-change: transform` only during animation, remove after
    - _Requirements: 4.1, 4.4, 7.1, 7.4, 8.4_

- [x] 6. Checkpoint - Ensure animations and cards work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Enhance responsive navigation
  - [x] 7.1 Update navigation JavaScript in `assets/js/main.js`
    - Ensure hamburger toggle sets `aria-expanded` correctly on open/close
    - Add Escape key handler to close menu and return focus to toggle button
    - On menu open, move focus to first menu item
    - Ensure `aria-expanded` stays synchronized with actual menu state
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 8.2_

  - [ ]* 7.2 Write property test for navigation aria-expanded matches menu state
    - **Property 10: Navigation aria-expanded matches menu state**
    - **Validates: Requirements 5.3, 5.4, 5.7**

  - [x] 7.3 Update navigation CSS for responsive breakpoints
    - Ensure hamburger toggle visible below 640px, hidden at 1024px+
    - Ensure full expanded menu at 1024px+
    - Style mobile menu with glassmorphism background using design tokens
    - _Requirements: 5.1, 5.2_

- [x] 8. Redesign the hero section
  - [x] 8.1 Update hero HTML and CSS in `index.html` and `main.css`
    - Apply `--gradient-hero` as the hero background
    - Add decorative gradient overlay and optional particle/decoration elements (aria-hidden)
    - Style profile photo with ring/glow effect using design tokens
    - Style CTA buttons with gradient (`btn--gradient`) and glass (`btn--glass`) variants
    - Add `animate-on-scroll` class to hero content elements for entrance animations
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 9. Integrate redesign across all pages
  - [x] 9.1 Update `projects.html` to use glass cards and new design tokens
    - Convert existing project cards to use `.glass-card` component
    - Add `animate-on-scroll` classes to project cards
    - Update filter buttons and search input to use design token styles
    - _Requirements: 3.1, 3.2, 4.1_

  - [x] 9.2 Update `contact.html` with new design tokens and glass card styling
    - Apply design tokens to form elements and contact info cards
    - Add `animate-on-scroll` classes to contact sections
    - _Requirements: 3.1, 4.1_

  - [x] 9.3 Update `404.html` and `offline.html` with design tokens and theme support
    - Link `design-tokens.css` and `theme-switcher.js`
    - Apply design token styles to error page content
    - _Requirements: 1.1, 2.3_

  - [x] 9.4 Add skip links and verify semantic HTML on all pages
    - Ensure skip links target `#main-content`, `#navigation`, and `#footer` on every page
    - Verify `header`, `main`, `nav`, `footer`, `section`, `article` elements have appropriate ARIA roles/labels
    - _Requirements: 8.1, 8.3_

  - [ ]* 9.5 Write property test for accessibility structure on all pages
    - **Property 11: Accessibility structure on all pages**
    - **Validates: Requirements 8.1, 8.3**

- [x] 10. Performance optimizations
  - [x] 10.1 Apply performance attributes across all pages
    - Add `loading="lazy"` to all below-fold `<img>` elements
    - Add `content-visibility: auto` CSS to below-fold sections
    - Ensure `will-change: transform` is only applied during active animations
    - Verify CSS transitions are used instead of JS-driven animations for visual effects
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 10.2 Write property test for below-fold images have lazy loading
    - **Property 12: Below-fold images have lazy loading**
    - **Validates: Requirement 7.2**

- [x] 11. Error resilience and font fallbacks
  - [x] 11.1 Implement error resilience across the site
    - Add Google Fonts `<link>` with `font-display: swap` and ensure system font fallback stack in design tokens
    - Verify `localStorage` try/catch in theme-switcher.js
    - Verify IntersectionObserver feature detection in scroll-animator.js
    - Verify `@supports` fallback for `backdrop-filter` in glass card CSS
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 12. Wire everything together and initialize
  - [x] 12.1 Update script loading and initialization in all pages
    - Add `<script src="assets/js/theme-switcher.js">` and `<script src="assets/js/scroll-animator.js">` to all pages
    - Initialize ThemeSwitcher and ScrollAnimator in `main.js` DOMContentLoaded handler
    - Call `animator.observe('.glass-card')`, `animator.observe('.section__title')`, `animator.observe('.hero__stat')`, etc.
    - Ensure no orphaned or disconnected code
    - _Requirements: 2.1, 4.1, 6.3_

  - [ ]* 12.2 Write property test for contrast compliance in both themes
    - **Property 5: Contrast compliance in both themes**
    - **Validates: Requirement 1.3**

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The site uses vanilla HTML/CSS/JS with no build tools — all files are served directly
- Existing BEM class naming is preserved where possible; new components use the design token system
