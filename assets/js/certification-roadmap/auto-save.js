/**
 * Cloud Certification Roadmap - Auto Save Module
 * 
 * This module handles automatic data saving and session restoration for the Cloud Certification Roadmap feature.
 */

// Auto Save Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.AutoSave = (function() {
    // Private variables
    const AUTO_SAVE_INTERVAL = 60000; // 1 minute
    const SESSION_KEY = 'certificationRoadmap.session';
    let autoSaveTimer = null;
    let isAutoSaveEnabled = true;
    
    // Private functions
    function initializeAutoSave() {
        return new Promise((resolve, reject) => {
            try {
                // Load settings
                const settings = window.CertificationRoadmap.StorageService.loadSettings() || {};
                
                // Check if auto-save is enabled in settings
                isAutoSaveEnabled = settings.autoSave !== false;
                
                // Start auto-save timer if enabled
                if (isAutoSaveEnabled) {
                    startAutoSaveTimer();
                }
                
                // Set up event listeners for data changes
                setupDataChangeListeners();
                
                resolve();
            } catch (error) {
                console.error('Error initializing auto-save:', error);
                reject(error);
            }
        });
    }
    
    function startAutoSaveTimer() {
        // Clear existing timer if any
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
        }
        
        // Start new timer
        autoSaveTimer = setInterval(() => {
            saveCurrentSession();
        }, AUTO_SAVE_INTERVAL);
        
        console.log('Auto-save timer started');
    }
    
    function stopAutoSaveTimer() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
            console.log('Auto-save timer stopped');
        }
    }
    
    function setupDataChangeListeners() {
        // Listen for assessment completion
        document.addEventListener('assessment-complete', function(event) {
            if (isAutoSaveEnabled) {
                saveCurrentSession();
            }
        });
        
        // Listen for career goals completion
        document.addEventListener('career-goals-complete', function(event) {
            if (isAutoSaveEnabled) {
                saveCurrentSession();
            }
        });
        
        // Listen for roadmap generation
        document.addEventListener('roadmap-generated', function(event) {
            if (isAutoSaveEnabled) {
                saveCurrentSession();
            }
        });
        
        // Listen for study plan generation
        document.addEventListener('study-plan-generated', function(event) {
            if (isAutoSaveEnabled) {
                saveCurrentSession();
            }
        });
        
        // Listen for resource saving
        document.addEventListener('resource-saved', function(event) {
            if (isAutoSaveEnabled) {
                saveCurrentSession();
            }
        });
    }
    
    function saveCurrentSession() {
        try {
            // Get current data
            const assessment = window.CertificationRoadmap.StorageService.loadAssessment();
            const careerGoals = window.CertificationRoadmap.StorageService.loadCareerGoals();
            const roadmap = window.CertificationRoadmap.StorageService.loadRoadmap();
            const studyPlan = window.CertificationRoadmap.StorageService.loadStudyPlan();
            const resources = window.CertificationRoadmap.StorageService.loadResourceData();
            const savedResources = window.CertificationRoadmap.StorageService.loadSavedResources();
            
            // Get current step
            const currentStep = getCurrentStep();
            
            // Create session data
            const sessionData = {
                timestamp: new Date(),
                currentStep: currentStep,
                hasAssessment: !!assessment,
                hasCareerGoals: !!careerGoals,
                hasRoadmap: !!roadmap,
                hasStudyPlan: !!studyPlan,
                hasResources: !!resources,
                hasSavedResources: !!savedResources
            };
            
            // Save session data
            window.CertificationRoadmap.StorageService.saveSession(sessionData);
            
            console.log('Session saved:', sessionData);
            return true;
        } catch (error) {
            console.error('Error saving session:', error);
            return false;
        }
    }
    
    function getCurrentStep() {
        // Get active step from UI
        const activeStep = document.querySelector('.certification-roadmap-workflow__step--active');
        if (activeStep) {
            return activeStep.getAttribute('data-step');
        }
        
        // Default to welcome step
        return 'welcome';
    }
    
    function restoreSession() {
        try {
            // Get session data
            const sessionData = window.CertificationRoadmap.StorageService.loadSession();
            
            if (!sessionData) {
                console.log('No session data found');
                return false;
            }
            
            console.log('Restoring session:', sessionData);
            
            // Check if we have data to restore
            const hasData = sessionData.hasAssessment || 
                           sessionData.hasCareerGoals || 
                           sessionData.hasRoadmap || 
                           sessionData.hasStudyPlan;
            
            if (!hasData) {
                console.log('No data to restore');
                return false;
            }
            
            // Dispatch session restore event
            const event = new CustomEvent('session-restore', {
                detail: {
                    sessionData: sessionData
                }
            });
            
            document.dispatchEvent(event);
            
            return true;
        } catch (error) {
            console.error('Error restoring session:', error);
            return false;
        }
    }
    
    function setAutoSaveEnabled(enabled) {
        isAutoSaveEnabled = enabled;
        
        // Update settings
        const settings = window.CertificationRoadmap.StorageService.loadSettings() || {};
        settings.autoSave = enabled;
        window.CertificationRoadmap.StorageService.saveSettings(settings);
        
        // Start or stop timer
        if (enabled) {
            startAutoSaveTimer();
        } else {
            stopAutoSaveTimer();
        }
    }
    
    // Public API
    return {
        /**
         * Initialize the auto-save module
         * @returns {Promise} A promise that resolves when initialization is complete
         */
        initAutoSave: function() {
            return initializeAutoSave();
        },
        
        /**
         * Save the current session
         * @returns {Boolean} True if save was successful
         */
        saveSession: function() {
            return saveCurrentSession();
        },
        
        /**
         * Restore the previous session
         * @returns {Boolean} True if restore was successful
         */
        restoreSession: function() {
            return restoreSession();
        },
        
        /**
         * Enable or disable auto-save
         * @param {Boolean} enabled - Whether auto-save should be enabled
         */
        setAutoSaveEnabled: function(enabled) {
            setAutoSaveEnabled(enabled);
        },
        
        /**
         * Check if auto-save is enabled
         * @returns {Boolean} True if auto-save is enabled
         */
        isAutoSaveEnabled: function() {
            return isAutoSaveEnabled;
        }
    };
})();