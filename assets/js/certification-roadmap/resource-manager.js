/**
 * Cloud Certification Roadmap - Resource Manager
 * 
 * This module handles the display and management of learning resources.
 */

// Resource Manager Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.ResourceManager = (function() {
    // Private variables
    let containerElement = null;
    let currentResources = [];
    let filteredResources = [];
    let currentPage = 1;
    let itemsPerPage = 9;
    let totalPages = 1;
    let activeFilters = {
        type: null,
        format: null,
        cost: null,
        certification: null
    };
    let savedResources = [];
    let resourceProgress = {};
    let resourceNotes = {};
    
    // Private functions
    function formatCurrency(cost) {
        if (cost.type === 'free') {
            return 'Free';
        }
        
        if (cost.type === 'one-time') {
            return `${cost.currency}${cost.amount.toFixed(2)}`;
        }
        
        if (cost.type === 'subscription') {
            return `${cost.currency}${cost.amount.toFixed(2)}/mo`;
        }
        
        return 'Mixed pricing';
    }
    
    function formatRatingCount(count) {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        
        return count.toString();
    }
    
    function formatResourceType(type) {
        const typeMap = {
            'course': 'Course',
            'documentation': 'Documentation',
            'practice-exam': 'Practice Exam',
            'book': 'Book',
            'video': 'Video',
            'lab': 'Lab',
            'tutorial': 'Tutorial',
            'community': 'Community'
        };
        
        return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
    }
    
    function formatResourceFormat(format) {
        const formatMap = {
            'online': 'Online',
            'pdf': 'PDF',
            'physical': 'Physical',
            'interactive': 'Interactive',
            'video': 'Video',
            'audio': 'Audio'
        };
        
        return formatMap[format] || format.charAt(0).toUpperCase() + format.slice(1);
    }
    
    function createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.dataset.resourceId = resource.id;
        
        // Check if resource is saved
        const isSaved = savedResources.includes(resource.id);
        if (isSaved) {
            card.classList.add('resource-card--saved');
        }
        
        // Create card header
        const cardHeader = document.createElement('div');
        cardHeader.className = 'resource-card-header';
        
        const cardTitle = document.createElement('h4');
        cardTitle.className = 'resource-card-title';
        cardTitle.textContent = resource.title;
        
        const cardProvider = document.createElement('div');
        cardProvider.className = 'resource-card-provider';
        cardProvider.textContent = resource.provider;
        
        // Create save button
        const saveButton = document.createElement('button');
        saveButton.className = 'resource-card-save';
        saveButton.innerHTML = isSaved ? '&#10003;' : '&#43;'; // Checkmark or plus sign
        saveButton.title = isSaved ? 'Remove from saved resources' : 'Save resource';
        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSavedResource(resource.id);
        });
        
        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(cardProvider);
        cardHeader.appendChild(saveButton);
        
        // Create card content
        const cardContent = document.createElement('div');
        cardContent.className = 'resource-card-content';
        
        const cardDescription = document.createElement('p');
        cardDescription.className = 'resource-card-description';
        cardDescription.textContent = resource.description;
        
        cardContent.appendChild(cardDescription);
        
        // Create progress section if resource is saved
        if (isSaved) {
            const progress = resourceProgress[resource.id] || 0;
            
            const progressSection = document.createElement('div');
            progressSection.className = 'resource-card-progress-section';
            
            const progressLabel = document.createElement('div');
            progressLabel.className = 'resource-card-progress-label';
            progressLabel.textContent = `Progress: ${progress}%`;
            
            const progressBar = document.createElement('div');
            progressBar.className = 'resource-card-progress-bar';
            
            const progressFill = document.createElement('div');
            progressFill.className = 'resource-card-progress-fill';
            progressFill.style.width = `${progress}%`;
            
            progressBar.appendChild(progressFill);
            
            const progressControls = document.createElement('div');
            progressControls.className = 'resource-card-progress-controls';
            
            const progressSlider = document.createElement('input');
            progressSlider.type = 'range';
            progressSlider.min = '0';
            progressSlider.max = '100';
            progressSlider.value = progress;
            progressSlider.className = 'resource-card-progress-slider';
            progressSlider.addEventListener('input', (e) => {
                const newProgress = parseInt(e.target.value);
                updateResourceProgress(resource.id, newProgress);
                progressLabel.textContent = `Progress: ${newProgress}%`;
                progressFill.style.width = `${newProgress}%`;
            });
            
            progressControls.appendChild(progressSlider);
            
            progressSection.appendChild(progressLabel);
            progressSection.appendChild(progressBar);
            progressSection.appendChild(progressControls);
            
            cardContent.appendChild(progressSection);
            
            // Add notes section if there are notes
            const notes = resourceNotes[resource.id];
            if (notes) {
                const notesSection = document.createElement('div');
                notesSection.className = 'resource-card-notes-section';
                
                const notesLabel = document.createElement('div');
                notesLabel.className = 'resource-card-notes-label';
                notesLabel.textContent = 'Notes:';
                
                const notesText = document.createElement('div');
                notesText.className = 'resource-card-notes-text';
                notesText.textContent = notes;
                
                notesSection.appendChild(notesLabel);
                notesSection.appendChild(notesText);
                
                cardContent.appendChild(notesSection);
            }
        }
        
        // Create card meta
        const cardMeta = document.createElement('div');
        cardMeta.className = 'resource-card-meta';
        
        const cardFormat = document.createElement('span');
        cardFormat.className = 'resource-card-format';
        cardFormat.textContent = formatResourceFormat(resource.format);
        
        const cardDuration = document.createElement('span');
        cardDuration.className = 'resource-card-duration';
        cardDuration.textContent = `${resource.duration} hours`;
        
        const cardCost = document.createElement('span');
        cardCost.className = 'resource-card-cost';
        cardCost.textContent = formatCurrency(resource.cost);
        
        cardMeta.appendChild(cardFormat);
        cardMeta.appendChild(cardDuration);
        cardMeta.appendChild(cardCost);
        
        // Create card footer
        const cardFooter = document.createElement('div');
        cardFooter.className = 'resource-card-footer';
        
        const cardRating = document.createElement('div');
        cardRating.className = 'resource-card-rating';
        cardRating.innerHTML = `${resource.ratings.average} ★ (${formatRatingCount(resource.ratings.count)})`;
        
        const cardActions = document.createElement('div');
        cardActions.className = 'resource-card-actions';
        
        // Add notes button
        const notesButton = document.createElement('button');
        notesButton.className = 'resource-card-action-button';
        notesButton.innerHTML = '&#9998;'; // Pencil icon
        notesButton.title = 'Add/Edit Notes';
        notesButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showNotesDialog(resource.id);
        });
        
        // Add view link
        const cardLink = document.createElement('a');
        cardLink.className = 'resource-card-link';
        cardLink.href = resource.url;
        cardLink.target = '_blank';
        cardLink.rel = 'noopener noreferrer';
        cardLink.textContent = 'View Resource';
        
        cardActions.appendChild(notesButton);
        cardActions.appendChild(cardLink);
        
        cardFooter.appendChild(cardRating);
        cardFooter.appendChild(cardActions);
        
        // Assemble card
        card.appendChild(cardHeader);
        card.appendChild(cardContent);
        card.appendChild(cardMeta);
        card.appendChild(cardFooter);
        
        return card;
    }
    
    function displayResources() {
        if (!containerElement) return;
        
        // Clear container
        containerElement.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredResources.length);
        const pageResources = filteredResources.slice(startIndex, endIndex);
        
        // Update pagination info
        updatePaginationInfo();
        
        // Check if there are resources to display
        if (pageResources.length === 0) {
            displayEmptyState();
            return;
        }
        
        // Create resource cards
        pageResources.forEach(resource => {
            const card = createResourceCard(resource);
            containerElement.appendChild(card);
        });
    }
    
    function displayEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'resources-empty';
        
        const emptyIcon = document.createElement('div');
        emptyIcon.className = 'resources-empty-icon';
        emptyIcon.textContent = '📚';
        
        const emptyTitle = document.createElement('h4');
        emptyTitle.className = 'resources-empty-title';
        emptyTitle.textContent = 'No Resources Found';
        
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'resources-empty-message';
        emptyMessage.textContent = 'Try adjusting your filters or selecting a different certification.';
        
        emptyState.appendChild(emptyIcon);
        emptyState.appendChild(emptyTitle);
        emptyState.appendChild(emptyMessage);
        
        containerElement.appendChild(emptyState);
    }
    
    function updatePaginationInfo() {
        // Update page info
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
        
        // Update pagination buttons
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        
        if (prevButton) {
            prevButton.disabled = currentPage <= 1;
        }
        
        if (nextButton) {
            nextButton.disabled = currentPage >= totalPages;
        }
    }
    
    function applyFilters() {
        // Apply filters to resources
        filteredResources = currentResources.filter(resource => {
            // Filter by type
            if (activeFilters.type && resource.type !== activeFilters.type) {
                return false;
            }
            
            // Filter by format
            if (activeFilters.format && resource.format !== activeFilters.format) {
                return false;
            }
            
            // Filter by cost
            if (activeFilters.cost) {
                if (activeFilters.cost === 'free' && resource.cost.type !== 'free') {
                    return false;
                }
                
                if (activeFilters.cost === 'paid' && resource.cost.type === 'free') {
                    return false;
                }
            }
            
            // Filter by saved status
            if (activeFilters.saved === 'saved' && !savedResources.includes(resource.id)) {
                return false;
            }
            
            // Filter by certification
            if (activeFilters.certification && !resource.certifications.includes(activeFilters.certification)) {
                return false;
            }
            
            return true;
        });
        
        // Calculate total pages
        totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));
        
        // Reset to first page
        currentPage = 1;
        
        // Display filtered resources
        displayResources();
    }
    
    function populateCertificationFilter(certifications) {
        const certFilter = document.getElementById('resource-certification-filter');
        if (!certFilter) return;
        
        // Clear existing options (except the first one)
        while (certFilter.options.length > 1) {
            certFilter.remove(1);
        }
        
        // Get certification database
        const certDatabase = window.CertificationRoadmap.CertificationDatabase;
        if (!certDatabase) return;
        
        // Add options for each certification
        certifications.forEach(certId => {
            const cert = certDatabase.getCertificationById(certId);
            if (cert) {
                const option = document.createElement('option');
                option.value = cert.id;
                option.textContent = cert.name;
                certFilter.appendChild(option);
            }
        });
    }
    
    function toggleSavedResource(resourceId) {
        const index = savedResources.indexOf(resourceId);
        
        if (index === -1) {
            // Add to saved resources
            savedResources.push(resourceId);
        } else {
            // Remove from saved resources
            savedResources.splice(index, 1);
            
            // Remove progress and notes
            delete resourceProgress[resourceId];
            delete resourceNotes[resourceId];
        }
        
        // Save to storage
        saveResourceData();
        
        // Refresh display
        displayResources();
    }
    
    function updateResourceProgress(resourceId, progress) {
        resourceProgress[resourceId] = progress;
        
        // Save to storage
        saveResourceData();
    }
    
    function updateResourceNotes(resourceId, notes) {
        resourceNotes[resourceId] = notes;
        
        // Save to storage
        saveResourceData();
        
        // Refresh display
        displayResources();
    }
    
    function showNotesDialog(resourceId) {
        // Get current notes
        const currentNotes = resourceNotes[resourceId] || '';
        
        // Get resource
        const resource = currentResources.find(r => r.id === resourceId);
        if (!resource) return;
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'resource-notes-dialog';
        
        const dialogContent = document.createElement('div');
        dialogContent.className = 'resource-notes-dialog-content';
        
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'resource-notes-dialog-header';
        
        const dialogTitle = document.createElement('h4');
        dialogTitle.textContent = `Notes for ${resource.title}`;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'resource-notes-dialog-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        dialogHeader.appendChild(dialogTitle);
        dialogHeader.appendChild(closeButton);
        
        const dialogBody = document.createElement('div');
        dialogBody.className = 'resource-notes-dialog-body';
        
        const notesTextarea = document.createElement('textarea');
        notesTextarea.className = 'resource-notes-textarea';
        notesTextarea.value = currentNotes;
        notesTextarea.placeholder = 'Add your notes here...';
        
        dialogBody.appendChild(notesTextarea);
        
        const dialogFooter = document.createElement('div');
        dialogFooter.className = 'resource-notes-dialog-footer';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'resource-notes-dialog-button resource-notes-dialog-button-cancel';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        const saveButton = document.createElement('button');
        saveButton.className = 'resource-notes-dialog-button resource-notes-dialog-button-save';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => {
            updateResourceNotes(resourceId, notesTextarea.value);
            document.body.removeChild(dialog);
        });
        
        dialogFooter.appendChild(cancelButton);
        dialogFooter.appendChild(saveButton);
        
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(dialogBody);
        dialogContent.appendChild(dialogFooter);
        
        dialog.appendChild(dialogContent);
        
        document.body.appendChild(dialog);
        
        // Focus textarea
        notesTextarea.focus();
    }
    
    function loadResourceData() {
        // Get storage service
        const storageService = window.CertificationRoadmap.StorageService;
        if (!storageService) return;
        
        // Load saved resources
        const savedData = storageService.loadResourceData();
        if (savedData) {
            savedResources = savedData.savedResources || [];
            resourceProgress = savedData.resourceProgress || {};
            resourceNotes = savedData.resourceNotes || {};
        }
    }
    
    function saveResourceData() {
        // Get storage service
        const storageService = window.CertificationRoadmap.StorageService;
        if (!storageService) return;
        
        // Save resource data
        storageService.saveResourceData({
            savedResources,
            resourceProgress,
            resourceNotes
        });
    }
    
    function setupEventListeners() {
        // Type filter
        const typeFilter = document.getElementById('resource-type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', function() {
                activeFilters.type = this.value || null;
                applyFilters();
            });
        }
        
        // Format filter
        const formatFilter = document.getElementById('resource-format-filter');
        if (formatFilter) {
            formatFilter.addEventListener('change', function() {
                activeFilters.format = this.value || null;
                applyFilters();
            });
        }
        
        // Cost filter
        const costFilter = document.getElementById('resource-cost-filter');
        if (costFilter) {
            costFilter.addEventListener('change', function() {
                activeFilters.cost = this.value || null;
                applyFilters();
            });
        }
        
        // Certification filter
        const certFilter = document.getElementById('resource-certification-filter');
        if (certFilter) {
            certFilter.addEventListener('change', function() {
                activeFilters.certification = this.value || null;
                applyFilters();
            });
        }
        
        // Saved filter
        const savedFilter = document.getElementById('resource-saved-filter');
        if (savedFilter) {
            savedFilter.addEventListener('change', function() {
                activeFilters.saved = this.value || null;
                applyFilters();
            });
        }
        
        // Reset filters button
        const resetButton = document.getElementById('reset-resource-filters');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // Reset filter dropdowns
                if (typeFilter) typeFilter.value = '';
                if (formatFilter) formatFilter.value = '';
                if (costFilter) costFilter.value = '';
                if (certFilter) certFilter.value = '';
                
                // Reset active filters
                activeFilters = {
                    type: null,
                    format: null,
                    cost: null,
                    certification: null
                };
                
                // Apply filters
                applyFilters();
            });
        }
        
        // Pagination buttons
        const prevButton = document.getElementById('prev-page');
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    displayResources();
                }
            });
        }
        
        const nextButton = document.getElementById('next-page');
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayResources();
                }
            });
        }
    }
    
    // Public API
    return {
        /**
         * Initialize the resource manager
         * @param {HTMLElement} container - The container element for resources
         * @returns {Promise} A promise that resolves when initialization is complete
         */
        initManager: function(container) {
            return new Promise((resolve, reject) => {
                try {
                    if (!container) {
                        resolve();
                        return;
                    }
                    
                    containerElement = container;
                    
                    // Load saved resource data
                    loadResourceData();
                    
                    // Set up event listeners
                    setupEventListeners();
                    
                    // Display empty state initially
                    displayEmptyState();
                    
                    resolve();
                } catch (error) {
                    console.error('Error initializing resource manager:', error);
                    reject(error);
                }
            });
        },
        
        /**
         * Display resources for a roadmap
         * @param {Object} roadmap - The roadmap object
         */
        displayResourcesForRoadmap: function(roadmap) {
            if (!containerElement || !roadmap) return;
            
            // Get resource recommender
            const recommender = window.CertificationRoadmap.ResourceRecommender;
            if (!recommender) return;
            
            // Get certification IDs from roadmap
            const certificationIds = roadmap.certifications.map(cert => cert.id);
            
            // Populate certification filter
            populateCertificationFilter(certificationIds);
            
            // Get resources for all certifications
            currentResources = [];
            certificationIds.forEach(certId => {
                const resources = recommender.getResourcesForCertification(certId);
                if (resources && resources.length > 0) {
                    currentResources = [...currentResources, ...resources];
                }
            });
            
            // Remove duplicates
            currentResources = currentResources.filter((resource, index, self) =>
                index === self.findIndex(r => r.id === resource.id)
            );
            
            // Apply filters
            filteredResources = [...currentResources];
            
            // Calculate total pages
            totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));
            
            // Reset to first page
            currentPage = 1;
            
            // Display resources
            displayResources();
        },
        
        /**
         * Display resources for a certification
         * @param {String} certificationId - The certification ID
         */
        displayResourcesForCertification: function(certificationId) {
            if (!containerElement || !certificationId) return;
            
            // Get resource recommender
            const recommender = window.CertificationRoadmap.ResourceRecommender;
            if (!recommender) return;
            
            // Populate certification filter
            populateCertificationFilter([certificationId]);
            
            // Get resources for the certification
            currentResources = recommender.getResourcesForCertification(certificationId) || [];
            
            // Apply filters
            filteredResources = [...currentResources];
            
            // Calculate total pages
            totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));
            
            // Reset to first page
            currentPage = 1;
            
            // Display resources
            displayResources();
        },
        
        /**
         * Set items per page
         * @param {Number} count - Number of items per page
         */
        setItemsPerPage: function(count) {
            if (count > 0) {
                itemsPerPage = count;
                
                // Recalculate total pages
                totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));
                
                // Reset to first page
                currentPage = 1;
                
                // Display resources
                displayResources();
            }
        }
    };
})();