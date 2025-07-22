/**
 * Cloud Certification Roadmap - Main Application
 * 
 * This is the main entry point for the Cloud Certification Roadmap feature.
 * It initializes all components and manages the workflow.
 */

// Main Application Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.App = (function() {
    // Private variables
    let currentStep = 'assessment';
    const steps = ['assessment', 'career-goals', 'roadmap', 'study-plan'];
    let initialized = false;
    
    // DOM elements
    let stepIndicators = null;
    let stepContents = null;
    
    // Private functions
    function initializeComponents() {
        // Initialize storage service
        window.CertificationRoadmap.StorageService.initStorage()
            .then(() => {
                console.log('Storage service initialized');
                
                // Initialize auto-save module
                return window.CertificationRoadmap.AutoSave.initAutoSave();
            })
            .then(() => {
                console.log('Auto-save module initialized');
                
                // Check data integrity
                const isIntegrityValid = window.CertificationRoadmap.StorageService.checkDataIntegrity();
                if (!isIntegrityValid) {
                    console.warn('Data integrity check failed. Data may be corrupted or tampered with.');
                    // We still continue, but log a warning
                }
                
                // Check if we have a saved session
                const sessionData = window.CertificationRoadmap.StorageService.loadSession();
                
                if (sessionData) {
                    // Show session restoration dialog
                    showSessionRestorationDialog(sessionData);
                } else {
                    // Check if we have saved data
                    const dataExists = window.CertificationRoadmap.StorageService.checkDataExists();
                    
                    if (dataExists.assessment && dataExists.careerGoals && dataExists.roadmap) {
                        // Load saved data
                        const assessment = window.CertificationRoadmap.StorageService.loadAssessment();
                        const careerGoals = window.CertificationRoadmap.StorageService.loadCareerGoals();
                        const roadmap = window.CertificationRoadmap.StorageService.loadRoadmap();
                        
                        // Show data restoration notification
                        showNotification('Previous session data found. You can continue where you left off.', 'info');
                    }
                }
                
                // Save data integrity hash
                window.CertificationRoadmap.StorageService.saveDataIntegrity();
            })
            .catch(error => {
                console.error('Error initializing storage service:', error);
                showNotification('Error initializing storage. Some features may not work properly.', 'error');
            });
        
        // Initialize certification database
        window.CertificationRoadmap.CertificationDatabase.initDatabase()
            .then(() => {
                console.log('Certification database initialized');
            })
            .catch(error => {
                console.error('Error initializing certification database:', error);
                showNotification('Error loading certification data. Please try refreshing the page.', 'error');
            });
        
        // Initialize resource recommender
        window.CertificationRoadmap.ResourceRecommender.initRecommender()
            .then(() => {
                console.log('Resource recommender initialized');
            })
            .catch(error => {
                console.error('Error initializing resource recommender:', error);
                showNotification('Error loading resource data. Some recommendations may not be available.', 'error');
            });
            
        // Initialize resource manager
        window.CertificationRoadmap.ResourceManager.initManager()
            .then(() => {
                console.log('Resource manager initialized');
            })
            .catch(error => {
                console.error('Error initializing resource manager:', error);
                showNotification('Error loading resource management data. Some features may not be available.', 'error');
            });
            
        // Initialize data manager
        window.CertificationRoadmap.DataManager.initDataManager();
        
        // Initialize scenario manager
        window.CertificationRoadmap.ScenarioManager.initScenarioManager();
        
        // Initialize UI components
        initializeUI();
        
        // Set up event listeners
        setupEventListeners();
        
        initialized = true;
    }
    
    function initializeUI() {
        // Get step indicators and content elements
        stepIndicators = document.querySelectorAll('.step-indicator li');
        stepContents = document.querySelectorAll('.step-content');
        
        // Initialize assessment form
        const assessmentContainer = document.getElementById('assessment-step');
        if (assessmentContainer) {
            window.CertificationRoadmap.AssessmentModule.initAssessment(assessmentContainer);
        }
        
        // Initialize career goals form
        const careerGoalsContainer = document.getElementById('career-goals-step');
        if (careerGoalsContainer) {
            window.CertificationRoadmap.CareerGoalsModule.initCareerGoals(careerGoalsContainer);
        }
        
        // Initialize resources display
        const resourcesContainer = document.getElementById('resources-container');
        if (resourcesContainer) {
            window.CertificationRoadmap.ResourceManager.initManager(resourcesContainer);
        }
        
        // Initialize roadmap visualization
        const roadmapContainer = document.getElementById('roadmap-container');
        if (roadmapContainer) {
            window.CertificationRoadmap.RoadmapVisualizer.initVisualization(roadmapContainer);
        }
        
        // Initialize certification details
        const certDetailsContainer = document.getElementById('cert-details-container');
        if (certDetailsContainer) {
            window.CertificationRoadmap.CertificationDetails.initDetails(certDetailsContainer);
        }
        
        // Initialize study plan
        const studyPlanContainer = document.getElementById('study-plan');
        if (studyPlanContainer) {
            window.CertificationRoadmap.StudyPlanModule.initStudyPlan(studyPlanContainer);
        }
    }
    
    function setupEventListeners() {
        // Session restoration event
        document.addEventListener('session-restore', function(event) {
            if (event.detail && event.detail.sessionData) {
                const sessionData = event.detail.sessionData;
                
                // Navigate to the last step
                if (sessionData.currentStep) {
                    navigateToStep(sessionData.currentStep);
                }
                
                showNotification('Session restored successfully.', 'success');
            }
        });
        
        // Restore session button
        const restoreSessionBtn = document.getElementById('restore-session-btn');
        if (restoreSessionBtn) {
            restoreSessionBtn.addEventListener('click', function() {
                // Restore session
                window.CertificationRoadmap.AutoSave.restoreSession();
            });
        }
        
        // Manage data button
        const manageDataBtn = document.getElementById('manage-data-btn');
        if (manageDataBtn) {
            manageDataBtn.addEventListener('click', function() {
                // Show data manager dialog
                window.CertificationRoadmap.DataManager.showDataManager();
            });
        }
        
        // Step navigation buttons
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStep = this.getAttribute('data-next');
                if (nextStep) {
                    navigateToStep(nextStep);
                }
            });
            
            // Add keyboard support
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const nextStep = this.getAttribute('data-next');
                    if (nextStep) {
                        navigateToStep(nextStep);
                    }
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStep = this.getAttribute('data-prev');
                if (prevStep) {
                    navigateToStep(prevStep);
                }
            });
            
            // Add keyboard support
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const prevStep = this.getAttribute('data-prev');
                    if (prevStep) {
                        navigateToStep(prevStep);
                    }
                }
            });
        });
        
        // Step indicator clicks
        stepIndicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                const step = this.getAttribute('data-step');
                if (step) {
                    navigateToStep(step);
                }
            });
            
            // Add keyboard support
            indicator.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const step = this.getAttribute('data-step');
                    if (step) {
                        navigateToStep(step);
                    }
                }
            });
            
            // Make indicators focusable
            indicator.setAttribute('tabindex', '0');
            indicator.setAttribute('role', 'button');
        });
        
        // Assessment completion event
        document.addEventListener('assessment-complete', function(event) {
            const assessmentData = event.detail.assessmentData;
            console.log('Assessment completed:', assessmentData);
            
            // Save assessment data
            window.CertificationRoadmap.StorageService.saveAssessment(assessmentData);
            
            // Navigate to next step
            navigateToStep('career-goals');
        });
        
        // Career goals completion event
        document.addEventListener('career-goals-complete', function(event) {
            const careerGoalsData = event.detail.careerGoalsData;
            console.log('Career goals completed:', careerGoalsData);
            
            // Save career goals data
            window.CertificationRoadmap.StorageService.saveCareerGoals(careerGoalsData);
            
            // Generate roadmap
            generateRoadmap();
            
            // Navigate to next step
            navigateToStep('roadmap');
        });
        
        // Certification selection event
        document.addEventListener('certification-selected', function(event) {
            const certification = event.detail.certification;
            console.log('Certification selected:', certification);
            
            // Update certification dropdown in study plan
            updateStudyPlanCertificationDropdown([certification.id]);
        });
        
        // Save plan button
        const savePlanButton = document.getElementById('save-plan');
        if (savePlanButton) {
            savePlanButton.addEventListener('click', function() {
                const studyPlan = window.CertificationRoadmap.StudyPlanModule.getCurrentStudyPlan();
                if (studyPlan) {
                    window.CertificationRoadmap.StorageService.saveStudyPlan(studyPlan);
                    showNotification('Study plan saved successfully.', 'success');
                } else {
                    showNotification('No study plan to save. Please generate a study plan first.', 'error');
                }
            });
        }
        
        // Export plan button
        const exportPlanButton = document.getElementById('export-plan');
        if (exportPlanButton) {
            exportPlanButton.addEventListener('click', function() {
                exportStudyPlan();
            });
        }
        
        // Provider filter
        const providerFilter = document.getElementById('provider-filter');
        if (providerFilter) {
            providerFilter.addEventListener('change', function() {
                applyRoadmapFilters();
            });
        }
        
        // Level filter
        const levelFilter = document.getElementById('level-filter');
        if (levelFilter) {
            levelFilter.addEventListener('change', function() {
                applyRoadmapFilters();
            });
        }
        
        // Reset filters button
        const resetFiltersButton = document.getElementById('reset-filters');
        if (resetFiltersButton) {
            resetFiltersButton.addEventListener('click', function() {
                // Reset filter dropdowns
                if (providerFilter) providerFilter.value = '';
                if (levelFilter) levelFilter.value = '';
                
                // Reset filters in visualizer
                const visualizer = window.CertificationRoadmap.RoadmapVisualizer;
                if (visualizer) {
                    visualizer.resetFilters();
                }
            });
        }
        
        // Manage scenarios button
        const manageScenariosButton = document.getElementById('manage-scenarios');
        if (manageScenariosButton) {
            manageScenariosButton.addEventListener('click', function() {
                // Show scenario manager dialog
                window.CertificationRoadmap.ScenarioManager.showScenarioManager();
            });
        }
        
        // Zoom in button
        const zoomInButton = document.getElementById('zoom-in');
        if (zoomInButton) {
            zoomInButton.addEventListener('click', function() {
                const visualizer = window.CertificationRoadmap.RoadmapVisualizer;
                if (visualizer) {
                    visualizer.zoomIn();
                }
            });
        }
        
        // Zoom out button
        const zoomOutButton = document.getElementById('zoom-out');
        if (zoomOutButton) {
            zoomOutButton.addEventListener('click', function() {
                const visualizer = window.CertificationRoadmap.RoadmapVisualizer;
                if (visualizer) {
                    visualizer.zoomOut();
                }
            });
        }
        
        // Reset zoom button
        const zoomResetButton = document.getElementById('zoom-reset');
        if (zoomResetButton) {
            zoomResetButton.addEventListener('click', function() {
                const visualizer = window.CertificationRoadmap.RoadmapVisualizer;
                if (visualizer) {
                    visualizer.resetZoom();
                }
            });
        }
        
        // Export roadmap as PDF button
        const exportRoadmapPDFButton = document.getElementById('export-roadmap-pdf');
        if (exportRoadmapPDFButton) {
            exportRoadmapPDFButton.addEventListener('click', function() {
                exportRoadmapAsPDF();
            });
        }
        
        // Export roadmap as PNG button
        const exportRoadmapPNGButton = document.getElementById('export-roadmap-png');
        if (exportRoadmapPNGButton) {
            exportRoadmapPNGButton.addEventListener('click', function() {
                const visualizer = window.CertificationRoadmap.RoadmapVisualizer;
                if (visualizer) {
                    visualizer.exportPNG()
                        .then(dataUrl => {
                            // Create download link
                            const a = document.createElement('a');
                            a.href = dataUrl;
                            a.download = 'certification-roadmap.png';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            
                            showNotification('Roadmap exported as PNG successfully.', 'success');
                        })
                        .catch(error => {
                            console.error('Error exporting roadmap as PNG:', error);
                            showNotification('Failed to export roadmap as PNG. Please try again.', 'error');
                        });
                }
            });
        }
        
        // Plan certification dropdown
        const planCertificationSelect = document.getElementById('plan-certification');
        if (planCertificationSelect) {
            planCertificationSelect.addEventListener('change', function() {
                const certificationId = this.value;
                if (certificationId) {
                    generateStudyPlan(certificationId);
                }
            });
        }
    }
    
    function navigateToStep(step) {
        if (!steps.includes(step)) return;
        
        // Update current step
        currentStep = step;
        
        // Update step indicators
        stepIndicators.forEach(indicator => {
            if (indicator.getAttribute('data-step') === step) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Update step content
        stepContents.forEach(content => {
            if (content.id === `${step}-step`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Perform step-specific actions
        switch (step) {
            case 'assessment':
                // Nothing special needed for assessment step
                break;
                
            case 'career-goals':
                // Check if we have assessment data
                const assessment = window.CertificationRoadmap.StorageService.loadAssessment();
                if (!assessment) {
                    showNotification('Please complete the assessment first.', 'error');
                    navigateToStep('assessment');
                }
                break;
                
            case 'roadmap':
                // Check if we have career goals data
                const careerGoals = window.CertificationRoadmap.StorageService.loadCareerGoals();
                if (!careerGoals) {
                    showNotification('Please complete the career goals section first.', 'error');
                    navigateToStep('career-goals');
                    return;
                }
                
                // Check if we need to generate a roadmap
                const roadmap = window.CertificationRoadmap.StorageService.loadRoadmap();
                if (!roadmap) {
                    generateRoadmap();
                } else {
                    // Visualize existing roadmap
                    window.CertificationRoadmap.RoadmapVisualizer.visualizeRoadmap(roadmap);
                }
                break;
                
            case 'resources':
                // Check if we have a roadmap
                const resourcesRoadmap = window.CertificationRoadmap.StorageService.loadRoadmap();
                if (!resourcesRoadmap) {
                    showNotification('Please generate a certification roadmap first.', 'error');
                    navigateToStep('roadmap');
                    return;
                }
                
                // Display resources for the roadmap
                window.CertificationRoadmap.ResourceManager.displayResourcesForRoadmap(resourcesRoadmap);
                break;
                
            case 'study-plan':
                // Check if we have a roadmap
                const studyRoadmap = window.CertificationRoadmap.StorageService.loadRoadmap();
                if (!studyRoadmap) {
                    showNotification('Please generate a certification roadmap first.', 'error');
                    navigateToStep('roadmap');
                    return;
                }
                
                // Update certification dropdown
                updateStudyPlanCertificationDropdown(studyRoadmap.certifications.map(c => c.id));
                
                // Check if we have a study plan
                const studyPlan = window.CertificationRoadmap.StorageService.loadStudyPlan();
                if (studyPlan) {
                    // Display existing study plan
                    window.CertificationRoadmap.StudyPlanModule.displayStudyPlan(studyPlan);
                }
                break;
        }
    }
    
    function generateRoadmap() {
        // Get assessment and career goals data
        const assessment = window.CertificationRoadmap.StorageService.loadAssessment();
        const careerGoals = window.CertificationRoadmap.StorageService.loadCareerGoals();
        
        if (!assessment || !careerGoals) {
            showNotification('Missing assessment or career goals data. Please complete both steps.', 'error');
            return;
        }
        
        // Generate roadmap
        const roadmap = window.CertificationRoadmap.RoadmapGenerator.generateRoadmap(assessment, careerGoals);
        
        if (!roadmap) {
            showNotification('Failed to generate roadmap. Please try again.', 'error');
            return;
        }
        
        // Save roadmap
        window.CertificationRoadmap.StorageService.saveRoadmap(roadmap);
        
        // Visualize roadmap
        window.CertificationRoadmap.RoadmapVisualizer.visualizeRoadmap(roadmap);
        
        showNotification('Certification roadmap generated successfully.', 'success');
    }
    
    function updateStudyPlanCertificationDropdown(certificationIds) {
        const planCertificationSelect = document.getElementById('plan-certification');
        if (!planCertificationSelect) return;
        
        // Clear existing options
        planCertificationSelect.innerHTML = '<option value="">Select a certification</option>';
        
        // Get certification database
        const certDatabase = window.CertificationRoadmap.CertificationDatabase;
        
        // Add options for each certification
        certificationIds.forEach(certId => {
            const cert = certDatabase.getCertificationById(certId);
            if (cert) {
                const option = document.createElement('option');
                option.value = cert.id;
                option.textContent = cert.name;
                planCertificationSelect.appendChild(option);
            }
        });
    }
    
    function generateStudyPlan(certificationId) {
        if (!certificationId) return;
        
        // Get user preferences
        const assessment = window.CertificationRoadmap.StorageService.loadAssessment();
        const preferences = assessment && assessment.preferences ? assessment.preferences : {};
        
        // Generate study plan
        const studyPlan = window.CertificationRoadmap.StudyPlanModule.generateStudyPlan(certificationId, {
            weeklyHours: preferences.availableHoursPerWeek || 10,
            startDate: new Date()
        });
        
        if (!studyPlan) {
            showNotification('Failed to generate study plan. Please try again.', 'error');
            return;
        }
        
        // Save study plan
        window.CertificationRoadmap.StorageService.saveStudyPlan(studyPlan);
        
        // Display study plan
        window.CertificationRoadmap.StudyPlanModule.displayStudyPlan(studyPlan);
        
        // Generate resource recommendations
        generateResourceRecommendations(certificationId);
        
        showNotification('Study plan generated successfully.', 'success');
    }
    
    function generateResourceRecommendations(certificationId) {
        if (!certificationId) return;
        
        // Get user preferences
        const assessment = window.CertificationRoadmap.StorageService.loadAssessment();
        const preferences = assessment && assessment.preferences ? assessment.preferences : {};
        
        // Get resource recommendations
        const resources = window.CertificationRoadmap.ResourceRecommender.recommendResources(certificationId, {
            learningStyle: preferences.learningStyle || 'mixed',
            budgetConstraints: preferences.budgetConstraints || 'medium'
        });
        
        if (!resources || resources.length === 0) {
            showNotification('No resources found for this certification.', 'info');
            return;
        }
        
        // Display resource recommendations
        displayResourceRecommendations(resources);
    }
    
    function displayResourceRecommendations(resources) {
        const resourcesContainer = document.getElementById('resources-container');
        if (!resourcesContainer) return;
        
        // Clear existing content
        resourcesContainer.innerHTML = '';
        
        // Group resources by type
        const resourcesByType = {};
        resources.forEach(resource => {
            if (!resourcesByType[resource.type]) {
                resourcesByType[resource.type] = [];
            }
            resourcesByType[resource.type].push(resource);
        });
        
        // Create resource cards for each type
        for (const type in resourcesByType) {
            // Create type section
            const typeSection = document.createElement('div');
            typeSection.className = 'resources-section';
            
            // Create type header
            const typeHeader = document.createElement('h4');
            typeHeader.className = 'resources-type-header';
            typeHeader.textContent = formatResourceType(type);
            typeSection.appendChild(typeHeader);
            
            // Create resources grid
            const resourcesGrid = document.createElement('div');
            resourcesGrid.className = 'resources-grid';
            
            // Add resource cards
            resourcesByType[type].forEach(resource => {
                const resourceCard = createResourceCard(resource);
                resourcesGrid.appendChild(resourceCard);
            });
            
            typeSection.appendChild(resourcesGrid);
            resourcesContainer.appendChild(typeSection);
        }
    }
    
    function createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        
        // Create card header
        const cardHeader = document.createElement('div');
        cardHeader.className = 'resource-card-header';
        
        const cardTitle = document.createElement('h5');
        cardTitle.className = 'resource-card-title';
        cardTitle.textContent = resource.title;
        
        const cardProvider = document.createElement('div');
        cardProvider.className = 'resource-card-provider';
        cardProvider.textContent = resource.provider;
        
        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(cardProvider);
        
        // Create card content
        const cardContent = document.createElement('div');
        cardContent.className = 'resource-card-content';
        
        const cardDescription = document.createElement('p');
        cardDescription.className = 'resource-card-description';
        cardDescription.textContent = resource.description;
        
        cardContent.appendChild(cardDescription);
        
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
        cardCost.textContent = formatResourceCost(resource.cost);
        
        cardMeta.appendChild(cardFormat);
        cardMeta.appendChild(cardDuration);
        cardMeta.appendChild(cardCost);
        
        // Create card footer
        const cardFooter = document.createElement('div');
        cardFooter.className = 'resource-card-footer';
        
        const cardRating = document.createElement('div');
        cardRating.className = 'resource-card-rating';
        cardRating.innerHTML = `${resource.ratings.average} ★ (${formatRatingCount(resource.ratings.count)})`;
        
        const cardLink = document.createElement('a');
        cardLink.className = 'resource-card-link';
        cardLink.href = resource.url;
        cardLink.target = '_blank';
        cardLink.rel = 'noopener noreferrer';
        cardLink.textContent = 'View Resource';
        
        cardFooter.appendChild(cardRating);
        cardFooter.appendChild(cardLink);
        
        // Assemble card
        card.appendChild(cardHeader);
        card.appendChild(cardContent);
        card.appendChild(cardMeta);
        card.appendChild(cardFooter);
        
        return card;
    }
    
    function formatResourceType(type) {
        const typeMap = {
            'course': 'Courses',
            'documentation': 'Documentation',
            'practice-exam': 'Practice Exams',
            'book': 'Books',
            'video': 'Videos',
            'lab': 'Hands-on Labs',
            'tutorial': 'Tutorials',
            'community': 'Community Resources'
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
    
    function formatResourceCost(cost) {
        if (cost.type === 'free') {
            return 'Free';
        }
        
        if (cost.type === 'one-time') {
            return `$${cost.amount.toFixed(2)}`;
        }
        
        if (cost.type === 'subscription') {
            return `$${cost.amount.toFixed(2)}/mo`;
        }
        
        return 'Mixed pricing';
    }
    
    function formatRatingCount(count) {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        
        return count.toString();
    }
    
    function applyRoadmapFilters() {
        const providerFilter = document.getElementById('provider-filter');
        const levelFilter = document.getElementById('level-filter');
        
        const filters = {
            provider: providerFilter ? providerFilter.value : null,
            level: levelFilter ? levelFilter.value : null
        };
        
        const visualizer = window.CertificationRoadmap.RoadmapVisualizer;
        if (visualizer) {
            visualizer.applyFilters(filters);
        }
    }
    
    function exportRoadmapAsPDF() {
        const roadmap = window.CertificationRoadmap.RoadmapGenerator.getCurrentRoadmap();
        if (!roadmap) {
            showNotification('No roadmap to export. Please generate a roadmap first.', 'error');
            return;
        }
        
        // Check if PDF exporter is available
        if (!window.CertificationRoadmap.PDFExporter) {
            showNotification('PDF export functionality is not available.', 'error');
            return;
        }
        
        // Export roadmap as PDF
        window.CertificationRoadmap.PDFExporter.exportRoadmapAsPDF(roadmap)
            .then(blob => {
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${roadmap.name.replace(/\\s+/g, '-').toLowerCase()}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showNotification('Roadmap exported successfully.', 'success');
            })
            .catch(error => {
                console.error('Error exporting roadmap:', error);
                showNotification('Failed to export roadmap. Please try again.', 'error');
            });
    }
    
    function exportStudyPlan() {
        const studyPlan = window.CertificationRoadmap.StudyPlanModule.getCurrentStudyPlan();
        if (!studyPlan) {
            showNotification('No study plan to export. Please generate a study plan first.', 'error');
            return;
        }
        
        // Export study plan as PDF
        window.CertificationRoadmap.StudyPlanModule.exportStudyPlanAsPDF()
            .then(blob => {
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${studyPlan.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showNotification('Study plan exported successfully.', 'success');
            })
            .catch(error => {
                console.error('Error exporting study plan:', error);
                showNotification('Failed to export study plan. Please try again.', 'error');
            });
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(notification);
        });
        
        notification.appendChild(closeButton);
        
        // Add to document
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
    
    // Public API
    return {
        /**
         * Initialize the application
         */
        init: function() {
            if (initialized) return;
            
            console.log('Initializing Cloud Certification Roadmap application');
            initializeComponents();
        },
        
        /**
         * Navigate to a specific step
         * @param {String} step - The step to navigate to
         */
        navigateToStep: function(step) {
            navigateToStep(step);
        },
        
        /**
         * Generate a certification roadmap
         */
        generateRoadmap: function() {
            generateRoadmap();
        },
        
        /**
         * Generate a study plan for a certification
         * @param {String} certificationId - The ID of the certification
         */
        generateStudyPlan: function(certificationId) {
            generateStudyPlan(certificationId);
        },
        
        /**
         * Export the current study plan
         */
        exportStudyPlan: function() {
            exportStudyPlan();
        },
        
        /**
         * Show a notification message
         * @param {String} message - The message to show
         * @param {String} type - The notification type (info, success, error)
         */
        showNotification: function(message, type) {
            showNotification(message, type);
        },
        
        /**
         * Get the current step
         * @returns {String} The current step
         */
        getCurrentStep: function() {
            return currentStep;
        },
        
        /**
         * Check if the application is initialized
         * @returns {Boolean} True if initialized, false otherwise
         */
        isInitialized: function() {
            return initialized;
        }
    };
    
    /**
     * Show session restoration dialog
     * @param {Object} sessionData - The session data
     */
    function showSessionRestorationDialog(sessionData) {
        if (!sessionData) return;
        
        // Format timestamp
        const timestamp = sessionData.timestamp ? new Date(sessionData.timestamp) : new Date();
        const formattedDate = timestamp.toLocaleDateString();
        const formattedTime = timestamp.toLocaleTimeString();
        
        // Create dialog element
        const dialog = document.createElement('div');
        dialog.className = 'session-restoration-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-labelledby', 'session-restoration-title');
        dialog.setAttribute('aria-describedby', 'session-restoration-message');
        
        // Create dialog content
        const dialogContent = document.createElement('div');
        dialogContent.className = 'session-restoration-dialog-content';
        
        // Create dialog header
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'session-restoration-dialog-header';
        
        const dialogTitle = document.createElement('h3');
        dialogTitle.id = 'session-restoration-title';
        dialogTitle.textContent = 'Resume Previous Session';
        
        dialogHeader.appendChild(dialogTitle);
        
        // Create dialog body
        const dialogBody = document.createElement('div');
        dialogBody.className = 'session-restoration-dialog-body';
        
        const dialogMessage = document.createElement('p');
        dialogMessage.id = 'session-restoration-message';
        dialogMessage.textContent = `We found a saved session from ${formattedDate} at ${formattedTime}. Would you like to resume where you left off?`;
        
        // Create session details
        const sessionDetails = document.createElement('div');
        sessionDetails.className = 'session-restoration-details';
        
        // Add details about what was saved
        if (sessionData.currentStep) {
            const stepDetail = document.createElement('div');
            stepDetail.className = 'session-restoration-detail';
            stepDetail.innerHTML = `<strong>Last Step:</strong> ${formatStepName(sessionData.currentStep)}`;
            sessionDetails.appendChild(stepDetail);
        }
        
        if (sessionData.hasAssessment) {
            const assessmentDetail = document.createElement('div');
            assessmentDetail.className = 'session-restoration-detail';
            assessmentDetail.innerHTML = '<strong>Skill Assessment:</strong> Completed';
            sessionDetails.appendChild(assessmentDetail);
        }
        
        if (sessionData.hasCareerGoals) {
            const goalsDetail = document.createElement('div');
            goalsDetail.className = 'session-restoration-detail';
            goalsDetail.innerHTML = '<strong>Career Goals:</strong> Defined';
            sessionDetails.appendChild(goalsDetail);
        }
        
        if (sessionData.hasRoadmap) {
            const roadmapDetail = document.createElement('div');
            roadmapDetail.className = 'session-restoration-detail';
            roadmapDetail.innerHTML = '<strong>Certification Roadmap:</strong> Generated';
            sessionDetails.appendChild(roadmapDetail);
        }
        
        if (sessionData.hasStudyPlan) {
            const planDetail = document.createElement('div');
            planDetail.className = 'session-restoration-detail';
            planDetail.innerHTML = '<strong>Study Plan:</strong> Created';
            sessionDetails.appendChild(planDetail);
        }
        
        dialogBody.appendChild(dialogMessage);
        dialogBody.appendChild(sessionDetails);
        
        // Create dialog footer
        const dialogFooter = document.createElement('div');
        dialogFooter.className = 'session-restoration-dialog-footer';
        
        const resumeButton = document.createElement('button');
        resumeButton.className = 'session-restoration-button session-restoration-button-primary';
        resumeButton.textContent = 'Resume Session';
        resumeButton.addEventListener('click', () => {
            // Resume session
            if (sessionData.currentStep) {
                // Navigate to the last step
                navigateToStep(sessionData.currentStep);
            }
            
            // Close dialog
            document.body.removeChild(dialog);
            
            // Show notification
            showNotification('Session restored successfully.', 'success');
        });
        
        const newSessionButton = document.createElement('button');
        newSessionButton.className = 'session-restoration-button';
        newSessionButton.textContent = 'Start New Session';
        newSessionButton.addEventListener('click', () => {
            // Clear session data
            window.CertificationRoadmap.StorageService.saveSession(null);
            
            // Close dialog
            document.body.removeChild(dialog);
            
            // Show notification
            showNotification('Starting a new session.', 'info');
        });
        
        dialogFooter.appendChild(resumeButton);
        dialogFooter.appendChild(newSessionButton);
        
        // Assemble dialog
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(dialogBody);
        dialogContent.appendChild(dialogFooter);
        
        dialog.appendChild(dialogContent);
        
        // Add to body
        document.body.appendChild(dialog);
    }
    
    /**
     * Format step name for display
     * @param {String} step - The step name
     * @returns {String} The formatted step name
     */
    function formatStepName(step) {
        const stepMap = {
            'welcome': 'Welcome',
            'assessment': 'Skill Assessment',
            'career-goals': 'Career Goals',
            'roadmap': 'Certification Roadmap',
            'resources': 'Learning Resources',
            'study-plan': 'Study Plan'
        };
        
        return stepMap[step] || step.charAt(0).toUpperCase() + step.slice(1);
    }
})();

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.CertificationRoadmap.App.init();
});