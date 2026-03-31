/* ==========================================================================
   Scroll Animator
   Trigger entrance animations when elements scroll into the viewport.
   Uses IntersectionObserver with staggered delays and reduced-motion support.
   Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.3
   ========================================================================== */

const AnimationConfig = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px',
  staggerDelay: 100
};

class ScrollAnimator {
  /**
   * @param {Object} [options]
   * @param {number} [options.threshold=0.15] - Visibility ratio to trigger animation (0–1)
   * @param {string} [options.rootMargin='0px 0px -60px 0px'] - Observer root margin
   * @param {number} [options.staggerDelay=100] - Milliseconds between sibling animation delays
   */
  constructor(options = {}) {
    this.threshold = options.threshold != null ? options.threshold : AnimationConfig.threshold;
    this.rootMargin = options.rootMargin != null ? options.rootMargin : AnimationConfig.rootMargin;
    this.staggerDelay = options.staggerDelay != null ? options.staggerDelay : AnimationConfig.staggerDelay;

    this._prefersReducedMotion = this._checkReducedMotion();
    this._observer = null;

    // Signal to CSS that JS scroll animations are ready
    document.documentElement.classList.add('js-scroll-ready');

    if (!this._prefersReducedMotion && this._isObserverSupported()) {
      this._observer = this._createObserver();
    }
  }

  /**
   * Check if the user prefers reduced motion.
   * Requirements 4.4, 8.4
   * @returns {boolean}
   */
  _checkReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if IntersectionObserver is available.
   * Requirement 9.3
   * @returns {boolean}
   */
  _isObserverSupported() {
    return typeof IntersectionObserver !== 'undefined';
  }

  /**
   * Create the IntersectionObserver instance.
   * On intersection, adds `.animate-in` and unobserves the element.
   * Requirements 4.1, 4.3
   * @returns {IntersectionObserver}
   */
  _createObserver() {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this._observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin
      }
    );
  }

  /**
   * Observe all elements matching the given CSS selector.
   * Applies staggered transition delays and starts observing.
   * If reduced motion is preferred or IntersectionObserver is unavailable,
   * immediately adds `.animate-in` to all matched elements.
   * Requirements 4.1, 4.2, 4.4, 4.5, 9.3
   * @param {string} selector - CSS selector for elements to animate
   */
  observe(selector) {
    var elements = document.querySelectorAll(selector);

    if (this._prefersReducedMotion || !this._observer) {
      // Immediately reveal all elements — no animation
      elements.forEach(function (el) {
        el.classList.add('animate-in');
      });
      return;
    }

    // Stagger delays and observe each element
    var self = this;
    elements.forEach(function (el, index) {
      el.style.transitionDelay = (index * self.staggerDelay) + 'ms';
      self._observer.observe(el);
    });
  }

  /**
   * Disconnect the observer and clean up.
   */
  destroy() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}
