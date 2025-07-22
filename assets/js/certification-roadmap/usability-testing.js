/**
 * Cloud Certification Roadmap - Usability Testing
 * 
 * This module provides usability testing functionality for the Cloud Certification Roadmap.
 */

// Usability Testing Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.UsabilityTesting = (function() {
    // Private variables
    let isTestMode = false;
    let testResults = {
        tasks: {},
        interactions: [],
        errors: [],
        timing: {}
    };
    let startTime = null;
    let currentTask = null;
    
    // Private functions
    function initUsabilityTesting() {
        // Check if we're in test mode
        const urlParams = new URLSearchParams(window.location.search);
        isTestMode = urlParams.has('usability-test');
        
        if (isTestMode) {
            console.log('Usability testing mode enabled');
            
            // Add test mode indicator
            addTestModeIndicator();
            
            // Start tracking interactions
            trackInteractions();
            
            // Add task completion buttons
            addTaskCompletionButtons();
            
            // Start timing
            startTime = new Date();
            testResults.timing.start = startTime.toISOString();
        }
    }
    
    function addTestModeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'usability-test-indicator';
        indicator.textContent = 'Usability Test Mode';
        
        // Add help button
        const helpButton = document.createElement('button');
        helpButton.className = 'usability-test-help-button';
        helpButton.textContent = '?';
        helpButton.setAttribute('aria-label', 'Usability test help');
        helpButton.addEventListener('click', showTestHelp);
        
        indicator.appendChild(helpButton);
        
        // Add to body
        document.body.appendChild(indicator);
    }
    
    function showTestHelp() {
        const helpDialog = document.createElement('div');
        helpDialog.className = 'usability-test-help-dialog';
        
        const helpContent = document.createElement('div');
        helpContent.className = 'usability-test-help-content';
        
        const helpTitle = document.createElement('h3');
        helpTitle.textContent = 'Usability Test Mode';
        
        const helpText = document.createElement('p');
        helpText.textContent = 'You are currently in usability test mode. This mode tracks your interactions with the application to help us improve the user experience. Please complete the tasks as instructed by the test facilitator.';
        
        const tasksList = document.createElement('ul');
        tasksList.innerHTML = `
            <li>Task 1: Initial Exploration</li>
            <li>Task 2: Complete the Skill Assessment</li>
            <li>Task 3: Define Career Goals</li>
            <li>Task 4: Explore the Certification Roadmap</li>
            <li>Task 5: Explore the Study Plan</li>
            <li>Task 6: Explore the Resources</li>
            <li>Task 7: Data Management</li>
            <li>Task 8: Scenario Management</li>
            <li>Task 9: Accessibility Testing</li>
            <li>Task 10: Responsive Design Testing</li>
        `;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'usability-test-help-close';
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(helpDialog);
        });
        
        helpContent.appendChild(helpTitle);
        helpContent.appendChild(helpText);
        helpContent.appendChild(tasksList);
        helpContent.appendChild(closeButton);
        
        helpDialog.appendChild(helpContent);
        document.body.appendChild(helpDialog);
    }
    
    function trackInteractions() {
        // Track clicks
        document.addEventListener('click', function(event) {
            if (!isTestMode) return;
            
            const target = event.target;
            const tagName = target.tagName.toLowerCase();
            const className = target.className;
            const id = target.id;
            const text = target.textContent.trim();
            
            testResults.interactions.push({
                type: 'click',
                element: {
                    tagName,
                    className,
                    id,
                    text
                },
                timestamp: new Date().toISOString()
            });
        });
        
        // Track form submissions
        document.addEventListener('submit', function(event) {
            if (!isTestMode) return;
            
            const form = event.target;
            const id = form.id;
            const className = form.className;
            
            testResults.interactions.push({
                type: 'form-submit',
                element: {
                    tagName: 'form',
                    id,
                    className
                },
                timestamp: new Date().toISOString()
            });
        });
        
        // Track errors
        window.addEventListener('error', function(event) {
            if (!isTestMode) return;
            
            testResults.errors.push({
                message: event.message,
                source: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: new Date().toISOString()
            });
        });
        
        // Track navigation
        document.addEventListener('navigate-to-step', function(event) {
            if (!isTestMode) return;
            
            const step = event.detail.step;
            
            testResults.interactions.push({
                type: 'navigation',
                step,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    function addTaskCompletionButtons() {
        const taskButtons = document.createElement('div');
        taskButtons.className = 'usability-test-task-buttons';
        
        // Create task buttons
        for (let i = 1; i <= 10; i++) {
            const button = document.createElement('button');
            button.className = 'usability-test-task-button';
            button.textContent = `Task ${i}`;
            button.setAttribute('data-task', i);
            button.addEventListener('click', function() {
                startTask(i);
            });
            
            taskButtons.appendChild(button);
        }
        
        // Create complete button
        const completeButton = document.createElement('button');
        completeButton.className = 'usability-test-complete-button';
        completeButton.textContent = 'Complete Task';
        completeButton.addEventListener('click', completeTask);
        
        taskButtons.appendChild(completeButton);
        
        // Create export results button
        const exportButton = document.createElement('button');
        exportButton.className = 'usability-test-export-button';
        exportButton.textContent = 'Export Results';
        exportButton.addEventListener('click', exportResults);
        
        taskButtons.appendChild(exportButton);
        
        // Add to body
        document.body.appendChild(taskButtons);
    }
    
    function startTask(taskNumber) {
        // Complete previous task if exists
        if (currentTask) {
            completeTask();
        }
        
        // Set current task
        currentTask = taskNumber;
        
        // Record task start time
        testResults.tasks[taskNumber] = {
            start: new Date().toISOString(),
            end: null,
            duration: null
        };
        
        // Update UI
        updateTaskButtons();
        
        // Show notification
        showNotification(`Task ${taskNumber} started`);
    }
    
    function completeTask() {
        if (!currentTask) return;
        
        // Record task end time
        const endTime = new Date();
        testResults.tasks[currentTask].end = endTime.toISOString();
        
        // Calculate duration
        const startTime = new Date(testResults.tasks[currentTask].start);
        const duration = (endTime - startTime) / 1000; // in seconds
        testResults.tasks[currentTask].duration = duration;
        
        // Reset current task
        currentTask = null;
        
        // Update UI
        updateTaskButtons();
        
        // Show notification
        showNotification('Task completed');
    }
    
    function updateTaskButtons() {
        const taskButtons = document.querySelectorAll('.usability-test-task-button');
        
        taskButtons.forEach(button => {
            const taskNumber = parseInt(button.getAttribute('data-task'));
            
            // Reset all buttons
            button.classList.remove('active', 'completed');
            
            // Mark current task as active
            if (taskNumber === currentTask) {
                button.classList.add('active');
            }
            
            // Mark completed tasks
            if (testResults.tasks[taskNumber] && testResults.tasks[taskNumber].end) {
                button.classList.add('completed');
            }
        });
    }
    
    function exportResults() {
        // Add end time
        testResults.timing.end = new Date().toISOString();
        
        // Calculate total duration
        const endTime = new Date();
        const totalDuration = (endTime - startTime) / 1000; // in seconds
        testResults.timing.duration = totalDuration;
        
        // Convert to JSON
        const json = JSON.stringify(testResults, null, 2);
        
        // Create download link
        const a = document.createElement('a');
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        a.href = url;
        a.download = `usability-test-results-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show notification
        showNotification('Test results exported');
    }
    
    function showNotification(message) {
        // Use the main notification system if available
        if (window.CertificationRoadmap.App && window.CertificationRoadmap.App.showNotification) {
            window.CertificationRoadmap.App.showNotification(message);
        } else {
            // Create a simple notification
            const notification = document.createElement('div');
            notification.className = 'usability-test-notification';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
        }
    }
    
    // Public API
    return {
        /**
         * Initialize usability testing
         */
        init: function() {
            initUsabilityTesting();
        },
        
        /**
         * Check if usability testing mode is enabled
         * @returns {Boolean} True if usability testing mode is enabled
         */
        isTestModeEnabled: function() {
            return isTestMode;
        },
        
        /**
         * Export test results
         */
        exportResults: function() {
            exportResults();
        }
    };
})();

// Initialize usability testing
document.addEventListener('DOMContentLoaded', function() {
    window.CertificationRoadmap.UsabilityTesting.init();
});