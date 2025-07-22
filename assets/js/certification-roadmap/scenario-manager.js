/**
 * Cloud Certification Roadmap - Scenario Manager
 * 
 * This module handles multiple roadmap scenarios for the Cloud Certification Roadmap feature.
 */

// Scenario Manager Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.ScenarioManager = (function() {
    // Private variables
    let scenarioManagerDialog = null;
    let scenarioComparisonDialog = null;
    let currentScenarioId = null;
    const SCENARIOS_KEY = 'certificationRoadmap.scenarios';
    
    // Private functions
    function createScenarioManagerDialog() {
        // Create dialog element
        scenarioManagerDialog = document.createElement('div');
        scenarioManagerDialog.className = 'scenario-manager-dialog';
        scenarioManagerDialog.style.display = 'none';
        scenarioManagerDialog.setAttribute('role', 'dialog');
        scenarioManagerDialog.setAttribute('aria-labelledby', 'scenario-manager-title');
        scenarioManagerDialog.setAttribute('aria-describedby', 'scenario-manager-description');
        
        // Create dialog content
        const dialogContent = document.createElement('div');
        dialogContent.className = 'scenario-manager-dialog-content';
        
        // Create dialog header
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'scenario-manager-dialog-header';
        
        const dialogTitle = document.createElement('h3');
        dialogTitle.id = 'scenario-manager-title';
        dialogTitle.textContent = 'Scenario Manager';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'scenario-manager-dialog-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close dialog');
        closeButton.addEventListener('click', hideScenarioManagerDialog);
        
        dialogHeader.appendChild(dialogTitle);
        dialogHeader.appendChild(closeButton);
        
        // Create dialog body
        const dialogBody = document.createElement('div');
        dialogBody.className = 'scenario-manager-dialog-body';
        
        const dialogDescription = document.createElement('p');
        dialogDescription.id = 'scenario-manager-description';
        dialogDescription.textContent = 'Create and manage multiple certification roadmap scenarios. Each scenario can have different assessment and career goal settings.';
        dialogBody.appendChild(dialogDescription);
        
        // Create scenarios section
        const scenariosSection = document.createElement('div');
        scenariosSection.className = 'scenario-manager-section';
        
        const scenariosTitle = document.createElement('h4');
        scenariosTitle.textContent = 'Your Scenarios';
        
        const scenariosList = document.createElement('div');
        scenariosList.id = 'scenarios-list';
        scenariosList.className = 'scenarios-list';
        
        // Create new scenario button
        const newScenarioButton = document.createElement('button');
        newScenarioButton.className = 'scenario-manager-button';
        newScenarioButton.textContent = 'Create New Scenario';
        newScenarioButton.addEventListener('click', createNewScenario);
        
        // Create compare scenarios button
        const compareButton = document.createElement('button');
        compareButton.className = 'scenario-manager-button';
        compareButton.textContent = 'Compare Scenarios';
        compareButton.addEventListener('click', showScenarioComparisonDialog);
        
        scenariosSection.appendChild(scenariosTitle);
        scenariosSection.appendChild(scenariosList);
        scenariosSection.appendChild(newScenarioButton);
        scenariosSection.appendChild(compareButton);
        
        dialogBody.appendChild(scenariosSection);
        
        // Assemble dialog
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(dialogBody);
        
        scenarioManagerDialog.appendChild(dialogContent);
        
        // Add dialog to body
        document.body.appendChild(scenarioManagerDialog);
    }
    
    function loadScenarios() {
        try {
            const scenariosJson = localStorage.getItem(SCENARIOS_KEY);
            return scenariosJson ? JSON.parse(scenariosJson) : [];
        } catch (error) {
            console.error('Error loading scenarios:', error);
            return [];
        }
    }
    
    function saveScenarios(scenarios) {
        try {
            localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
            return true;
        } catch (error) {
            console.error('Error saving scenarios:', error);
            return false;
        }
    }
    
    function updateScenariosList() {
        const scenariosList = document.getElementById('scenarios-list');
        if (!scenariosList) return;
        
        // Clear existing content
        scenariosList.innerHTML = '';
        
        // Get scenarios
        const scenarios = loadScenarios();
        
        if (scenarios.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'scenarios-empty-message';
            emptyMessage.textContent = 'No scenarios yet. Create your first scenario to get started.';
            scenariosList.appendChild(emptyMessage);
            return;
        }
        
        // Create scenario items
        scenarios.forEach(scenario => {
            const scenarioItem = createScenarioItem(scenario);
            scenariosList.appendChild(scenarioItem);
        });
    }
    
    function createScenarioItem(scenario) {
        const scenarioItem = document.createElement('div');
        scenarioItem.className = 'scenario-item';
        if (scenario.id === currentScenarioId) {
            scenarioItem.classList.add('scenario-item--active');
        }
        
        // Create scenario header
        const scenarioHeader = document.createElement('div');
        scenarioHeader.className = 'scenario-item-header';
        
        const scenarioTitle = document.createElement('h5');
        scenarioTitle.className = 'scenario-item-title';
        scenarioTitle.textContent = scenario.name;
        
        const scenarioDate = document.createElement('span');
        scenarioDate.className = 'scenario-item-date';
        scenarioDate.textContent = new Date(scenario.createdAt).toLocaleDateString();
        
        scenarioHeader.appendChild(scenarioTitle);
        scenarioHeader.appendChild(scenarioDate);
        
        // Create scenario details
        const scenarioDetails = document.createElement('div');
        scenarioDetails.className = 'scenario-item-details';
        
        // Add certification count
        if (scenario.roadmap && scenario.roadmap.certifications) {
            const certCount = document.createElement('div');
            certCount.className = 'scenario-item-detail';
            certCount.innerHTML = `<strong>Certifications:</strong> ${scenario.roadmap.certifications.length}`;
            scenarioDetails.appendChild(certCount);
        }
        
        // Add provider info
        if (scenario.assessment && scenario.assessment.providers) {
            const providers = Object.keys(scenario.assessment.providers)
                .filter(provider => scenario.assessment.providers[provider].selected)
                .join(', ');
            
            if (providers) {
                const providerInfo = document.createElement('div');
                providerInfo.className = 'scenario-item-detail';
                providerInfo.innerHTML = `<strong>Providers:</strong> ${providers}`;
                scenarioDetails.appendChild(providerInfo);
            }
        }
        
        // Create scenario actions
        const scenarioActions = document.createElement('div');
        scenarioActions.className = 'scenario-item-actions';
        
        const loadButton = document.createElement('button');
        loadButton.className = 'scenario-item-button';
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => {
            loadScenario(scenario.id);
        });
        
        const editButton = document.createElement('button');
        editButton.className = 'scenario-item-button';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            editScenario(scenario.id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'scenario-item-button scenario-item-button--danger';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteScenario(scenario.id);
        });
        
        const shareButton = document.createElement('button');
        shareButton.className = 'scenario-item-button';
        shareButton.textContent = 'Share';
        shareButton.addEventListener('click', () => {
            shareScenario(scenario.id);
        });
        
        scenarioActions.appendChild(loadButton);
        scenarioActions.appendChild(editButton);
        scenarioActions.appendChild(deleteButton);
        scenarioActions.appendChild(shareButton);
        
        // Assemble scenario item
        scenarioItem.appendChild(scenarioHeader);
        scenarioItem.appendChild(scenarioDetails);
        scenarioItem.appendChild(scenarioActions);
        
        return scenarioItem;
    }
    
    function createNewScenario() {
        // Get current data
        const assessment = window.CertificationRoadmap.StorageService.loadAssessment();
        const careerGoals = window.CertificationRoadmap.StorageService.loadCareerGoals();
        const roadmap = window.CertificationRoadmap.StorageService.loadRoadmap();
        const studyPlan = window.CertificationRoadmap.StorageService.loadStudyPlan();
        
        // Check if we have data to create a scenario
        if (!assessment || !careerGoals || !roadmap) {
            showNotification('Please complete the assessment, career goals, and generate a roadmap before creating a scenario.', 'error');
            return;
        }
        
        // Create scenario name input dialog
        const nameDialog = document.createElement('div');
        nameDialog.className = 'scenario-name-dialog';
        nameDialog.setAttribute('role', 'dialog');
        nameDialog.setAttribute('aria-labelledby', 'scenario-name-title');
        
        const nameDialogContent = document.createElement('div');
        nameDialogContent.className = 'scenario-name-dialog-content';
        
        const nameDialogHeader = document.createElement('div');
        nameDialogHeader.className = 'scenario-name-dialog-header';
        
        const nameDialogTitle = document.createElement('h3');
        nameDialogTitle.id = 'scenario-name-title';
        nameDialogTitle.textContent = 'Create New Scenario';
        
        const nameDialogCloseButton = document.createElement('button');
        nameDialogCloseButton.className = 'scenario-name-dialog-close';
        nameDialogCloseButton.innerHTML = '&times;';
        nameDialogCloseButton.setAttribute('aria-label', 'Close dialog');
        nameDialogCloseButton.addEventListener('click', () => {
            document.body.removeChild(nameDialog);
        });
        
        nameDialogHeader.appendChild(nameDialogTitle);
        nameDialogHeader.appendChild(nameDialogCloseButton);
        
        const nameDialogBody = document.createElement('div');
        nameDialogBody.className = 'scenario-name-dialog-body';
        
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'scenario-name-input';
        nameLabel.textContent = 'Scenario Name:';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'scenario-name-input';
        nameInput.className = 'scenario-name-input';
        nameInput.placeholder = 'Enter a name for your scenario';
        nameInput.value = `Scenario ${new Date().toLocaleDateString()}`;
        
        const nameDialogFooter = document.createElement('div');
        nameDialogFooter.className = 'scenario-name-dialog-footer';
        
        const createButton = document.createElement('button');
        createButton.className = 'scenario-name-button scenario-name-button-primary';
        createButton.textContent = 'Create';
        createButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (!name) {
                showNotification('Please enter a name for your scenario.', 'error');
                return;
            }
            
            // Create new scenario
            const scenarioId = `scenario-${Date.now()}`;
            const scenario = {
                id: scenarioId,
                name: name,
                createdAt: new Date().toISOString(),
                assessment: assessment,
                careerGoals: careerGoals,
                roadmap: roadmap,
                studyPlan: studyPlan
            };
            
            // Save scenario
            const scenarios = loadScenarios();
            scenarios.push(scenario);
            saveScenarios(scenarios);
            
            // Set as current scenario
            currentScenarioId = scenarioId;
            
            // Update scenarios list
            updateScenariosList();
            
            // Close dialog
            document.body.removeChild(nameDialog);
            
            // Show notification
            showNotification(`Scenario "${name}" created successfully.`, 'success');
        });
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'scenario-name-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(nameDialog);
        });
        
        nameDialogFooter.appendChild(createButton);
        nameDialogFooter.appendChild(cancelButton);
        
        nameDialogBody.appendChild(nameLabel);
        nameDialogBody.appendChild(nameInput);
        
        nameDialogContent.appendChild(nameDialogHeader);
        nameDialogContent.appendChild(nameDialogBody);
        nameDialogContent.appendChild(nameDialogFooter);
        
        nameDialog.appendChild(nameDialogContent);
        
        // Add dialog to body
        document.body.appendChild(nameDialog);
        
        // Focus on input
        nameInput.focus();
    }
    
    function loadScenario(scenarioId) {
        // Get scenarios
        const scenarios = loadScenarios();
        
        // Find scenario
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (!scenario) {
            showNotification(`Scenario with ID ${scenarioId} not found.`, 'error');
            return;
        }
        
        // Load scenario data
        if (scenario.assessment) {
            window.CertificationRoadmap.StorageService.saveAssessment(scenario.assessment);
        }
        
        if (scenario.careerGoals) {
            window.CertificationRoadmap.StorageService.saveCareerGoals(scenario.careerGoals);
        }
        
        if (scenario.roadmap) {
            window.CertificationRoadmap.StorageService.saveRoadmap(scenario.roadmap);
        }
        
        if (scenario.studyPlan) {
            window.CertificationRoadmap.StorageService.saveStudyPlan(scenario.studyPlan);
        }
        
        // Set as current scenario
        currentScenarioId = scenarioId;
        
        // Update scenarios list
        updateScenariosList();
        
        // Hide dialog
        hideScenarioManagerDialog();
        
        // Show notification
        showNotification(`Scenario "${scenario.name}" loaded successfully. Please refresh the page to see the changes.`, 'success');
    }
    
    function editScenario(scenarioId) {
        // Get scenarios
        const scenarios = loadScenarios();
        
        // Find scenario
        const scenarioIndex = scenarios.findIndex(s => s.id === scenarioId);
        if (scenarioIndex === -1) {
            showNotification(`Scenario with ID ${scenarioId} not found.`, 'error');
            return;
        }
        
        const scenario = scenarios[scenarioIndex];
        
        // Create edit dialog
        const editDialog = document.createElement('div');
        editDialog.className = 'scenario-edit-dialog';
        editDialog.setAttribute('role', 'dialog');
        editDialog.setAttribute('aria-labelledby', 'scenario-edit-title');
        
        const editDialogContent = document.createElement('div');
        editDialogContent.className = 'scenario-edit-dialog-content';
        
        const editDialogHeader = document.createElement('div');
        editDialogHeader.className = 'scenario-edit-dialog-header';
        
        const editDialogTitle = document.createElement('h3');
        editDialogTitle.id = 'scenario-edit-title';
        editDialogTitle.textContent = 'Edit Scenario';
        
        const editDialogCloseButton = document.createElement('button');
        editDialogCloseButton.className = 'scenario-edit-dialog-close';
        editDialogCloseButton.innerHTML = '&times;';
        editDialogCloseButton.setAttribute('aria-label', 'Close dialog');
        editDialogCloseButton.addEventListener('click', () => {
            document.body.removeChild(editDialog);
        });
        
        editDialogHeader.appendChild(editDialogTitle);
        editDialogHeader.appendChild(editDialogCloseButton);
        
        const editDialogBody = document.createElement('div');
        editDialogBody.className = 'scenario-edit-dialog-body';
        
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'scenario-edit-name-input';
        nameLabel.textContent = 'Scenario Name:';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'scenario-edit-name-input';
        nameInput.className = 'scenario-edit-name-input';
        nameInput.value = scenario.name;
        
        const editDialogFooter = document.createElement('div');
        editDialogFooter.className = 'scenario-edit-dialog-footer';
        
        const saveButton = document.createElement('button');
        saveButton.className = 'scenario-edit-button scenario-edit-button-primary';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (!name) {
                showNotification('Please enter a name for your scenario.', 'error');
                return;
            }
            
            // Update scenario
            scenarios[scenarioIndex].name = name;
            
            // Save scenarios
            saveScenarios(scenarios);
            
            // Update scenarios list
            updateScenariosList();
            
            // Close dialog
            document.body.removeChild(editDialog);
            
            // Show notification
            showNotification(`Scenario "${name}" updated successfully.`, 'success');
        });
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'scenario-edit-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(editDialog);
        });
        
        editDialogFooter.appendChild(saveButton);
        editDialogFooter.appendChild(cancelButton);
        
        editDialogBody.appendChild(nameLabel);
        editDialogBody.appendChild(nameInput);
        
        editDialogContent.appendChild(editDialogHeader);
        editDialogContent.appendChild(editDialogBody);
        editDialogContent.appendChild(editDialogFooter);
        
        editDialog.appendChild(editDialogContent);
        
        // Add dialog to body
        document.body.appendChild(editDialog);
        
        // Focus on input
        nameInput.focus();
    }
    
    function deleteScenario(scenarioId) {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this scenario? This action cannot be undone.')) {
            return;
        }
        
        // Get scenarios
        const scenarios = loadScenarios();
        
        // Find scenario
        const scenarioIndex = scenarios.findIndex(s => s.id === scenarioId);
        if (scenarioIndex === -1) {
            showNotification(`Scenario with ID ${scenarioId} not found.`, 'error');
            return;
        }
        
        const scenarioName = scenarios[scenarioIndex].name;
        
        // Remove scenario
        scenarios.splice(scenarioIndex, 1);
        
        // Save scenarios
        saveScenarios(scenarios);
        
        // Update current scenario ID if needed
        if (currentScenarioId === scenarioId) {
            currentScenarioId = null;
        }
        
        // Update scenarios list
        updateScenariosList();
        
        // Show notification
        showNotification(`Scenario "${scenarioName}" deleted successfully.`, 'success');
    }
    
    function shareScenario(scenarioId) {
        // Get scenarios
        const scenarios = loadScenarios();
        
        // Find scenario
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (!scenario) {
            showNotification(`Scenario with ID ${scenarioId} not found.`, 'error');
            return;
        }
        
        // Create export data
        const exportData = {
            version: '1.0.0',
            timestamp: new Date(),
            scenario: scenario
        };
        
        // Convert to JSON
        const jsonData = JSON.stringify(exportData);
        
        // Create a blob from the data
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Create a download link
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `certification-roadmap-scenario-${scenario.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
        
        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(a.href);
        
        // Show notification
        showNotification(`Scenario "${scenario.name}" exported successfully. You can share this file with others.`, 'success');
    }
    
    function showScenarioComparisonDialog() {
        // Get scenarios
        const scenarios = loadScenarios();
        
        // Check if we have enough scenarios to compare
        if (scenarios.length < 2) {
            showNotification('You need at least 2 scenarios to compare.', 'error');
            return;
        }
        
        // Create dialog
        scenarioComparisonDialog = document.createElement('div');
        scenarioComparisonDialog.className = 'scenario-comparison-dialog';
        scenarioComparisonDialog.setAttribute('role', 'dialog');
        scenarioComparisonDialog.setAttribute('aria-labelledby', 'scenario-comparison-title');
        
        const dialogContent = document.createElement('div');
        dialogContent.className = 'scenario-comparison-dialog-content';
        
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'scenario-comparison-dialog-header';
        
        const dialogTitle = document.createElement('h3');
        dialogTitle.id = 'scenario-comparison-title';
        dialogTitle.textContent = 'Compare Scenarios';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'scenario-comparison-dialog-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close dialog');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(scenarioComparisonDialog);
            scenarioComparisonDialog = null;
        });
        
        dialogHeader.appendChild(dialogTitle);
        dialogHeader.appendChild(closeButton);
        
        const dialogBody = document.createElement('div');
        dialogBody.className = 'scenario-comparison-dialog-body';
        
        // Create scenario selection
        const selectionSection = document.createElement('div');
        selectionSection.className = 'scenario-comparison-selection';
        
        const scenario1Label = document.createElement('label');
        scenario1Label.htmlFor = 'scenario-comparison-select-1';
        scenario1Label.textContent = 'Scenario 1:';
        
        const scenario1Select = document.createElement('select');
        scenario1Select.id = 'scenario-comparison-select-1';
        scenario1Select.className = 'scenario-comparison-select';
        
        const scenario2Label = document.createElement('label');
        scenario2Label.htmlFor = 'scenario-comparison-select-2';
        scenario2Label.textContent = 'Scenario 2:';
        
        const scenario2Select = document.createElement('select');
        scenario2Select.id = 'scenario-comparison-select-2';
        scenario2Select.className = 'scenario-comparison-select';
        
        // Add options for each scenario
        scenarios.forEach(scenario => {
            const option1 = document.createElement('option');
            option1.value = scenario.id;
            option1.textContent = scenario.name;
            
            const option2 = document.createElement('option');
            option2.value = scenario.id;
            option2.textContent = scenario.name;
            
            scenario1Select.appendChild(option1);
            scenario2Select.appendChild(option2);
        });
        
        // Set default selection for scenario 2
        if (scenarios.length > 1) {
            scenario2Select.selectedIndex = 1;
        }
        
        const compareButton = document.createElement('button');
        compareButton.className = 'scenario-comparison-button';
        compareButton.textContent = 'Compare';
        compareButton.addEventListener('click', () => {
            const scenario1Id = scenario1Select.value;
            const scenario2Id = scenario2Select.value;
            
            if (scenario1Id === scenario2Id) {
                showNotification('Please select different scenarios to compare.', 'error');
                return;
            }
            
            compareScenarios(scenario1Id, scenario2Id);
        });
        
        selectionSection.appendChild(scenario1Label);
        selectionSection.appendChild(scenario1Select);
        selectionSection.appendChild(scenario2Label);
        selectionSection.appendChild(scenario2Select);
        selectionSection.appendChild(compareButton);
        
        // Create comparison results section
        const resultsSection = document.createElement('div');
        resultsSection.id = 'scenario-comparison-results';
        resultsSection.className = 'scenario-comparison-results';
        
        dialogBody.appendChild(selectionSection);
        dialogBody.appendChild(resultsSection);
        
        // Assemble dialog
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(dialogBody);
        
        scenarioComparisonDialog.appendChild(dialogContent);
        
        // Add dialog to body
        document.body.appendChild(scenarioComparisonDialog);
    }
    
    function compareScenarios(scenario1Id, scenario2Id) {
        // Get scenarios
        const scenarios = loadScenarios();
        
        // Find scenarios
        const scenario1 = scenarios.find(s => s.id === scenario1Id);
        const scenario2 = scenarios.find(s => s.id === scenario2Id);
        
        if (!scenario1 || !scenario2) {
            showNotification('One or both scenarios not found.', 'error');
            return;
        }
        
        // Get results container
        const resultsContainer = document.getElementById('scenario-comparison-results');
        if (!resultsContainer) return;
        
        // Clear existing content
        resultsContainer.innerHTML = '';
        
        // Create comparison table
        const comparisonTable = document.createElement('table');
        comparisonTable.className = 'scenario-comparison-table';
        
        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headerCell1 = document.createElement('th');
        headerCell1.textContent = 'Feature';
        
        const headerCell2 = document.createElement('th');
        headerCell2.textContent = scenario1.name;
        
        const headerCell3 = document.createElement('th');
        headerCell3.textContent = scenario2.name;
        
        headerRow.appendChild(headerCell1);
        headerRow.appendChild(headerCell2);
        headerRow.appendChild(headerCell3);
        tableHeader.appendChild(headerRow);
        
        // Create table body
        const tableBody = document.createElement('tbody');
        
        // Add creation date row
        const dateRow = document.createElement('tr');
        
        const dateCell1 = document.createElement('td');
        dateCell1.textContent = 'Created';
        
        const dateCell2 = document.createElement('td');
        dateCell2.textContent = new Date(scenario1.createdAt).toLocaleDateString();
        
        const dateCell3 = document.createElement('td');
        dateCell3.textContent = new Date(scenario2.createdAt).toLocaleDateString();
        
        dateRow.appendChild(dateCell1);
        dateRow.appendChild(dateCell2);
        dateRow.appendChild(dateCell3);
        tableBody.appendChild(dateRow);
        
        // Add providers row
        const providersRow = document.createElement('tr');
        
        const providersCell1 = document.createElement('td');
        providersCell1.textContent = 'Cloud Providers';
        
        const providersCell2 = document.createElement('td');
        providersCell2.textContent = getProviders(scenario1);
        
        const providersCell3 = document.createElement('td');
        providersCell3.textContent = getProviders(scenario2);
        
        providersRow.appendChild(providersCell1);
        providersRow.appendChild(providersCell2);
        providersRow.appendChild(providersCell3);
        tableBody.appendChild(providersRow);
        
        // Add certification count row
        const certCountRow = document.createElement('tr');
        
        const certCountCell1 = document.createElement('td');
        certCountCell1.textContent = 'Certification Count';
        
        const certCountCell2 = document.createElement('td');
        certCountCell2.textContent = getCertificationCount(scenario1);
        
        const certCountCell3 = document.createElement('td');
        certCountCell3.textContent = getCertificationCount(scenario2);
        
        certCountRow.appendChild(certCountCell1);
        certCountRow.appendChild(certCountCell2);
        certCountRow.appendChild(certCountCell3);
        tableBody.appendChild(certCountRow);
        
        // Add estimated completion time row
        const timeRow = document.createElement('tr');
        
        const timeCell1 = document.createElement('td');
        timeCell1.textContent = 'Estimated Completion Time';
        
        const timeCell2 = document.createElement('td');
        timeCell2.textContent = getCompletionTime(scenario1);
        
        const timeCell3 = document.createElement('td');
        timeCell3.textContent = getCompletionTime(scenario2);
        
        timeRow.appendChild(timeCell1);
        timeRow.appendChild(timeCell2);
        timeRow.appendChild(timeCell3);
        tableBody.appendChild(timeRow);
        
        // Assemble table
        comparisonTable.appendChild(tableHeader);
        comparisonTable.appendChild(tableBody);
        
        // Add table to results container
        resultsContainer.appendChild(comparisonTable);
        
        // Add certification comparison
        const certComparisonTitle = document.createElement('h4');
        certComparisonTitle.textContent = 'Certification Comparison';
        resultsContainer.appendChild(certComparisonTitle);
        
        const certComparison = compareCertifications(scenario1, scenario2);
        resultsContainer.appendChild(certComparison);
        
        // Add export button
        const exportButton = document.createElement('button');
        exportButton.className = 'scenario-comparison-export-button';
        exportButton.textContent = 'Export Comparison';
        exportButton.addEventListener('click', () => {
            exportComparison(scenario1, scenario2);
        });
        
        resultsContainer.appendChild(exportButton);
    }
    
    function getProviders(scenario) {
        if (!scenario.assessment || !scenario.assessment.providers) {
            return 'None';
        }
        
        const providers = Object.keys(scenario.assessment.providers)
            .filter(provider => scenario.assessment.providers[provider].selected)
            .join(', ');
        
        return providers || 'None';
    }
    
    function getCertificationCount(scenario) {
        if (!scenario.roadmap || !scenario.roadmap.certifications) {
            return '0';
        }
        
        return scenario.roadmap.certifications.length.toString();
    }
    
    function getCompletionTime(scenario) {
        if (!scenario.studyPlan || !scenario.studyPlan.estimatedCompletionTime) {
            return 'Unknown';
        }
        
        const months = scenario.studyPlan.estimatedCompletionTime.months || 0;
        const weeks = scenario.studyPlan.estimatedCompletionTime.weeks || 0;
        
        if (months > 0 && weeks > 0) {
            return `${months} month${months > 1 ? 's' : ''}, ${weeks} week${weeks > 1 ? 's' : ''}`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''}`;
        } else if (weeks > 0) {
            return `${weeks} week${weeks > 1 ? 's' : ''}`;
        } else {
            return 'Unknown';
        }
    }
    
    function compareCertifications(scenario1, scenario2) {
        const container = document.createElement('div');
        container.className = 'certification-comparison';
        
        // Get certifications
        const certs1 = scenario1.roadmap && scenario1.roadmap.certifications ? scenario1.roadmap.certifications : [];
        const certs2 = scenario2.roadmap && scenario2.roadmap.certifications ? scenario2.roadmap.certifications : [];
        
        // Find common and unique certifications
        const commonCerts = [];
        const uniqueCerts1 = [];
        const uniqueCerts2 = [];
        
        certs1.forEach(cert1 => {
            const match = certs2.find(cert2 => cert2.id === cert1.id);
            if (match) {
                commonCerts.push(cert1);
            } else {
                uniqueCerts1.push(cert1);
            }
        });
        
        certs2.forEach(cert2 => {
            const match = certs1.find(cert1 => cert1.id === cert2.id);
            if (!match) {
                uniqueCerts2.push(cert2);
            }
        });
        
        // Create common certifications section
        if (commonCerts.length > 0) {
            const commonSection = document.createElement('div');
            commonSection.className = 'certification-comparison-section';
            
            const commonTitle = document.createElement('h5');
            commonTitle.textContent = 'Common Certifications';
            commonSection.appendChild(commonTitle);
            
            const commonList = document.createElement('ul');
            commonList.className = 'certification-comparison-list';
            
            commonCerts.forEach(cert => {
                const listItem = document.createElement('li');
                listItem.textContent = cert.name;
                commonList.appendChild(listItem);
            });
            
            commonSection.appendChild(commonList);
            container.appendChild(commonSection);
        }
        
        // Create unique certifications sections
        const uniqueContainer = document.createElement('div');
        uniqueContainer.className = 'certification-comparison-unique';
        
        if (uniqueCerts1.length > 0) {
            const unique1Section = document.createElement('div');
            unique1Section.className = 'certification-comparison-section';
            
            const unique1Title = document.createElement('h5');
            unique1Title.textContent = `Unique to ${scenario1.name}`;
            unique1Section.appendChild(unique1Title);
            
            const unique1List = document.createElement('ul');
            unique1List.className = 'certification-comparison-list';
            
            uniqueCerts1.forEach(cert => {
                const listItem = document.createElement('li');
                listItem.textContent = cert.name;
                unique1List.appendChild(listItem);
            });
            
            unique1Section.appendChild(unique1List);
            uniqueContainer.appendChild(unique1Section);
        }
        
        if (uniqueCerts2.length > 0) {
            const unique2Section = document.createElement('div');
            unique2Section.className = 'certification-comparison-section';
            
            const unique2Title = document.createElement('h5');
            unique2Title.textContent = `Unique to ${scenario2.name}`;
            unique2Section.appendChild(unique2Title);
            
            const unique2List = document.createElement('ul');
            unique2List.className = 'certification-comparison-list';
            
            uniqueCerts2.forEach(cert => {
                const listItem = document.createElement('li');
                listItem.textContent = cert.name;
                unique2List.appendChild(listItem);
            });
            
            unique2Section.appendChild(unique2List);
            uniqueContainer.appendChild(unique2Section);
        }
        
        container.appendChild(uniqueContainer);
        
        return container;
    }
    
    function exportComparison(scenario1, scenario2) {
        // Create export data
        const exportData = {
            version: '1.0.0',
            timestamp: new Date(),
            comparison: {
                scenario1: {
                    id: scenario1.id,
                    name: scenario1.name,
                    createdAt: scenario1.createdAt,
                    providers: getProviders(scenario1),
                    certificationCount: getCertificationCount(scenario1),
                    completionTime: getCompletionTime(scenario1),
                    certifications: scenario1.roadmap && scenario1.roadmap.certifications ? scenario1.roadmap.certifications.map(c => c.name) : []
                },
                scenario2: {
                    id: scenario2.id,
                    name: scenario2.name,
                    createdAt: scenario2.createdAt,
                    providers: getProviders(scenario2),
                    certificationCount: getCertificationCount(scenario2),
                    completionTime: getCompletionTime(scenario2),
                    certifications: scenario2.roadmap && scenario2.roadmap.certifications ? scenario2.roadmap.certifications.map(c => c.name) : []
                }
            }
        };
        
        // Convert to JSON
        const jsonData = JSON.stringify(exportData, null, 2);
        
        // Create a blob from the data
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Create a download link
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `certification-roadmap-comparison-${scenario1.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-vs-${scenario2.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
        
        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(a.href);
        
        // Show notification
        showNotification('Comparison exported successfully.', 'success');
    }
    
    function showScenarioManagerDialog() {
        if (!scenarioManagerDialog) {
            createScenarioManagerDialog();
        }
        
        // Update scenarios list
        updateScenariosList();
        
        scenarioManagerDialog.style.display = 'flex';
    }
    
    function hideScenarioManagerDialog() {
        if (scenarioManagerDialog) {
            scenarioManagerDialog.style.display = 'none';
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
         * Initialize the scenario manager
         */
        initScenarioManager: function() {
            // Create scenario manager dialog
            createScenarioManagerDialog();
        },
        
        /**
         * Show the scenario manager dialog
         */
        showScenarioManager: function() {
            showScenarioManagerDialog();
        },
        
        /**
         * Get the current scenario ID
         * @returns {String|null} The current scenario ID or null if no scenario is active
         */
        getCurrentScenarioId: function() {
            return currentScenarioId;
        },
        
        /**
         * Set the current scenario ID
         * @param {String} scenarioId - The scenario ID to set as current
         */
        setCurrentScenarioId: function(scenarioId) {
            currentScenarioId = scenarioId;
        },
        
        /**
         * Create a new scenario
         */
        createNewScenario: function() {
            createNewScenario();
        },
        
        /**
         * Load a scenario
         * @param {String} scenarioId - The scenario ID to load
         */
        loadScenario: function(scenarioId) {
            loadScenario(scenarioId);
        }
    };
})();