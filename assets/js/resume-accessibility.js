/**
 * Resume Match Accessibility Module
 * 
 * This module enhances the accessibility of the Smart Resume Match feature,
 * providing keyboard navigation, screen reader support, and other accessibility features.
 */

window.ResumeAccessibilityModule = (function() {
    'use strict';

    /**
     * Initialize accessibility features for the Resume Match feature
     */
    function init() {
        // Add ARIA attributes to key elements
        addAriaAttributes();
        
        // Set up keyboard navigation
        setupKeyboardNavigation();
        
        // Add focus management
        setupFocusManagement();
        
        // Add screen reader announcements
        setupScreenReaderAnnouncements();
    }

    /**
     * Add ARIA attributes to key elements
     */
    function addAriaAttributes() {
        // Add ARIA attributes to the file upload section
        const dropzone = document.getElementById('resume-dropzone');
        if (dropzone) {
            dropzone.setAttribute('role', 'button');
            dropzone.setAttribute('tabindex', '0');
            dropzone.setAttribute('aria-label', 'Upload resume by clicking or dragging a file here');
        }
        
        // Add ARIA attributes to the workflow steps
        const workflowSteps = document.querySelectorAll('.resume-workflow__step');
        workflowSteps.forEach((step, index) => {
            step.setAttribute('role', 'tab');
            step.setAttribute('tabindex', '0');
            step.setAttribute('aria-selected', step.classList.contains('resume-workflow__step--active') ? 'true' : 'false');
            step.setAttribute('aria-controls', `${step.dataset.step}-section`);
            step.setAttribute('id', `workflow-step-${step.dataset.step}`);
        });
        
        // Add ARIA attributes to the result sections
        const resultSections = document.querySelectorAll('.resume-section');
        resultSections.forEach(section => {
            section.setAttribute('role', 'tabpanel');
            section.setAttribute('aria-labelledby', `workflow-step-${section.id.replace('-section', '')}`);
        });
        
        // Add ARIA live regions for dynamic content
        const analysisContent = document.querySelector('.resume-analysis__content');
        if (analysisContent) {
            analysisContent.setAttribute('aria-live', 'polite');
        }
        
        const jobMatchContent = document.querySelector('.job-match__content');
        if (jobMatchContent) {
            jobMatchContent.setAttribute('aria-live', 'polite');
        }
        
        const tailoringContent = document.querySelector('.resume-tailoring__content');
        if (tailoringContent) {
            tailoringContent.setAttribute('aria-live', 'polite');
        }
        
        const atsContent = document.querySelector('.ats-compatibility__content');
        if (atsContent) {
            atsContent.setAttribute('aria-live', 'polite');
        }
    }

    /**
     * Set up keyboard navigation
     */
    function setupKeyboardNavigation() {
        // Add keyboard support for the dropzone
        const dropzone = document.getElementById('resume-dropzone');
        if (dropzone) {
            dropzone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('resume-file-input').click();
                }
            });
        }
        
        // Add keyboard support for workflow steps
        const workflowSteps = document.querySelectorAll('.resume-workflow__step');
        workflowSteps.forEach(step => {
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (window.ResumeMatch && window.ResumeMatch.canNavigateToStep(step.dataset.step)) {
                        window.ResumeMatch.navigateToStep(step.dataset.step);
                    }
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextStep = step.nextElementSibling;
                    if (nextStep && nextStep.classList.contains('resume-workflow__step')) {
                        nextStep.focus();
                    }
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevStep = step.previousElementSibling;
                    if (prevStep && prevStep.classList.contains('resume-workflow__step')) {
                        prevStep.focus();
                    }
                }
            });
        });
        
        // Add keyboard support for action buttons
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open dialogs or overlays
                const activeOverlays = document.querySelectorAll('.resume-overlay.active');
                if (activeOverlays.length > 0) {
                    activeOverlays.forEach(overlay => {
                        overlay.classList.remove('active');
                    });
                    return;
                }
            }
        });
    }

    /**
     * Set up focus management
     */
    function setupFocusManagement() {
        // Track focus state for keyboard users
        document.addEventListener('keydown', () => {
            document.body.classList.add('keyboard-user');
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-user');
        });
        
        // Add focus styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-user :focus {
                outline: 2px solid var(--resume-primary) !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-user .resume-workflow__step:focus {
                outline: 2px solid var(--resume-primary) !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-user button:focus {
                outline: 2px solid var(--resume-primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Set initial focus when navigating to a new step
        const originalNavigateToStep = window.ResumeMatch.navigateToStep;
        if (originalNavigateToStep) {
            window.ResumeMatch.navigateToStep = function(stepName) {
                originalNavigateToStep.call(window.ResumeMatch, stepName);
                
                // Set focus to the appropriate element
                setTimeout(() => {
                    const section = document.getElementById(`${stepName}-section`);
                    if (section) {
                        const heading = section.querySelector('h2');
                        if (heading) {
                            heading.setAttribute('tabindex', '-1');
                            heading.focus();
                        }
                    }
                }, 100);
            };
        }
    }

    /**
     * Set up screen reader announcements
     */
    function setupScreenReaderAnnouncements() {
        // Create a live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.classList.add('sr-only');
        document.body.appendChild(liveRegion);
        
        // Function to announce messages to screen readers
        window.announceToScreenReader = function(message) {
            liveRegion.textContent = '';
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        };
        
        // Announce when file upload is successful
        const originalProcessResume = window.ResumeMatch.processResume;
        if (originalProcessResume) {
            window.ResumeMatch.processResume = function(file) {
                originalProcessResume.call(window.ResumeMatch, file);
                window.announceToScreenReader(`Resume ${file.name} uploaded successfully. Processing resume...`);
            };
        }
        
        // Announce when analysis is complete
        const originalRenderAnalysisResults = window.ResumeMatch.renderAnalysisResults;
        if (originalRenderAnalysisResults) {
            window.ResumeMatch.renderAnalysisResults = function() {
                originalRenderAnalysisResults.call(window.ResumeMatch);
                const score = window.ResumeMatch.state.analysisResults.completionScore;
                window.announceToScreenReader(`Resume analysis complete. Overall score: ${score} percent.`);
            };
        }
        
        // Announce when job matches are displayed
        const originalRenderJobMatches = window.ResumeMatch.renderJobMatches;
        if (originalRenderJobMatches) {
            window.ResumeMatch.renderJobMatches = function() {
                originalRenderJobMatches.call(window.ResumeMatch);
                const matches = window.ResumeMatch.state.jobMatches.jobMatches.length;
                window.announceToScreenReader(`Job matches found: ${matches}. Top match: ${window.ResumeMatch.state.jobMatches.jobMatches[0].jobTitle} with ${window.ResumeMatch.state.jobMatches.jobMatches[0].matchScore} percent match.`);
            };
        }
    }

    /**
     * Add skip links for keyboard users
     */
    function addSkipLinks() {
        // Create skip links
        const skipLinks = document.createElement('div');
        skipLinks.classList.add('resume-skip-links');
        
        // Skip to upload
        const skipToUpload = document.createElement('a');
        skipToUpload.href = '#resume-upload-title';
        skipToUpload.textContent = 'Skip to resume upload';
        skipToUpload.classList.add('resume-skip-link');
        
        // Skip to results
        const skipToResults = document.createElement('a');
        skipToResults.href = '#results-container';
        skipToResults.textContent = 'Skip to results';
        skipToResults.classList.add('resume-skip-link');
        
        // Add skip links to the page
        skipLinks.appendChild(skipToUpload);
        skipLinks.appendChild(skipToResults);
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Add styles for skip links
        const style = document.createElement('style');
        style.textContent = `
            .resume-skip-links {
                position: absolute;
                top: -1000px;
                left: -1000px;
                height: 1px;
                width: 1px;
                overflow: hidden;
            }
            
            .resume-skip-link {
                position: absolute;
                top: -1000px;
                left: -1000px;
                height: 1px;
                width: 1px;
                overflow: hidden;
                background-color: var(--resume-primary);
                color: white;
                padding: 10px 15px;
                z-index: 9999;
                text-decoration: none;
                font-weight: bold;
            }
            
            .resume-skip-link:focus {
                top: 10px;
                left: 10px;
                height: auto;
                width: auto;
                overflow: visible;
                outline: 2px solid var(--resume-primary-dark);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add reduced motion support
     */
    function addReducedMotionSupport() {
        // Add styles for reduced motion
        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-reduced-motion: reduce) {
                .fade-in {
                    animation: none !important;
                }
                
                .resume-workflow__step {
                    transition: none !important;
                }
                
                .resume-upload__dropzone {
                    transition: none !important;
                }
                
                .resume-upload__button {
                    transition: none !important;
                }
                
                .resume-upload__progress-bar {
                    transition: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when the module is loaded
    document.addEventListener('DOMContentLoaded', () => {
        init();
        addSkipLinks();
        addReducedMotionSupport();
    });

    // Public API
    return {
        init,
        announceToScreenReader: window.announceToScreenReader
    };
})();