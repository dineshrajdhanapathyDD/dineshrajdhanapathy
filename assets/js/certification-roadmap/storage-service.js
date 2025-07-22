/**
 * Cloud Certification Roadmap - Storage Service
 * 
 * This module handles data persistence for the Cloud Certification Roadmap feature.
 * It provides functions for saving and retrieving data from local storage.
 */

// Storage Service Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.StorageService = (function() {
    // Private variables
    const STORAGE_KEYS = {
        ASSESSMENT: 'certificationRoadmap.assessment',
        CAREER_GOALS: 'certificationRoadmap.careerGoals',
        ROADMAP: 'certificationRoadmap.roadmap',
        STUDY_PLAN: 'certificationRoadmap.studyPlan',
        RESOURCES: 'certificationRoadmap.resources',
        SETTINGS: 'certificationRoadmap.settings',
        VERSION: 'certificationRoadmap.version',
        SESSION: 'certificationRoadmap.session',
        SAVED_RESOURCES: 'certificationRoadmap.savedResources',
        DATA_INTEGRITY: 'certificationRoadmap.dataIntegrity'
    };
    
    const CURRENT_VERSION = '1.0.0';
    
    // Private functions
    function isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    function getStorageItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error retrieving item from storage (${key}):`, error);
            return null;
        }
    }
    
    function setStorageItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving item to storage (${key}):`, error);
            return false;
        }
    }
    
    function removeStorageItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing item from storage (${key}):`, error);
            return false;
        }
    }
    
    // Public API
    return {
        /**
         * Initialize the storage service
         * @returns {Promise} A promise that resolves when initialization is complete
         */
        initStorage: function() {
            return new Promise((resolve, reject) => {
                if (!isLocalStorageAvailable()) {
                    reject(new Error('Local storage is not available'));
                    return;
                }
                
                // Check version and perform migrations if needed
                const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
                
                if (!storedVersion) {
                    // First time setup
                    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
                } else if (storedVersion !== CURRENT_VERSION) {
                    // Version mismatch, perform migration
                    this.migrateData(storedVersion, CURRENT_VERSION);
                    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
                }
                
                resolve();
            });
        },
        
        /**
         * Migrate data between versions
         * @param {String} fromVersion - The current version
         * @param {String} toVersion - The target version
         * @returns {Boolean} True if migration was successful
         */
        migrateData: function(fromVersion, toVersion) {
            console.log(`Migrating data from version ${fromVersion} to ${toVersion}`);
            
            // Implement version-specific migrations here
            // For now, we just return true as there are no migrations yet
            return true;
        },
        
        /**
         * Save assessment data to local storage
         * @param {Object} data - The assessment data to save
         * @returns {Boolean} True if save was successful
         */
        saveAssessment: function(data) {
            if (!data) return false;
            
            // Validate data
            const validation = window.CertificationRoadmap.DataModels.validateAssessment(data);
            if (!validation.isValid) {
                console.error('Invalid assessment data:', validation.errors);
                return false;
            }
            
            return setStorageItem(STORAGE_KEYS.ASSESSMENT, data);
        },
        
        /**
         * Load assessment data from local storage
         * @returns {Object|null} The loaded assessment data or null if not found
         */
        loadAssessment: function() {
            const data = getStorageItem(STORAGE_KEYS.ASSESSMENT);
            
            if (!data) return null;
            
            // Convert date strings to Date objects
            return window.CertificationRoadmap.DataModels.convertDates(data);
        },
        
        /**
         * Save career goals data to local storage
         * @param {Object} data - The career goals data to save
         * @returns {Boolean} True if save was successful
         */
        saveCareerGoals: function(data) {
            if (!data) return false;
            
            // Validate data
            const validation = window.CertificationRoadmap.DataModels.validateCareerGoals(data);
            if (!validation.isValid) {
                console.error('Invalid career goals data:', validation.errors);
                return false;
            }
            
            return setStorageItem(STORAGE_KEYS.CAREER_GOALS, data);
        },
        
        /**
         * Load career goals data from local storage
         * @returns {Object|null} The loaded career goals data or null if not found
         */
        loadCareerGoals: function() {
            const data = getStorageItem(STORAGE_KEYS.CAREER_GOALS);
            
            if (!data) return null;
            
            // Convert date strings to Date objects
            return window.CertificationRoadmap.DataModels.convertDates(data);
        },
        
        /**
         * Save roadmap data to local storage
         * @param {Object} data - The roadmap data to save
         * @returns {Boolean} True if save was successful
         */
        saveRoadmap: function(data) {
            if (!data) return false;
            
            // Validate data
            const validation = window.CertificationRoadmap.DataModels.validateRoadmap(data);
            if (!validation.isValid) {
                console.error('Invalid roadmap data:', validation.errors);
                return false;
            }
            
            return setStorageItem(STORAGE_KEYS.ROADMAP, data);
        },
        
        /**
         * Load roadmap data from local storage
         * @returns {Object|null} The loaded roadmap data or null if not found
         */
        loadRoadmap: function() {
            const data = getStorageItem(STORAGE_KEYS.ROADMAP);
            
            if (!data) return null;
            
            // Convert date strings to Date objects
            return window.CertificationRoadmap.DataModels.convertDates(data);
        },
        
        /**
         * Save study plan data to local storage
         * @param {Object} data - The study plan data to save
         * @returns {Boolean} True if save was successful
         */
        saveStudyPlan: function(data) {
            if (!data) return false;
            
            // Validate data
            const validation = window.CertificationRoadmap.DataModels.validateStudyPlan(data);
            if (!validation.isValid) {
                console.error('Invalid study plan data:', validation.errors);
                return false;
            }
            
            return setStorageItem(STORAGE_KEYS.STUDY_PLAN, data);
        },
        
        /**
         * Load study plan data from local storage
         * @returns {Object|null} The loaded study plan data or null if not found
         */
        loadStudyPlan: function() {
            const data = getStorageItem(STORAGE_KEYS.STUDY_PLAN);
            
            if (!data) return null;
            
            // Convert date strings to Date objects
            return window.CertificationRoadmap.DataModels.convertDates(data);
        },
        
        /**
         * Save settings data to local storage
         * @param {Object} data - The settings data to save
         * @returns {Boolean} True if save was successful
         */
        saveSettings: function(data) {
            if (!data) return false;
            
            return setStorageItem(STORAGE_KEYS.SETTINGS, data);
        },
        
        /**
         * Load settings data from local storage
         * @returns {Object|null} The loaded settings data or null if not found
         */
        loadSettings: function() {
            return getStorageItem(STORAGE_KEYS.SETTINGS);
        },
        
        /**
         * Clear all data from local storage
         * @returns {Boolean} True if clear was successful
         */
        clearAllData: function() {
            try {
                Object.values(STORAGE_KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
                return true;
            } catch (error) {
                console.error('Error clearing all data:', error);
                return false;
            }
        },
        
        /**
         * Clear roadmap data from local storage
         * @returns {Boolean} True if clear was successful
         */
        clearRoadmapData: function() {
            try {
                // Remove roadmap-related data
                localStorage.removeItem(STORAGE_KEYS.ROADMAP);
                localStorage.removeItem(STORAGE_KEYS.STUDY_PLAN);
                localStorage.removeItem(STORAGE_KEYS.RESOURCES);
                
                return true;
            } catch (error) {
                console.error('Error clearing roadmap data:', error);
                return false;
            }
        },
        
        /**
         * Export all data as a JSON string
         * @returns {String|null} JSON string of all data or null if export failed
         */
        exportData: function() {
            try {
                const exportData = {
                    version: CURRENT_VERSION,
                    timestamp: new Date(),
                    assessment: this.loadAssessment(),
                    careerGoals: this.loadCareerGoals(),
                    roadmap: this.loadRoadmap(),
                    studyPlan: this.loadStudyPlan(),
                    settings: this.loadSettings()
                };
                
                return JSON.stringify(exportData);
            } catch (error) {
                console.error('Error exporting data:', error);
                return null;
            }
        },
        
        /**
         * Import data from a JSON string
         * @param {String} jsonData - The JSON string to import
         * @returns {Boolean} True if import was successful
         */
        importData: function(jsonData) {
            try {
                if (!jsonData) return false;
                
                const data = JSON.parse(jsonData);
                
                // Validate data version
                if (!data.version) {
                    console.error('Invalid data format: missing version');
                    return false;
                }
                
                // Perform version migration if needed
                if (data.version !== CURRENT_VERSION) {
                    this.migrateData(data.version, CURRENT_VERSION);
                }
                
                // Import each data type
                if (data.assessment) {
                    this.saveAssessment(data.assessment);
                }
                
                if (data.careerGoals) {
                    this.saveCareerGoals(data.careerGoals);
                }
                
                if (data.roadmap) {
                    this.saveRoadmap(data.roadmap);
                }
                
                if (data.studyPlan) {
                    this.saveStudyPlan(data.studyPlan);
                }
                
                if (data.settings) {
                    this.saveSettings(data.settings);
                }
                
                // Update version
                localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
                
                return true;
            } catch (error) {
                console.error('Error importing data:', error);
                return false;
            }
        },
        
        /**
         * Save resource data to local storage
         * @param {Object} data - The resource data to save
         * @returns {Boolean} True if save was successful
         */
        saveResourceData: function(data) {
            if (!data) return false;
            
            return setStorageItem(STORAGE_KEYS.RESOURCES, data);
        },
        
        /**
         * Load resource data from local storage
         * @returns {Object|null} The loaded resource data or null if not found
         */
        loadResourceData: function() {
            return getStorageItem(STORAGE_KEYS.RESOURCES);
        },
        
        /**
         * Export data as a file download
         */
        exportDataAsFile: function() {
            const data = this.exportData();
            if (!data) {
                console.error('Failed to export data');
                return false;
            }
            
            // Create a blob from the data
            const blob = new Blob([data], { type: 'application/json' });
            
            // Create a download link
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `certification-roadmap-data-${new Date().toISOString().slice(0, 10)}.json`;
            
            // Append to body, click, and remove
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            URL.revokeObjectURL(a.href);
            
            return true;
        },
        
        /**
         * Import data from a file
         * @param {File} file - File object to import
         * @returns {Promise} Promise that resolves when import is complete
         */
        importDataFromFile: function(file) {
            return new Promise((resolve, reject) => {
                if (!file) {
                    reject(new Error('No file provided'));
                    return;
                }
                
                // Check file type
                if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                    reject(new Error('Invalid file type. Please select a JSON file.'));
                    return;
                }
                
                // Read file
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    try {
                        const jsonData = event.target.result;
                        const success = this.importData(jsonData);
                        
                        if (success) {
                            resolve();
                        } else {
                            reject(new Error('Failed to import data'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    reject(new Error('Error reading file'));
                };
                
                reader.readAsText(file);
            });
        },
        
        /**
         * Save saved resources
         * @param {Array} resources - Array of saved resources
         */
        saveSavedResources: function(resources) {
            if (!resources) return;
            
            try {
                localStorage.setItem(STORAGE_KEYS.SAVED_RESOURCES, JSON.stringify(resources));
            } catch (error) {
                console.error('Error saving saved resources:', error);
            }
        },
        
        /**
         * Load saved resources
         * @returns {Array} Array of saved resources
         */
        loadSavedResources: function() {
            try {
                const savedResources = localStorage.getItem(STORAGE_KEYS.SAVED_RESOURCES);
                return savedResources ? JSON.parse(savedResources) : [];
            } catch (error) {
                console.error('Error loading saved resources:', error);
                return [];
            }
        },
        
        /**
         * Save session data to local storage
         * @param {Object} data - The session data to save
         * @returns {Boolean} True if save was successful
         */
        saveSession: function(data) {
            if (!data) return false;
            
            // Add timestamp
            data.timestamp = new Date().toISOString();
            
            return setStorageItem(STORAGE_KEYS.SESSION, data);
        },
        
        /**
         * Load session data from local storage
         * @returns {Object|null} The loaded session data or null if not found
         */
        loadSession: function() {
            const data = getStorageItem(STORAGE_KEYS.SESSION);
            
            if (!data) return null;
            
            // Convert timestamp string to Date object
            if (data.timestamp) {
                data.timestamp = new Date(data.timestamp);
            }
            
            return data;
        },
        
        /**
         * Calculate and save data integrity hash
         * @returns {Boolean} True if save was successful
         */
        saveDataIntegrity: function() {
            try {
                // Create a simple hash of all data
                const assessment = getStorageItem(STORAGE_KEYS.ASSESSMENT);
                const careerGoals = getStorageItem(STORAGE_KEYS.CAREER_GOALS);
                const roadmap = getStorageItem(STORAGE_KEYS.ROADMAP);
                const studyPlan = getStorageItem(STORAGE_KEYS.STUDY_PLAN);
                const resources = getStorageItem(STORAGE_KEYS.RESOURCES);
                const savedResources = getStorageItem(STORAGE_KEYS.SAVED_RESOURCES);
                
                // Create a simple hash by combining all data
                const dataString = JSON.stringify({
                    assessment,
                    careerGoals,
                    roadmap,
                    studyPlan,
                    resources,
                    savedResources
                });
                
                // Use a simple hash function
                let hash = 0;
                for (let i = 0; i < dataString.length; i++) {
                    const char = dataString.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                
                const integrityData = {
                    hash: hash.toString(),
                    timestamp: new Date().toISOString()
                };
                
                return setStorageItem(STORAGE_KEYS.DATA_INTEGRITY, integrityData);
            } catch (error) {
                console.error('Error saving data integrity:', error);
                return false;
            }
        },
        
        /**
         * Check data integrity
         * @returns {Boolean} True if data integrity is valid
         */
        checkDataIntegrity: function() {
            try {
                const integrityData = getStorageItem(STORAGE_KEYS.DATA_INTEGRITY);
                
                if (!integrityData || !integrityData.hash) {
                    return false;
                }
                
                // Calculate current hash
                const assessment = getStorageItem(STORAGE_KEYS.ASSESSMENT);
                const careerGoals = getStorageItem(STORAGE_KEYS.CAREER_GOALS);
                const roadmap = getStorageItem(STORAGE_KEYS.ROADMAP);
                const studyPlan = getStorageItem(STORAGE_KEYS.STUDY_PLAN);
                const resources = getStorageItem(STORAGE_KEYS.RESOURCES);
                const savedResources = getStorageItem(STORAGE_KEYS.SAVED_RESOURCES);
                
                // Create a simple hash by combining all data
                const dataString = JSON.stringify({
                    assessment,
                    careerGoals,
                    roadmap,
                    studyPlan,
                    resources,
                    savedResources
                });
                
                // Use a simple hash function
                let hash = 0;
                for (let i = 0; i < dataString.length; i++) {
                    const char = dataString.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                
                // Compare hashes
                return integrityData.hash === hash.toString();
            } catch (error) {
                console.error('Error checking data integrity:', error);
                return false;
            }
        },
        
        /**
         * Check if data exists in local storage
         * @returns {Object} Object with boolean flags for each data type
         */
        checkDataExists: function() {
            return {
                assessment: !!getStorageItem(STORAGE_KEYS.ASSESSMENT),
                careerGoals: !!getStorageItem(STORAGE_KEYS.CAREER_GOALS),
                roadmap: !!getStorageItem(STORAGE_KEYS.ROADMAP),
                studyPlan: !!getStorageItem(STORAGE_KEYS.STUDY_PLAN),
                resources: !!getStorageItem(STORAGE_KEYS.RESOURCES),
                settings: !!getStorageItem(STORAGE_KEYS.SETTINGS),
                savedResources: !!getStorageItem(STORAGE_KEYS.SAVED_RESOURCES),
                session: !!getStorageItem(STORAGE_KEYS.SESSION)
            };
        }
    };
})();