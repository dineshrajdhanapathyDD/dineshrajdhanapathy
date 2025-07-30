/**
 * Cloud Certification Roadmap - Initialization Script
 * 
 * This script ensures proper initialization of the certification roadmap page.
 */

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cloud Certification Roadmap - Initializing...');
    
    // Initialize basic functionality
    initializeBasicFeatures();
    
    // Initialize workflow navigation
    initializeWorkflowNavigation();
    
    // Initialize welcome step buttons
    initializeWelcomeButtons();
    
    console.log('Cloud Certification Roadmap - Initialized successfully');
});

function initializeBasicFeatures() {
    // Add loading state management
    document.body.classList.add('loaded');
    
    // Initialize smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize focus management
    initializeFocusManagement();
}

function initializeWorkflowNavigation() {
    const workflowSteps = document.querySelectorAll('.certification-roadmap-workflow__step');
    
    workflowSteps.forEach((step, index) => {
        // Make steps focusable
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.setAttribute('aria-label', `Go to step ${index + 1}: ${step.querySelector('.certification-roadmap-workflow__step-title')?.textContent || 'Step'}`);
        
        // Add click handler
        step.addEventListener('click', function() {
            const stepName = this.getAttribute('data-step');
            if (stepName) {
                navigateToStep(stepName);
            }
        });
        
        // Add keyboard support
        step.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function initializeWelcomeButtons() {
    // Start Assessment Button
    const startAssessmentBtn = document.getElementById('start-assessment-btn');
    if (startAssessmentBtn) {
        startAssessmentBtn.addEventListener('click', function() {
            navigateToStep('assessment');
            announceNavigation('Assessment step');
        });
    }
    
    // Restore Session Button
    const restoreSessionBtn = document.getElementById('restore-session-btn');
    if (restoreSessionBtn) {
        restoreSessionBtn.addEventListener('click', function() {
            // Check if there's saved data
            const hasData = checkForSavedData();
            if (hasData) {
                showRestoreDialog();
            } else {
                showNotification('No saved session found. Starting fresh assessment.', 'info');
                navigateToStep('assessment');
            }
        });
    }
    
    // Manage Data Button
    const manageDataBtn = document.getElementById('manage-data-btn');
    if (manageDataBtn) {
        manageDataBtn.addEventListener('click', function() {
            showDataManagementDialog();
        });
    }
}

function navigateToStep(stepName) {
    console.log('Navigating to step:', stepName);
    
    // Hide all steps
    const allSteps = document.querySelectorAll('.certification-roadmap__step');
    allSteps.forEach(step => {
        step.classList.remove('certification-roadmap__step--active');
        step.style.display = 'none';
    });
    
    // Show target step
    const targetStep = document.getElementById(`${stepName}-step`);
    if (targetStep) {
        targetStep.classList.add('certification-roadmap__step--active');
        targetStep.style.display = 'block';
        
        // Scroll to step
        targetStep.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Update workflow indicators
    updateWorkflowIndicators(stepName);
    
    // Update page title
    updatePageTitle(stepName);
    
    // Announce navigation for screen readers
    announceNavigation(stepName);
}

function updateWorkflowIndicators(activeStep) {
    const workflowSteps = document.querySelectorAll('.certification-roadmap-workflow__step');
    
    workflowSteps.forEach(step => {
        const stepName = step.getAttribute('data-step');
        
        // Remove all state classes
        step.classList.remove('certification-roadmap-workflow__step--active');
        step.classList.remove('certification-roadmap-workflow__step--completed');
        
        if (stepName === activeStep) {
            step.classList.add('certification-roadmap-workflow__step--active');
        }
        
        // Mark previous steps as completed
        const stepOrder = ['welcome', 'assessment', 'career-goals', 'roadmap', 'resources', 'study-plan'];
        const currentIndex = stepOrder.indexOf(activeStep);
        const stepIndex = stepOrder.indexOf(stepName);
        
        if (stepIndex < currentIndex) {
            step.classList.add('certification-roadmap-workflow__step--completed');
        }
    });
}

function updatePageTitle(stepName) {
    const stepTitles = {
        'welcome': 'Welcome',
        'assessment': 'Skill Assessment',
        'career-goals': 'Career Goals',
        'roadmap': 'Certification Roadmap',
        'resources': 'Learning Resources',
        'study-plan': 'Study Plan'
    };
    
    const stepTitle = stepTitles[stepName] || 'Cloud Certification Roadmap';
    document.title = `${stepTitle} | Cloud Certification Roadmap | Dineshraj Dhanapathy`;
}

function announceNavigation(stepName) {
    // Use accessibility enhancements if available
    if (window.CertificationRoadmap && window.CertificationRoadmap.AccessibilityEnhancements) {
        window.CertificationRoadmap.AccessibilityEnhancements.announce(`Navigated to ${stepName} step`);
    } else {
        // Fallback announcement
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Navigated to ${stepName} step`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

function checkForSavedData() {
    // Simple check for saved data in localStorage
    try {
        const assessment = localStorage.getItem('certificationRoadmap.assessment');
        const careerGoals = localStorage.getItem('certificationRoadmap.careerGoals');
        const roadmap = localStorage.getItem('certificationRoadmap.roadmap');
        
        return !!(assessment || careerGoals || roadmap);
    } catch (error) {
        console.warn('Error checking for saved data:', error);
        return false;
    }
}

function showRestoreDialog() {
    // Simple restore dialog
    const confirmed = confirm('Found saved session data. Would you like to restore your previous progress?');
    if (confirmed) {
        // Determine which step to navigate to based on saved data
        const assessment = localStorage.getItem('certificationRoadmap.assessment');
        const careerGoals = localStorage.getItem('certificationRoadmap.careerGoals');
        const roadmap = localStorage.getItem('certificationRoadmap.roadmap');
        
        if (roadmap) {
            navigateToStep('roadmap');
        } else if (careerGoals) {
            navigateToStep('career-goals');
        } else if (assessment) {
            navigateToStep('assessment');
        } else {
            navigateToStep('assessment');
        }
        
        showNotification('Session restored successfully!', 'success');
    } else {
        navigateToStep('assessment');
    }
}

function showDataManagementDialog() {
    // Simple data management options
    const options = [
        'Export Data',
        'Import Data',
        'Clear All Data',
        'Cancel'
    ];
    
    const choice = prompt(`Data Management Options:\n1. ${options[0]}\n2. ${options[1]}\n3. ${options[2]}\n4. ${options[3]}\n\nEnter your choice (1-4):`);
    
    switch (choice) {
        case '1':
            exportData();
            break;
        case '2':
            importData();
            break;
        case '3':
            clearAllData();
            break;
        default:
            // Cancel or invalid choice
            break;
    }
}

function exportData() {
    try {
        const data = {
            assessment: localStorage.getItem('certificationRoadmap.assessment'),
            careerGoals: localStorage.getItem('certificationRoadmap.careerGoals'),
            roadmap: localStorage.getItem('certificationRoadmap.roadmap'),
            studyPlan: localStorage.getItem('certificationRoadmap.studyPlan'),
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `certification-roadmap-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data. Please try again.', 'error');
    }
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Restore data to localStorage
                    if (data.assessment) localStorage.setItem('certificationRoadmap.assessment', data.assessment);
                    if (data.careerGoals) localStorage.setItem('certificationRoadmap.careerGoals', data.careerGoals);
                    if (data.roadmap) localStorage.setItem('certificationRoadmap.roadmap', data.roadmap);
                    if (data.studyPlan) localStorage.setItem('certificationRoadmap.studyPlan', data.studyPlan);
                    
                    showNotification('Data imported successfully!', 'success');
                    
                    // Refresh the page to reflect imported data
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } catch (error) {
                    console.error('Error importing data:', error);
                    showNotification('Error importing data. Please check the file format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function clearAllData() {
    const confirmed = confirm('Are you sure you want to clear all saved data? This action cannot be undone.');
    if (confirmed) {
        try {
            // Clear all certification roadmap data
            const keys = Object.keys(localStorage).filter(key => key.startsWith('certificationRoadmap.'));
            keys.forEach(key => localStorage.removeItem(key));
            
            showNotification('All data cleared successfully!', 'success');
            
            // Navigate back to welcome step
            navigateToStep('welcome');
        } catch (error) {
            console.error('Error clearing data:', error);
            showNotification('Error clearing data. Please try again.', 'error');
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}

function initializeFocusManagement() {
    // Improve focus visibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 3px solid #0066cc !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
}