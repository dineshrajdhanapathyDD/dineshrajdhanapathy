/**
 * Cloud Certification Roadmap - Data Manager
 * 
 * This module handles the data management UI for the Cloud Certification Roadmap feature.
 */

// Data Manager Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.DataManager = (function() {
    // Private variables
    let dataManagerDialog = null;
    let backupListDialog = null;
    const BACKUP_KEY_PREFIX = 'certificationRoadmap.backup.';
    const MAX_BACKUPS = 5;
    
    // Private functions
    function createDataManagerDialog() {
        // Create dialog element
        dataManagerDialog = document.createElement('div');
        dataManagerDialog.className = 'data-manager-dialog';
        dataManagerDialog.style.display = 'none';
        dataManagerDialog.setAttribute('aria-labelledby', 'data-manager-title');
        dataManagerDialog.setAttribute('aria-describedby', 'data-manager-description');
        
        // Create dialog content
        const dialogContent = document.createElement('div');
        dialogContent.className = 'data-manager-dialog-content';
        
        // Create dialog header
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'data-manager-dialog-header';
        
        const dialogTitle = document.createElement('h3');
        dialogTitle.id = 'data-manager-title';
        dialogTitle.textContent = 'Data Management';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'data-manager-dialog-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close dialog');
        closeButton.addEventListener('click', hideDataManagerDialog);
        
        dialogHeader.appendChild(dialogTitle);
        dialogHeader.appendChild(closeButton);
        
        // Create dialog body
        const dialogBody = document.createElement('div');
        dialogBody.className = 'data-manager-dialog-body';
        
        const dialogDescription = document.createElement('p');
        dialogDescription.id = 'data-manager-description';
        dialogDescription.textContent = 'Manage your certification roadmap data. You can export, import, or clear your data.';
        dialogBody.appendChild(dialogDescription);
        
        // Check data integrity
        const isIntegrityValid = window.CertificationRoadmap.StorageService.checkDataIntegrity();
        if (!isIntegrityValid) {
            const integrityWarning = document.createElement('div');
            integrityWarning.className = 'data-integrity-warning';
            
            const warningIcon = document.createElement('span');
            warningIcon.className = 'data-integrity-warning-icon';
            warningIcon.innerHTML = '⚠️';
            
            const warningText = document.createElement('span');
            warningText.textContent = 'Data integrity check failed. Your data may be corrupted or tampered with. Consider exporting your data before making any changes.';
            
            integrityWarning.appendChild(warningIcon);
            integrityWarning.appendChild(warningText);
            
            dialogBody.appendChild(integrityWarning);
        }
        
        // Create auto-save settings section
        const autoSaveSection = document.createElement('div');
        autoSaveSection.className = 'data-manager-section';
        
        const autoSaveTitle = document.createElement('h4');
        autoSaveTitle.textContent = 'Auto-Save Settings';
        
        const autoSaveDescription = document.createElement('p');
        autoSaveDescription.textContent = 'Enable or disable automatic saving of your progress.';
        
        const autoSaveSettings = document.createElement('div');
        autoSaveSettings.className = 'auto-save-settings';
        
        const autoSaveToggle = document.createElement('input');
        autoSaveToggle.type = 'checkbox';
        autoSaveToggle.id = 'auto-save-toggle';
        autoSaveToggle.className = 'auto-save-toggle';
        autoSaveToggle.checked = window.CertificationRoadmap.AutoSave.isAutoSaveEnabled();
        
        const autoSaveLabel = document.createElement('label');
        autoSaveLabel.htmlFor = 'auto-save-toggle';
        autoSaveLabel.className = 'auto-save-label';
        autoSaveLabel.textContent = 'Enable auto-save';
        
        autoSaveToggle.addEventListener('change', function() {
            window.CertificationRoadmap.AutoSave.setAutoSaveEnabled(this.checked);
            showNotification(`Auto-save ${this.checked ? 'enabled' : 'disabled'}.`, 'info');
        });
        
        autoSaveSettings.appendChild(autoSaveToggle);
        autoSaveSettings.appendChild(autoSaveLabel);
        
        autoSaveSection.appendChild(autoSaveTitle);
        autoSaveSection.appendChild(autoSaveDescription);
        autoSaveSection.appendChild(autoSaveSettings);
        
        // Create export section
        const exportSection = document.createElement('div');
        exportSection.className = 'data-manager-section';
        
        const exportTitle = document.createElement('h4');
        exportTitle.textContent = 'Export Data';
        
        const exportDescription = document.createElement('p');
        exportDescription.textContent = 'Export all your data to a JSON file. You can use this file to backup your data or transfer it to another device.';
        
        const exportButtonsContainer = document.createElement('div');
        exportButtonsContainer.className = 'data-manager-buttons';
        
        const exportButton = document.createElement('button');
        exportButton.className = 'data-manager-button';
        exportButton.textContent = 'Export All Data';
        exportButton.addEventListener('click', () => {
            window.CertificationRoadmap.StorageService.exportDataAsFile();
            showNotification('Data exported successfully.', 'success');
        });
        
        const exportRoadmapButton = document.createElement('button');
        exportRoadmapButton.className = 'data-manager-button';
        exportRoadmapButton.textContent = 'Export Roadmap Only';
        exportRoadmapButton.addEventListener('click', () => {
            exportRoadmapOnly();
        });
        
        exportButtonsContainer.appendChild(exportButton);
        exportButtonsContainer.appendChild(exportRoadmapButton);
        
        exportSection.appendChild(exportTitle);
        exportSection.appendChild(exportDescription);
        exportSection.appendChild(exportButtonsContainer);
        
        // Create import section
        const importSection = document.createElement('div');
        importSection.className = 'data-manager-section';
        
        const importTitle = document.createElement('h4');
        importTitle.textContent = 'Import Data';
        
        const importDescription = document.createElement('p');
        importDescription.textContent = 'Import data from a JSON file. This will replace your current data.';
        
        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.id = 'data-import-input';
        importInput.accept = 'application/json';
        importInput.style.display = 'none';
        
        const importButton = document.createElement('button');
        importButton.className = 'data-manager-button';
        importButton.textContent = 'Import Data';
        importButton.addEventListener('click', () => {
            importInput.click();
        });
        
        importInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                window.CertificationRoadmap.StorageService.importDataFromFile(file)
                    .then(() => {
                        showNotification('Data imported successfully. Please refresh the page to see the changes.', 'success');
                        hideDataManagerDialog();
                    })
                    .catch((error) => {
                        showNotification(`Failed to import data: ${error.message}`, 'error');
                    });
            }
        });
        
        importSection.appendChild(importTitle);
        importSection.appendChild(importDescription);
        importSection.appendChild(importInput);
        importSection.appendChild(importButton);
        
        // Create backup section
        const backupSection = document.createElement('div');
        backupSection.className = 'data-manager-section';
        
        const backupTitle = document.createElement('h4');
        backupTitle.textContent = 'Automatic Backups';
        
        const backupDescription = document.createElement('p');
        backupDescription.textContent = 'Create and manage automatic backups of your data.';
        
        const backupButtonsContainer = document.createElement('div');
        backupButtonsContainer.className = 'data-manager-buttons';
        
        const createBackupButton = document.createElement('button');
        createBackupButton.className = 'data-manager-button';
        createBackupButton.textContent = 'Create Backup';
        createBackupButton.addEventListener('click', () => {
            createBackup();
            showNotification('Backup created successfully.', 'success');
        });
        
        const restoreBackupButton = document.createElement('button');
        restoreBackupButton.className = 'data-manager-button';
        restoreBackupButton.textContent = 'Restore Backup';
        restoreBackupButton.addEventListener('click', () => {
            showBackupList();
        });
        
        backupButtonsContainer.appendChild(createBackupButton);
        backupButtonsContainer.appendChild(restoreBackupButton);
        
        backupSection.appendChild(backupTitle);
        backupSection.appendChild(backupDescription);
        backupSection.appendChild(backupButtonsContainer);
        
        // Create cleanup section
        const cleanupSection = document.createElement('div');
        cleanupSection.className = 'data-manager-section';
        
        const cleanupTitle = document.createElement('h4');
        cleanupTitle.textContent = 'Clear Data';
        
        const cleanupDescription = document.createElement('p');
        cleanupDescription.textContent = 'Clear all your data. This action cannot be undone.';
        
        const cleanupButtonsContainer = document.createElement('div');
        cleanupButtonsContainer.className = 'data-manager-buttons';
        
        const clearAllButton = document.createElement('button');
        clearAllButton.className = 'data-manager-button data-manager-button-danger';
        clearAllButton.textContent = 'Clear All Data';
        clearAllButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
                window.CertificationRoadmap.StorageService.clearAllData();
                showNotification('All data cleared successfully. Please refresh the page to see the changes.', 'success');
                hideDataManagerDialog();
            }
        });
        
        const clearRoadmapButton = document.createElement('button');
        clearRoadmapButton.className = 'data-manager-button data-manager-button-danger';
        clearRoadmapButton.textContent = 'Clear Roadmap Only';
        clearRoadmapButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your roadmap data? This action cannot be undone.')) {
                window.CertificationRoadmap.StorageService.clearRoadmapData();
                showNotification('Roadmap data cleared successfully. Please refresh the page to see the changes.', 'success');
                hideDataManagerDialog();
            }
        });
        
        cleanupButtonsContainer.appendChild(clearAllButton);
        cleanupButtonsContainer.appendChild(clearRoadmapButton);
        
        cleanupSection.appendChild(cleanupTitle);
        cleanupSection.appendChild(cleanupDescription);
        cleanupSection.appendChild(cleanupButtonsContainer);
        
        // Assemble dialog
        dialogBody.appendChild(autoSaveSection);
        dialogBody.appendChild(exportSection);
        dialogBody.appendChild(importSection);
        dialogBody.appendChild(backupSection);
        dialogBody.appendChild(cleanupSection);
        
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(dialogBody);
        
        dataManagerDialog.appendChild(dialogContent);
        
        // Add dialog to body
        document.body.appendChild(dataManagerDialog);
    }
    
    function createBackup() {
        try {
            // Get current data
            const data = window.CertificationRoadmap.StorageService.exportData();
            if (!data) {
                showNotification('Failed to create backup: No data to backup', 'error');
                return false;
            }
            
            // Create backup timestamp
            const timestamp = new Date().toISOString();
            const backupKey = `${BACKUP_KEY_PREFIX}${timestamp}`;
            
            // Save backup
            localStorage.setItem(backupKey, data);
            
            // Manage backup limit
            const backupKeys = getBackupKeys();
            if (backupKeys.length > MAX_BACKUPS) {
                // Remove oldest backup
                const oldestKey = backupKeys[0];
                localStorage.removeItem(oldestKey);
            }
            
            return true;
        } catch (error) {
            console.error('Error creating backup:', error);
            showNotification(`Failed to create backup: ${error.message}`, 'error');
            return false;
        }
    }
    
    function getBackupKeys() {
        // Get all keys from localStorage
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(BACKUP_KEY_PREFIX)) {
                keys.push(key);
            }
        }
        
        // Sort by timestamp (oldest first)
        return keys.sort();
    }
    
    function showBackupList() {
        // Get backup keys
        const backupKeys = getBackupKeys();
        
        if (backupKeys.length === 0) {
            showNotification('No backups found.', 'info');
            return;
        }
        
        // Create dialog
        backupListDialog = document.createElement('div');
        backupListDialog.className = 'backup-list-dialog';
        backupListDialog.setAttribute('aria-labelledby', 'backup-list-title');
        
        const dialogContent = document.createElement('div');
        dialogContent.className = 'backup-list-dialog-content';
        
        // Create dialog header
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'backup-list-dialog-header';
        
        const dialogTitle = document.createElement('h3');
        dialogTitle.id = 'backup-list-title';
        dialogTitle.textContent = 'Restore Backup';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'backup-list-dialog-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close dialog');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(backupListDialog);
            backupListDialog = null;
        });
        
        dialogHeader.appendChild(dialogTitle);
        dialogHeader.appendChild(closeButton);
        
        // Create dialog body
        const dialogBody = document.createElement('div');
        dialogBody.className = 'backup-list-dialog-body';
        
        const backupList = document.createElement('ul');
        backupList.className = 'backup-list';
        
        // Add backups to list
        backupKeys.forEach(key => {
            const timestamp = key.replace(BACKUP_KEY_PREFIX, '');
            const date = new Date(timestamp);
            
            const listItem = document.createElement('li');
            listItem.className = 'backup-list-item';
            
            const backupDate = document.createElement('span');
            backupDate.className = 'backup-date';
            backupDate.textContent = date.toLocaleString();
            
            const restoreButton = document.createElement('button');
            restoreButton.className = 'backup-restore-button';
            restoreButton.textContent = 'Restore';
            restoreButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to restore this backup? This will replace your current data.')) {
                    restoreBackup(key);
                }
            });
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'backup-delete-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this backup?')) {
                    deleteBackup(key);
                    listItem.remove();
                    
                    // If no more backups, close dialog
                    if (backupList.children.length === 0) {
                        document.body.removeChild(backupListDialog);
                        backupListDialog = null;
                        showNotification('No more backups available.', 'info');
                    }
                }
            });
            
            listItem.appendChild(backupDate);
            listItem.appendChild(restoreButton);
            listItem.appendChild(deleteButton);
            
            backupList.appendChild(listItem);
        });
        
        dialogBody.appendChild(backupList);
        
        // Assemble dialog
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(dialogBody);
        
        backupListDialog.appendChild(dialogContent);
        
        // Add dialog to body
        document.body.appendChild(backupListDialog);
    }
    
    function restoreBackup(key) {
        try {
            // Get backup data
            const data = localStorage.getItem(key);
            if (!data) {
                showNotification('Failed to restore backup: Backup not found', 'error');
                return false;
            }
            
            // Import data
            const success = window.CertificationRoadmap.StorageService.importData(data);
            
            if (success) {
                showNotification('Backup restored successfully. Please refresh the page to see the changes.', 'success');
                
                // Close dialogs
                if (backupListDialog) {
                    document.body.removeChild(backupListDialog);
                    backupListDialog = null;
                }
                
                hideDataManagerDialog();
                return true;
            } else {
                showNotification('Failed to restore backup: Invalid data format', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error restoring backup:', error);
            showNotification(`Failed to restore backup: ${error.message}`, 'error');
            return false;
        }
    }
    
    function deleteBackup(key) {
        try {
            localStorage.removeItem(key);
            showNotification('Backup deleted successfully.', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting backup:', error);
            showNotification(`Failed to delete backup: ${error.message}`, 'error');
            return false;
        }
    }
    
    function exportRoadmapOnly() {
        try {
            // Get roadmap data
            const roadmapData = window.CertificationRoadmap.StorageService.loadRoadmap();
            if (!roadmapData) {
                showNotification('No roadmap data to export.', 'error');
                return false;
            }
            
            // Create export data
            const exportData = {
                version: '1.0.0',
                timestamp: new Date(),
                roadmap: roadmapData
            };
            
            // Convert to JSON
            const jsonData = JSON.stringify(exportData);
            
            // Create a blob from the data
            const blob = new Blob([jsonData], { type: 'application/json' });
            
            // Create a download link
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `certification-roadmap-${new Date().toISOString().slice(0, 10)}.json`;
            
            // Append to body, click, and remove
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            URL.revokeObjectURL(a.href);
            
            showNotification('Roadmap exported successfully.', 'success');
            return true;
        } catch (error) {
            console.error('Error exporting roadmap:', error);
            showNotification(`Failed to export roadmap: ${error.message}`, 'error');
            return false;
        }
    }
    
    function showDataManagerDialog() {
        if (!dataManagerDialog) {
            createDataManagerDialog();
        }
        
        dataManagerDialog.style.display = 'flex';
    }
    
    function hideDataManagerDialog() {
        if (dataManagerDialog) {
            dataManagerDialog.style.display = 'none';
        }
    }
    
    function showNotification(message, type) {
        if (window.CertificationRoadmap.Main && window.CertificationRoadmap.Main.showNotification) {
            window.CertificationRoadmap.Main.showNotification(message, type);
        } else {
            alert(message);
        }
    }
    
    // Public API
    return {
        /**
         * Initialize the data manager
         */
        initDataManager: function() {
            // Create data manager dialog
            createDataManagerDialog();
        },
        
        /**
         * Show the data manager dialog
         */
        showDataManager: function() {
            showDataManagerDialog();
        }
    };
})();