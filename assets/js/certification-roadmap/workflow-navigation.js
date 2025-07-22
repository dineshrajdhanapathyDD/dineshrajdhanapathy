/**
 * Cloud Certification Roadmap - Workflow Navigation
 * 
 * This module handles navigation between workflow steps with keyboard support.
 */

// Workflow Navigation Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.WorkflowNavigation = (function() {
    // Private variables
    let workflowSteps = [];
    let currentStepIndex = 0;
    
    // Private functions
    function initWorkflowNavigation() {
        // Get all workflow steps
        workflowSteps = Array.from(document.querySelectorAll('.certification-roadmap-workflow__step'));
        
        if (!workflowSteps.length) return;
        
        // Find current step index
        const activeStep = document.querySelector('.certification-roadmap-workflow__step--active');
        if (activeStep) {
            currentStepIndex = workflowSteps.indexOf(activeStep);
        }
        
        // Add click event listeners
        workflowSteps.forEach((step, index) => {
            // Add click event
            step.addEventListener('click', function() {
                const stepName = this.getAttribute('data-step');
                if (stepName) {
                    navigateToStep(stepName);
                }
            });
            
            // Add keyboard event
            step.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const stepName = this.getAttribute('data-step');
                    if (stepName) {
                        navigateToStep(stepName);
                    }
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % workflowSteps.length;
                    workflowSteps[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + workflowSteps.length) % workflowSteps.length;
                    workflowSteps[prevIndex].focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    workflowSteps[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    workflowSteps[workflowSteps.length - 1].focus();
                }
            });
        });
    }
    
    function navigateToStep(step) {
        // Dispatch custom event for step navigation
        const event = new CustomEvent('navigate-to-step', {
            detail: {
                step: step
            }
        });
        document.dispatchEvent(event);
    }
    
    // Public API
    return {
        /**
         * Initialize workflow navigation
         */
        init: function() {
            initWorkflowNavigation();
        }
    };
})();

// Initialize workflow navigation
document.addEventListener('DOMContentLoaded', function() {
    window.CertificationRoadmap.WorkflowNavigation.init();
});