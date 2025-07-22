/**
 * Cloud Certification Roadmap - Study Plan
 * 
 * This module handles the generation and management of study plans for certifications.
 */

// Study Plan Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.StudyPlanModule = (function() {
    // Private variables
    let currentStudyPlan = null;
    let containerElement = null;
    
    // Private functions
    function calculateWeeklySchedule(topics, hoursPerWeek) {
        // Calculate total hours
        const totalHours = topics.reduce((sum, topic) => sum + topic.duration, 0);
        
        // Calculate total weeks needed
        const totalWeeks = Math.ceil(totalHours / hoursPerWeek);
        
        // Distribute topics across weeks
        const schedule = [];
        let currentWeek = 1;
        let remainingHoursInWeek = hoursPerWeek;
        
        topics.forEach(topic => {
            let remainingTopicHours = topic.duration;
            let topicStartWeek = currentWeek;
            
            while (remainingTopicHours > 0) {
                // How many hours can be allocated in the current week
                const hoursThisWeek = Math.min(remainingHoursInWeek, remainingTopicHours);
                
                // Add to schedule
                schedule.push({
                    topic: topic.name,
                    topicId: topic.id,
                    week: currentWeek,
                    hours: hoursThisWeek
                });
                
                // Update remaining hours
                remainingTopicHours -= hoursThisWeek;
                remainingHoursInWeek -= hoursThisWeek;
                
                // Check if we need to move to the next week
                if (remainingHoursInWeek === 0) {
                    currentWeek++;
                    remainingHoursInWeek = hoursPerWeek;
                }
            }
            
            // Update topic with week information
            topic.startWeek = topicStartWeek;
            topic.endWeek = currentWeek - (remainingHoursInWeek === hoursPerWeek ? 1 : 0);
        });
        
        return {
            schedule,
            totalWeeks
        };
    }
    
    function generateMilestones(totalWeeks, certificationName) {
        const milestones = [];
        
        // Add initial milestone
        milestones.push({
            id: 'milestone-start',
            name: 'Begin Study Plan',
            week: 1,
            description: `Start studying for ${certificationName}`,
            completed: false
        });
        
        // Add midpoint milestone
        const midpoint = Math.ceil(totalWeeks / 2);
        milestones.push({
            id: 'milestone-midpoint',
            name: 'Midpoint Review',
            week: midpoint,
            description: 'Review progress and adjust study plan if needed',
            completed: false
        });
        
        // Add practice exam milestone
        const practiceExamWeek = Math.max(midpoint + 1, totalWeeks - 2);
        milestones.push({
            id: 'milestone-practice',
            name: 'Practice Exam',
            week: practiceExamWeek,
            description: 'Take a practice exam to assess readiness',
            completed: false
        });
        
        // Add final review milestone
        milestones.push({
            id: 'milestone-final',
            name: 'Final Review',
            week: totalWeeks,
            description: 'Complete final review and prepare for the exam',
            completed: false
        });
        
        return milestones;
    }
    
    function generateTopicsFromCertification(certification) {
        if (!certification || !certification.topics) return [];
        
        const topics = [];
        
        // Generate topics based on certification exam topics
        certification.topics.forEach((examTopic, index) => {
            // Calculate hours based on topic weight and certification difficulty
            const baseHours = 10; // Base hours per topic
            const weightFactor = examTopic.weight / 100;
            const difficultyFactor = certification.difficulty / 3;
            
            const hours = Math.ceil(baseHours * weightFactor * difficultyFactor * 10);
            
            // Create topic
            topics.push({
                id: `topic-${index + 1}`,
                name: examTopic.name,
                certification: certification.id,
                duration: hours,
                status: 'not-started',
                progress: 0,
                startWeek: 0,
                endWeek: 0,
                resources: [],
                dependencies: [],
                notes: '',
                subtopics: examTopic.subtopics
            });
        });
        
        return topics;
    }
    
    function formatDate(date) {
        if (!date) return '';
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
    
    // Public API
    return {
        /**
         * Initialize the study plan component
         * @param {HTMLElement} container - The container element for the study plan
         */
        initStudyPlan: function(container) {
            if (!container) return;
            
            containerElement = container;
            
            // Create initial placeholder content
            container.innerHTML = `
                <div class="study-plan__placeholder">
                    <p>Select a certification to generate a study plan</p>
                </div>
            `;
        },
        
        /**
         * Generate a study plan for a certification
         * @param {String} certificationId - The ID of the certification
         * @param {Object} userPreferences - User preferences for the study plan
         * @returns {Object} The generated study plan
         */
        generateStudyPlan: function(certificationId, userPreferences) {
            // Get certification from database
            const certDatabase = window.CertificationRoadmap.CertificationDatabase;
            const certification = certDatabase.getCertificationById(certificationId);
            
            if (!certification) {
                console.error('Certification not found:', certificationId);
                return null;
            }
            
            // Get user preferences with defaults
            const preferences = {
                weeklyHours: 10,
                startDate: new Date(),
                ...userPreferences
            };
            
            // Create study plan object
            const studyPlan = window.CertificationRoadmap.DataModels.createStudyPlan();
            studyPlan.name = `${certification.shortName} Study Plan`;
            studyPlan.certifications = [certificationId];
            studyPlan.weeklyHours = preferences.weeklyHours;
            studyPlan.startDate = preferences.startDate;
            
            // Generate topics
            const topics = generateTopicsFromCertification(certification);
            
            // Calculate schedule
            const scheduleResult = calculateWeeklySchedule(topics, preferences.weeklyHours);
            
            // Calculate target end date
            const targetEndDate = new Date(preferences.startDate);
            targetEndDate.setDate(targetEndDate.getDate() + (scheduleResult.totalWeeks * 7));
            studyPlan.targetEndDate = targetEndDate;
            
            // Generate milestones
            const milestones = generateMilestones(scheduleResult.totalWeeks, certification.shortName);
            
            // Update study plan
            studyPlan.topics = topics;
            studyPlan.milestones = milestones;
            
            // Calculate total hours
            const totalHours = topics.reduce((sum, topic) => sum + topic.duration, 0);
            
            // Update progress
            studyPlan.progress = {
                completedTopics: 0,
                totalTopics: topics.length,
                completedHours: 0,
                totalHours: totalHours,
                percentage: 0
            };
            
            // Store current study plan
            currentStudyPlan = studyPlan;
            
            return studyPlan;
        },
        
        /**
         * Display a study plan in the container
         * @param {Object} studyPlan - The study plan to display
         */
        displayStudyPlan: function(studyPlan) {
            if (!containerElement || !studyPlan) return;
            
            // Get certification details
            const certDatabase = window.CertificationRoadmap.CertificationDatabase;
            const certification = certDatabase.getCertificationById(studyPlan.certifications[0]);
            
            if (!certification) {
                console.error('Certification not found:', studyPlan.certifications[0]);
                return;
            }
            
            // Create study plan HTML
            const studyPlanHtml = `
                <div class="study-plan__content">
                    <div class="study-plan__header">
                        <h3 class="study-plan__title">${studyPlan.name}</h3>
                        <div class="study-plan__meta">
                            <span class="study-plan__certification">${certification.name}</span>
                            <span class="study-plan__dates">
                                ${formatDate(studyPlan.startDate)} - ${formatDate(studyPlan.targetEndDate)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="study-plan__overview">
                        <div class="study-plan__stats">
                            <div class="study-plan__stat">
                                <span class="study-plan__stat-label">Weekly Hours:</span>
                                <span class="study-plan__stat-value">${studyPlan.weeklyHours}</span>
                            </div>
                            <div class="study-plan__stat">
                                <span class="study-plan__stat-label">Total Hours:</span>
                                <span class="study-plan__stat-value">${studyPlan.progress.totalHours}</span>
                            </div>
                            <div class="study-plan__stat">
                                <span class="study-plan__stat-label">Topics:</span>
                                <span class="study-plan__stat-value">${studyPlan.progress.totalTopics}</span>
                            </div>
                            <div class="study-plan__stat">
                                <span class="study-plan__stat-label">Progress:</span>
                                <span class="study-plan__stat-value">${studyPlan.progress.percentage}%</span>
                            </div>
                        </div>
                        
                        <div class="study-plan__progress-bar">
                            <div class="study-plan__progress-fill" style="width: ${studyPlan.progress.percentage}%"></div>
                        </div>
                    </div>
                    
                    <div class="study-plan__tabs">
                        <div class="study-plan__tab-headers">
                            <button class="study-plan__tab-button active" data-tab="schedule">Weekly Schedule</button>
                            <button class="study-plan__tab-button" data-tab="topics">Topics</button>
                            <button class="study-plan__tab-button" data-tab="milestones">Milestones</button>
                        </div>
                        
                        <div class="study-plan__tab-content active" data-tab="schedule">
                            <div class="study-plan__schedule">
                                <table class="study-plan__schedule-table">
                                    <thead>
                                        <tr>
                                            <th>Week</th>
                                            <th>Dates</th>
                                            <th>Topics</th>
                                            <th>Hours</th>
                                            <th>Milestones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="schedule-table-body">
                                        <!-- Schedule rows will be added here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="study-plan__tab-content" data-tab="topics">
                            <div class="study-plan__topics">
                                <div class="study-plan__topics-list" id="topics-list">
                                    <!-- Topic items will be added here -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="study-plan__tab-content" data-tab="milestones">
                            <div class="study-plan__milestones">
                                <div class="study-plan__milestones-list" id="milestones-list">
                                    <!-- Milestone items will be added here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Update container content
            containerElement.innerHTML = studyPlanHtml;
            
            // Set up tab switching
            const tabButtons = containerElement.querySelectorAll('.study-plan__tab-button');
            const tabContents = containerElement.querySelectorAll('.study-plan__tab-content');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Deactivate all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    // Activate selected tab
                    button.classList.add('active');
                    const tabName = button.getAttribute('data-tab');
                    containerElement.querySelector(`.study-plan__tab-content[data-tab="${tabName}"]`).classList.add('active');
                });
            });
            
            // Populate schedule table
            this.populateScheduleTable(studyPlan);
            
            // Populate topics list
            this.populateTopicsList(studyPlan);
            
            // Populate milestones list
            this.populateMilestonesList(studyPlan);
        },
        
        /**
         * Populate the schedule table with study plan data
         * @param {Object} studyPlan - The study plan
         */
        populateScheduleTable: function(studyPlan) {
            if (!containerElement || !studyPlan) return;
            
            const scheduleTableBody = containerElement.querySelector('#schedule-table-body');
            if (!scheduleTableBody) return;
            
            // Clear table body
            scheduleTableBody.innerHTML = '';
            
            // Group topics by week
            const weeklyTopics = {};
            studyPlan.topics.forEach(topic => {
                for (let week = topic.startWeek; week <= topic.endWeek; week++) {
                    if (!weeklyTopics[week]) {
                        weeklyTopics[week] = [];
                    }
                    weeklyTopics[week].push(topic);
                }
            });
            
            // Group milestones by week
            const weeklyMilestones = {};
            studyPlan.milestones.forEach(milestone => {
                if (!weeklyMilestones[milestone.week]) {
                    weeklyMilestones[milestone.week] = [];
                }
                weeklyMilestones[milestone.week].push(milestone);
            });
            
            // Calculate weekly hours
            const weeklyHours = {};
            studyPlan.topics.forEach(topic => {
                const weeksSpan = topic.endWeek - topic.startWeek + 1;
                const hoursPerWeek = Math.ceil(topic.duration / weeksSpan);
                
                for (let week = topic.startWeek; week <= topic.endWeek; week++) {
                    if (!weeklyHours[week]) {
                        weeklyHours[week] = 0;
                    }
                    weeklyHours[week] += hoursPerWeek;
                }
            });
            
            // Calculate total weeks
            const totalWeeks = Math.max(
                ...studyPlan.topics.map(topic => topic.endWeek),
                ...studyPlan.milestones.map(milestone => milestone.week)
            );
            
            // Create table rows for each week
            for (let week = 1; week <= totalWeeks; week++) {
                const row = document.createElement('tr');
                
                // Calculate week dates
                const weekStartDate = new Date(studyPlan.startDate);
                weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
                
                const weekEndDate = new Date(weekStartDate);
                weekEndDate.setDate(weekEndDate.getDate() + 6);
                
                // Week number
                const weekCell = document.createElement('td');
                weekCell.textContent = `Week ${week}`;
                row.appendChild(weekCell);
                
                // Week dates
                const datesCell = document.createElement('td');
                datesCell.textContent = `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`;
                row.appendChild(datesCell);
                
                // Topics
                const topicsCell = document.createElement('td');
                if (weeklyTopics[week]) {
                    const topicsList = document.createElement('ul');
                    topicsList.className = 'study-plan__week-topics';
                    
                    weeklyTopics[week].forEach(topic => {
                        const topicItem = document.createElement('li');
                        topicItem.textContent = topic.name;
                        topicsList.appendChild(topicItem);
                    });
                    
                    topicsCell.appendChild(topicsList);
                } else {
                    topicsCell.textContent = 'No topics scheduled';
                }
                row.appendChild(topicsCell);
                
                // Hours
                const hoursCell = document.createElement('td');
                hoursCell.textContent = weeklyHours[week] || 0;
                row.appendChild(hoursCell);
                
                // Milestones
                const milestonesCell = document.createElement('td');
                if (weeklyMilestones[week]) {
                    const milestonesList = document.createElement('ul');
                    milestonesList.className = 'study-plan__week-milestones';
                    
                    weeklyMilestones[week].forEach(milestone => {
                        const milestoneItem = document.createElement('li');
                        milestoneItem.textContent = milestone.name;
                        milestonesList.appendChild(milestoneItem);
                    });
                    
                    milestonesCell.appendChild(milestonesList);
                } else {
                    milestonesCell.textContent = 'No milestones';
                }
                row.appendChild(milestonesCell);
                
                scheduleTableBody.appendChild(row);
            }
        },
        
        /**
         * Populate the topics list with study plan data
         * @param {Object} studyPlan - The study plan
         */
        populateTopicsList: function(studyPlan) {
            if (!containerElement || !studyPlan) return;
            
            const topicsList = containerElement.querySelector('#topics-list');
            if (!topicsList) return;
            
            // Clear topics list
            topicsList.innerHTML = '';
            
            // Add each topic to the list
            studyPlan.topics.forEach(topic => {
                const topicItem = document.createElement('div');
                topicItem.className = 'study-plan__topic-item';
                topicItem.dataset.topicId = topic.id;
                
                // Create topic header
                const topicHeader = document.createElement('div');
                topicHeader.className = 'study-plan__topic-header';
                
                const topicTitle = document.createElement('h4');
                topicTitle.className = 'study-plan__topic-title';
                topicTitle.textContent = topic.name;
                
                const topicMeta = document.createElement('div');
                topicMeta.className = 'study-plan__topic-meta';
                
                const topicHours = document.createElement('span');
                topicHours.className = 'study-plan__topic-hours';
                topicHours.textContent = `${topic.duration} hours`;
                
                const topicWeeks = document.createElement('span');
                topicWeeks.className = 'study-plan__topic-weeks';
                topicWeeks.textContent = `Weeks ${topic.startWeek}-${topic.endWeek}`;
                
                const topicStatus = document.createElement('span');
                topicStatus.className = 'study-plan__topic-status';
                topicStatus.textContent = topic.status.replace('-', ' ');
                
                topicMeta.appendChild(topicHours);
                topicMeta.appendChild(topicWeeks);
                topicMeta.appendChild(topicStatus);
                
                topicHeader.appendChild(topicTitle);
                topicHeader.appendChild(topicMeta);
                
                // Create topic progress
                const topicProgress = document.createElement('div');
                topicProgress.className = 'study-plan__topic-progress';
                
                const progressBar = document.createElement('div');
                progressBar.className = 'study-plan__topic-progress-bar';
                
                const progressFill = document.createElement('div');
                progressFill.className = 'study-plan__topic-progress-fill';
                progressFill.style.width = `${topic.progress}%`;
                
                const progressText = document.createElement('span');
                progressText.className = 'study-plan__topic-progress-text';
                progressText.textContent = `${topic.progress}%`;
                
                progressBar.appendChild(progressFill);
                topicProgress.appendChild(progressBar);
                topicProgress.appendChild(progressText);
                
                // Create topic content
                const topicContent = document.createElement('div');
                topicContent.className = 'study-plan__topic-content';
                
                // Add subtopics if available
                if (topic.subtopics && topic.subtopics.length > 0) {
                    const subtopicsList = document.createElement('ul');
                    subtopicsList.className = 'study-plan__subtopics-list';
                    
                    topic.subtopics.forEach(subtopic => {
                        const subtopicItem = document.createElement('li');
                        subtopicItem.textContent = subtopic;
                        subtopicsList.appendChild(subtopicItem);
                    });
                    
                    topicContent.appendChild(subtopicsList);
                }
                
                // Add topic actions
                const topicActions = document.createElement('div');
                topicActions.className = 'study-plan__topic-actions';
                
                const updateProgressButton = document.createElement('button');
                updateProgressButton.className = 'study-plan__topic-action';
                updateProgressButton.textContent = 'Update Progress';
                updateProgressButton.addEventListener('click', () => {
                    this.showProgressUpdateDialog(topic);
                });
                
                topicActions.appendChild(updateProgressButton);
                
                // Assemble topic item
                topicItem.appendChild(topicHeader);
                topicItem.appendChild(topicProgress);
                topicItem.appendChild(topicContent);
                topicItem.appendChild(topicActions);
                
                topicsList.appendChild(topicItem);
            });
        },
        
        /**
         * Populate the milestones list with study plan data
         * @param {Object} studyPlan - The study plan
         */
        populateMilestonesList: function(studyPlan) {
            if (!containerElement || !studyPlan) return;
            
            const milestonesList = containerElement.querySelector('#milestones-list');
            if (!milestonesList) return;
            
            // Clear milestones list
            milestonesList.innerHTML = '';
            
            // Sort milestones by week
            const sortedMilestones = [...studyPlan.milestones].sort((a, b) => a.week - b.week);
            
            // Add each milestone to the list
            sortedMilestones.forEach(milestone => {
                const milestoneItem = document.createElement('div');
                milestoneItem.className = 'study-plan__milestone-item';
                milestoneItem.dataset.milestoneId = milestone.id;
                
                // Add completed class if milestone is completed
                if (milestone.completed) {
                    milestoneItem.classList.add('completed');
                }
                
                // Create milestone header
                const milestoneHeader = document.createElement('div');
                milestoneHeader.className = 'study-plan__milestone-header';
                
                const milestoneTitle = document.createElement('h4');
                milestoneTitle.className = 'study-plan__milestone-title';
                milestoneTitle.textContent = milestone.name;
                
                const milestoneMeta = document.createElement('div');
                milestoneMeta.className = 'study-plan__milestone-meta';
                
                const milestoneWeek = document.createElement('span');
                milestoneWeek.className = 'study-plan__milestone-week';
                milestoneWeek.textContent = `Week ${milestone.week}`;
                
                // Calculate milestone date
                const milestoneDate = new Date(studyPlan.startDate);
                milestoneDate.setDate(milestoneDate.getDate() + (milestone.week - 1) * 7);
                
                const milestoneDateSpan = document.createElement('span');
                milestoneDateSpan.className = 'study-plan__milestone-date';
                milestoneDateSpan.textContent = formatDate(milestoneDate);
                
                milestoneMeta.appendChild(milestoneWeek);
                milestoneMeta.appendChild(milestoneDateSpan);
                
                milestoneHeader.appendChild(milestoneTitle);
                milestoneHeader.appendChild(milestoneMeta);
                
                // Create milestone content
                const milestoneContent = document.createElement('div');
                milestoneContent.className = 'study-plan__milestone-content';
                milestoneContent.textContent = milestone.description;
                
                // Create milestone actions
                const milestoneActions = document.createElement('div');
                milestoneActions.className = 'study-plan__milestone-actions';
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'study-plan__milestone-action';
                toggleButton.textContent = milestone.completed ? 'Mark Incomplete' : 'Mark Complete';
                toggleButton.addEventListener('click', () => {
                    this.toggleMilestoneCompletion(milestone.id);
                });
                
                milestoneActions.appendChild(toggleButton);
                
                // Assemble milestone item
                milestoneItem.appendChild(milestoneHeader);
                milestoneItem.appendChild(milestoneContent);
                milestoneItem.appendChild(milestoneActions);
                
                milestonesList.appendChild(milestoneItem);
            });
        },
        
        /**
         * Show a dialog to update topic progress
         * @param {Object} topic - The topic to update
         */
        showProgressUpdateDialog: function(topic) {
            if (!topic) return;
            
            // Create dialog overlay
            const overlay = document.createElement('div');
            overlay.className = 'study-plan__dialog-overlay';
            
            // Create dialog
            const dialog = document.createElement('div');
            dialog.className = 'study-plan__dialog';
            
            // Create dialog content
            dialog.innerHTML = `
                <div class="study-plan__dialog-header">
                    <h3>Update Progress: ${topic.name}</h3>
                    <button class="study-plan__dialog-close">&times;</button>
                </div>
                
                <div class="study-plan__dialog-content">
                    <div class="study-plan__dialog-form">
                        <div class="study-plan__form-group">
                            <label for="topic-progress">Progress (%):</label>
                            <input type="range" id="topic-progress" min="0" max="100" value="${topic.progress}" step="5">
                            <span id="progress-value">${topic.progress}%</span>
                        </div>
                        
                        <div class="study-plan__form-group">
                            <label for="topic-status">Status:</label>
                            <select id="topic-status">
                                <option value="not-started" ${topic.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                                <option value="in-progress" ${topic.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                <option value="completed" ${topic.status === 'completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </div>
                        
                        <div class="study-plan__form-group">
                            <label for="topic-notes">Notes:</label>
                            <textarea id="topic-notes" rows="3">${topic.notes || ''}</textarea>
                        </div>
                    </div>
                </div>
                
                <div class="study-plan__dialog-actions">
                    <button class="study-plan__dialog-cancel">Cancel</button>
                    <button class="study-plan__dialog-save">Save Changes</button>
                </div>
            `;
            
            // Add dialog to page
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            // Set up event listeners
            const closeButton = dialog.querySelector('.study-plan__dialog-close');
            const cancelButton = dialog.querySelector('.study-plan__dialog-cancel');
            const saveButton = dialog.querySelector('.study-plan__dialog-save');
            
            const progressInput = dialog.querySelector('#topic-progress');
            const progressValue = dialog.querySelector('#progress-value');
            
            // Update progress value display
            progressInput.addEventListener('input', () => {
                progressValue.textContent = `${progressInput.value}%`;
            });
            
            // Close dialog on close button click
            closeButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
            
            // Close dialog on cancel button click
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
            
            // Save changes on save button click
            saveButton.addEventListener('click', () => {
                const progress = parseInt(progressInput.value, 10);
                const status = dialog.querySelector('#topic-status').value;
                const notes = dialog.querySelector('#topic-notes').value;
                
                this.updateTopicProgress(topic.id, progress, status, notes);
                document.body.removeChild(overlay);
            });
            
            // Close dialog on overlay click
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        },
        
        /**
         * Update topic progress
         * @param {String} topicId - The ID of the topic to update
         * @param {Number} progress - The new progress percentage
         * @param {String} status - The new status
         * @param {String} notes - The new notes
         */
        updateTopicProgress: function(topicId, progress, status, notes) {
            if (!currentStudyPlan) return;
            
            // Find topic in study plan
            const topicIndex = currentStudyPlan.topics.findIndex(t => t.id === topicId);
            if (topicIndex === -1) return;
            
            // Update topic
            const topic = currentStudyPlan.topics[topicIndex];
            topic.progress = progress;
            topic.status = status;
            topic.notes = notes;
            
            // Auto-update status based on progress
            if (progress === 100 && status !== 'completed') {
                topic.status = 'completed';
            } else if (progress > 0 && progress < 100 && status === 'not-started') {
                topic.status = 'in-progress';
            } else if (progress === 0 && status === 'completed') {
                topic.status = 'in-progress';
            }
            
            // Update study plan progress
            this.updateStudyPlanProgress();
            
            // Update UI
            this.displayStudyPlan(currentStudyPlan);
            
            // Save study plan
            this.saveStudyPlan();
        },
        
        /**
         * Toggle milestone completion status
         * @param {String} milestoneId - The ID of the milestone to toggle
         */
        toggleMilestoneCompletion: function(milestoneId) {
            if (!currentStudyPlan) return;
            
            // Find milestone in study plan
            const milestoneIndex = currentStudyPlan.milestones.findIndex(m => m.id === milestoneId);
            if (milestoneIndex === -1) return;
            
            // Toggle completion status
            currentStudyPlan.milestones[milestoneIndex].completed = !currentStudyPlan.milestones[milestoneIndex].completed;
            
            // Update UI
            this.displayStudyPlan(currentStudyPlan);
            
            // Save study plan
            this.saveStudyPlan();
        },
        
        /**
         * Update study plan progress
         */
        updateStudyPlanProgress: function() {
            if (!currentStudyPlan) return;
            
            // Calculate completed topics
            const completedTopics = currentStudyPlan.topics.filter(t => t.status === 'completed').length;
            
            // Calculate completed hours
            let completedHours = 0;
            currentStudyPlan.topics.forEach(topic => {
                completedHours += (topic.duration * topic.progress / 100);
            });
            
            // Calculate total hours
            const totalHours = currentStudyPlan.topics.reduce((sum, topic) => sum + topic.duration, 0);
            
            // Calculate overall percentage
            const percentage = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
            
            // Update progress
            currentStudyPlan.progress = {
                completedTopics,
                totalTopics: currentStudyPlan.topics.length,
                completedHours,
                totalHours,
                percentage
            };
        },
        
        /**
         * Save the current study plan
         */
        saveStudyPlan: function() {
            if (!currentStudyPlan) return;
            
            // Update timestamp
            currentStudyPlan.updatedAt = new Date();
            
            // Save to storage
            window.CertificationRoadmap.StorageService.saveStudyPlan(currentStudyPlan);
        },
        
        /**
         * Get the current study plan
         * @returns {Object|null} The current study plan or null if not available
         */
        getCurrentStudyPlan: function() {
            return currentStudyPlan;
        },
        
        /**
         * Load a study plan from storage
         * @returns {Object|null} The loaded study plan or null if not found
         */
        loadStudyPlan: function() {
            const studyPlan = window.CertificationRoadmap.StorageService.loadStudyPlan();
            
            if (studyPlan) {
                currentStudyPlan = studyPlan;
            }
            
            return studyPlan;
        },
        
        /**
         * Export the study plan as a PDF
         * @returns {Promise<Blob>} A promise that resolves to a PDF blob
         */
        exportStudyPlanAsPDF: function() {
            // This would typically use a PDF generation library like jsPDF
            // For now, we'll just return a placeholder implementation
            return new Promise((resolve, reject) => {
                if (!currentStudyPlan) {
                    reject(new Error('No study plan available'));
                    return;
                }
                
                try {
                    // Create a simple text representation of the study plan
                    const studyPlanText = `
                        Study Plan: ${currentStudyPlan.name}
                        Created: ${formatDate(currentStudyPlan.createdAt)}
                        Updated: ${formatDate(currentStudyPlan.updatedAt)}
                        
                        Weekly Hours: ${currentStudyPlan.weeklyHours}
                        Start Date: ${formatDate(currentStudyPlan.startDate)}
                        Target End Date: ${formatDate(currentStudyPlan.targetEndDate)}
                        
                        Progress: ${currentStudyPlan.progress.percentage}%
                        Completed Hours: ${currentStudyPlan.progress.completedHours} / ${currentStudyPlan.progress.totalHours}
                        
                        Topics:
                        ${currentStudyPlan.topics.map(topic => 
                            `- ${topic.name} (${topic.progress}% complete, ${topic.duration} hours)`
                        ).join('\n')}
                        
                        Milestones:
                        ${currentStudyPlan.milestones.map(milestone => 
                            `- Week ${milestone.week}: ${milestone.name} (${milestone.completed ? 'Completed' : 'Not Completed'})`
                        ).join('\n')}
                    `;
                    
                    // Create a blob from the text
                    const blob = new Blob([studyPlanText], { type: 'text/plain' });
                    resolve(blob);
                } catch (error) {
                    reject(error);
                }
            });
        }
    };
})();