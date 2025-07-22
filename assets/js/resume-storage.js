/**
 * Resume Storage Module
 * 
 * This module handles the storage and retrieval of resume data using browser storage mechanisms.
 * It provides functionality for saving, retrieving, and managing resume data securely.
 */

window.ResumeStorageModule = (function() {
    'use strict';

    // Storage keys
    const STORAGE_KEYS = {
        RESUME_DATA: 'resumeMatch_resumeData',
        RESUME_HISTORY: 'resumeMatch_resumeHistory',
        LAST_ACCESSED: 'resumeMatch_lastAccessed',
        STORAGE_VERSION: 'resumeMatch_storageVersion'
    };

    // Storage version for future compatibility
    const CURRENT_STORAGE_VERSION = '1.0';

    // Maximum number of resumes to store in history
    const MAX_HISTORY_SIZE = 5;

    /**
     * Save resume data to local storage
     * @param {Object} resumeData - The resume data to save
     * @returns {Promise<boolean>} - Promise resolving to success status
     */
    function saveResume(resumeData) {
        return new Promise((resolve, reject) => {
            try {
                // Validate resume data
                if (!resumeData || !resumeData.file || !resumeData.name) {
                    reject(new Error('Invalid resume data'));
                    return;
                }
                
                // Create a storage object with essential data
                const storageData = {
                    id: generateResumeId(),
                    name: resumeData.name,
                    type: resumeData.type,
                    size: resumeData.size,
                    uploadDate: resumeData.uploadDate || new Date(),
                    lastAccessed: new Date()
                };
                
                // Store content if available (but limit size)
                if (resumeData.content) {
                    // Limit content size to prevent storage quota issues
                    const maxContentSize = 100000; // ~100KB
                    storageData.content = typeof resumeData.content === 'string' ? 
                        resumeData.content.substring(0, maxContentSize) : 
                        'Content not stored (non-string format)';
                    
                    // Add truncation notice if needed
                    if (typeof resumeData.content === 'string' && resumeData.content.length > maxContentSize) {
                        storageData.contentTruncated = true;
                    }
                }
                
                // Store analysis results if available
                if (resumeData.analysisResults) {
                    storageData.analysisResults = resumeData.analysisResults;
                }
                
                // Store job matches if available
                if (resumeData.jobMatches) {
                    storageData.jobMatches = resumeData.jobMatches;
                }
                
                // Save to local storage
                localStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(storageData));
                
                // Update resume history
                updateResumeHistory(storageData);
                
                resolve(true);
            } catch (error) {
                console.error('Error saving resume:', error);
                reject(error);
            }
        });
    }

    /**
     * Retrieve the most recent resume data from local storage
     * @returns {Promise<Object|null>} - Promise resolving to resume data or null if not found
     */
    function getResumeData() {
        return new Promise((resolve, reject) => {
            try {
                // Get resume data from local storage
                const resumeDataString = localStorage.getItem(STORAGE_KEYS.RESUME_DATA);
                
                if (!resumeDataString) {
                    resolve(null);
                    return;
                }
                
                // Parse resume data
                const resumeData = JSON.parse(resumeDataString);
                
                // Update last accessed timestamp
                resumeData.lastAccessed = new Date();
                localStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(resumeData));
                
                // Update resume history
                updateResumeHistory(resumeData);
                
                resolve(resumeData);
            } catch (error) {
                console.error('Error retrieving resume data:', error);
                reject(error);
            }
        });
    }

    /**
     * Get resume history from local storage
     * @returns {Promise<Array<Object>>} - Promise resolving to array of resume history items
     */
    function getResumeHistory() {
        return new Promise((resolve, reject) => {
            try {
                // Get resume history from local storage
                const historyString = localStorage.getItem(STORAGE_KEYS.RESUME_HISTORY);
                
                if (!historyString) {
                    resolve([]);
                    return;
                }
                
                // Parse resume history
                const history = JSON.parse(historyString);
                
                // Ensure history is an array
                if (!Array.isArray(history)) {
                    resolve([]);
                    return;
                }
                
                resolve(history);
            } catch (error) {
                console.error('Error retrieving resume history:', error);
                reject(error);
            }
        });
    }

    /**
     * Update resume history with a new resume
     * @param {Object} resumeData - The resume data to add to history
     * @private
     */
    function updateResumeHistory(resumeData) {
        try {
            // Get existing history
            const historyString = localStorage.getItem(STORAGE_KEYS.RESUME_HISTORY);
            let history = [];
            
            if (historyString) {
                history = JSON.parse(historyString);
                
                // Ensure history is an array
                if (!Array.isArray(history)) {
                    history = [];
                }
            }
            
            // Create history item
            const historyItem = {
                id: resumeData.id,
                name: resumeData.name,
                type: resumeData.type,
                uploadDate: resumeData.uploadDate,
                lastAccessed: new Date()
            };
            
            // Remove existing entry for this resume if it exists
            history = history.filter(item => item.id !== historyItem.id);
            
            // Add new entry at the beginning
            history.unshift(historyItem);
            
            // Limit history size
            if (history.length > MAX_HISTORY_SIZE) {
                history = history.slice(0, MAX_HISTORY_SIZE);
            }
            
            // Save updated history
            localStorage.setItem(STORAGE_KEYS.RESUME_HISTORY, JSON.stringify(history));
            
            // Update last accessed timestamp
            localStorage.setItem(STORAGE_KEYS.LAST_ACCESSED, new Date().toISOString());
        } catch (error) {
            console.error('Error updating resume history:', error);
        }
    }

    /**
     * Delete a resume from storage by ID
     * @param {string} resumeId - The ID of the resume to delete
     * @returns {Promise<boolean>} - Promise resolving to success status
     */
    function deleteResume(resumeId) {
        return new Promise((resolve, reject) => {
            try {
                // Get current resume data
                const resumeDataString = localStorage.getItem(STORAGE_KEYS.RESUME_DATA);
                
                if (resumeDataString) {
                    const resumeData = JSON.parse(resumeDataString);
                    
                    // If this is the current resume, remove it
                    if (resumeData.id === resumeId) {
                        localStorage.removeItem(STORAGE_KEYS.RESUME_DATA);
                    }
                }
                
                // Update history
                const historyString = localStorage.getItem(STORAGE_KEYS.RESUME_HISTORY);
                
                if (historyString) {
                    let history = JSON.parse(historyString);
                    
                    // Remove the resume from history
                    history = history.filter(item => item.id !== resumeId);
                    
                    // Save updated history
                    localStorage.setItem(STORAGE_KEYS.RESUME_HISTORY, JSON.stringify(history));
                }
                
                resolve(true);
            } catch (error) {
                console.error('Error deleting resume:', error);
                reject(error);
            }
        });
    }

    /**
     * Clear all resume data from storage
     * @returns {Promise<boolean>} - Promise resolving to success status
     */
    function clearAllResumeData() {
        return new Promise((resolve, reject) => {
            try {
                // Remove all resume data
                localStorage.removeItem(STORAGE_KEYS.RESUME_DATA);
                localStorage.removeItem(STORAGE_KEYS.RESUME_HISTORY);
                localStorage.removeItem(STORAGE_KEYS.LAST_ACCESSED);
                
                resolve(true);
            } catch (error) {
                console.error('Error clearing resume data:', error);
                reject(error);
            }
        });
    }
    
    /**
     * Initialize the storage system
     * @returns {Promise<boolean>} - Promise resolving to success status
     */
    function initStorage() {
        return new Promise((resolve, reject) => {
            try {
                // Check if storage is available
                if (!isStorageAvailable()) {
                    reject(new Error('Local storage is not available'));
                    return;
                }
                
                // Set storage version if not already set
                if (!localStorage.getItem(STORAGE_KEYS.STORAGE_VERSION)) {
                    localStorage.setItem(STORAGE_KEYS.STORAGE_VERSION, CURRENT_STORAGE_VERSION);
                }
                
                resolve(true);
            } catch (error) {
                console.error('Error initializing storage:', error);
                reject(error);
            }
        });
    }

    /**
     * Generate a unique ID for a resume
     * @returns {string} - Unique ID
     * @private
     */
    function generateResumeId() {
        return 'resume_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * Check if local storage is available
     * @returns {boolean} - Whether local storage is available
     */
    function isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Encrypt sensitive data (basic implementation)
     * @param {string} data - Data to encrypt
     * @returns {string} - Encrypted data
     * @private
     */
    function encryptData(data) {
        // This is a very basic implementation for demonstration purposes
        // In a real application, use a proper encryption library
        return btoa(data);
    }

    /**
     * Decrypt sensitive data (basic implementation)
     * @param {string} encryptedData - Encrypted data
     * @returns {string} - Decrypted data
     * @private
     */
    function decryptData(encryptedData) {
        // This is a very basic implementation for demonstration purposes
        // In a real application, use a proper encryption library
        return atob(encryptedData);
    }
    
    /**
     * Get storage usage statistics
     * @returns {Promise<Object>} - Promise resolving to storage statistics
     */
    function getStorageStats() {
        return new Promise((resolve, reject) => {
            try {
                const stats = {
                    totalItems: 0,
                    totalSize: 0,
                    resumeCount: 0,
                    historyCount: 0,
                    lastAccessed: null
                };
                
                // Count resume data
                const resumeDataString = localStorage.getItem(STORAGE_KEYS.RESUME_DATA);
                if (resumeDataString) {
                    stats.totalItems++;
                    stats.totalSize += resumeDataString.length;
                    stats.resumeCount = 1;
                }
                
                // Count history items
                const historyString = localStorage.getItem(STORAGE_KEYS.RESUME_HISTORY);
                if (historyString) {
                    stats.totalItems++;
                    stats.totalSize += historyString.length;
                    
                    const history = JSON.parse(historyString);
                    if (Array.isArray(history)) {
                        stats.historyCount = history.length;
                    }
                }
                
                // Get last accessed timestamp
                const lastAccessedString = localStorage.getItem(STORAGE_KEYS.LAST_ACCESSED);
                if (lastAccessedString) {
                    stats.totalItems++;
                    stats.totalSize += lastAccessedString.length;
                    stats.lastAccessed = new Date(lastAccessedString);
                }
                
                // Add storage version
                const versionString = localStorage.getItem(STORAGE_KEYS.STORAGE_VERSION);
                if (versionString) {
                    stats.totalItems++;
                    stats.totalSize += versionString.length;
                    stats.version = versionString;
                }
                
                // Convert size to KB
                stats.totalSizeKB = Math.round(stats.totalSize / 1024 * 100) / 100;
                
                resolve(stats);
            } catch (error) {
                console.error('Error getting storage stats:', error);
                reject(error);
            }
        });
    }

    // Public API
    return {
        saveResume,
        getResumeData,
        getResumeHistory,
        deleteResume,
        clearAllResumeData,
        isStorageAvailable,
        initStorage,
        getStorageStats
    };
})();