/**
 * Cloud Certification Roadmap - Career Goals Module
 * 
 * This module handles the career goal selection functionality for the Cloud Certification Roadmap feature.
 * It provides functions for collecting and processing the user's career objectives and preferences.
 */

// Career Goals Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.CareerGoalsModule = (function() {
    // Private variables
    let careerGoalsData = null;
    
    // Career path definitions
    const careerPaths = [
        {
            id: 'cloud-architect',
            title: 'Cloud Architect',
            description: 'Design and oversee cloud infrastructure, focusing on scalability, security, and best practices.',
            skills: ['Architecture Design', 'Infrastructure Planning', 'Security', 'Cost Optimization', 'Governance'],
            certifications: {
                aws: ['AWS Certified Solutions Architect', 'AWS Certified Advanced Networking'],
                azure: ['Microsoft Certified: Azure Solutions Architect', 'Microsoft Certified: Azure Security Engineer'],
                gcp: ['Google Cloud Professional Cloud Architect', 'Google Cloud Professional Network Engineer']
            }
        },
        {
            id: 'devops-engineer',
            title: 'DevOps Engineer',
            description: 'Implement CI/CD pipelines, automation, and manage cloud infrastructure as code.',
            skills: ['CI/CD', 'Infrastructure as Code', 'Automation', 'Monitoring', 'Containerization'],
            certifications: {
                aws: ['AWS Certified DevOps Engineer', 'AWS Certified SysOps Administrator'],
                azure: ['Microsoft Certified: DevOps Engineer', 'Microsoft Certified: Azure Administrator'],
                gcp: ['Google Cloud Professional DevOps Engineer', 'Google Cloud Associate Cloud Engineer']
            }
        },
        {
            id: 'cloud-developer',
            title: 'Cloud Developer',
            description: 'Build cloud-native applications using serverless, containers, and managed services.',
            skills: ['Serverless', 'Containers', 'APIs', 'Microservices', 'Event-Driven Architecture'],
            certifications: {
                aws: ['AWS Certified Developer', 'AWS Certified Lambda Specialty'],
                azure: ['Microsoft Certified: Azure Developer', 'Microsoft Certified: Azure Functions Developer'],
                gcp: ['Google Cloud Professional Cloud Developer', 'Google Cloud Professional Application Developer']
            }
        },
        {
            id: 'cloud-security',
            title: 'Cloud Security Specialist',
            description: 'Implement and manage security controls, compliance, and identity management in the cloud.',
            skills: ['Identity Management', 'Encryption', 'Compliance', 'Threat Detection', 'Security Automation'],
            certifications: {
                aws: ['AWS Certified Security Specialty', 'AWS Certified Advanced Networking'],
                azure: ['Microsoft Certified: Azure Security Engineer', 'Microsoft Certified: Identity and Access Administrator'],
                gcp: ['Google Cloud Professional Security Engineer', 'Google Cloud Professional Network Engineer']
            }
        },
        {
            id: 'data-engineer',
            title: 'Cloud Data Engineer',
            description: 'Design and implement data processing systems, data lakes, and analytics solutions in the cloud.',
            skills: ['Data Processing', 'ETL', 'Data Lakes', 'Analytics', 'Machine Learning'],
            certifications: {
                aws: ['AWS Certified Data Analytics Specialty', 'AWS Certified Database Specialty'],
                azure: ['Microsoft Certified: Azure Data Engineer', 'Microsoft Certified: Azure Data Scientist'],
                gcp: ['Google Cloud Professional Data Engineer', 'Google Cloud Professional Machine Learning Engineer']
            }
        },
        {
            id: 'mlops-engineer',
            title: 'MLOps Engineer',
            description: 'Build and manage machine learning operations and infrastructure in the cloud.',
            skills: ['Machine Learning', 'CI/CD for ML', 'Model Deployment', 'Model Monitoring', 'Data Pipeline'],
            certifications: {
                aws: ['AWS Certified Machine Learning Specialty', 'AWS Certified DevOps Engineer'],
                azure: ['Microsoft Certified: Azure AI Engineer', 'Microsoft Certified: Azure Data Scientist'],
                gcp: ['Google Cloud Professional Machine Learning Engineer', 'Google Cloud Professional Data Engineer']
            }
        },
        {
            id: 'cloud-admin',
            title: 'Cloud Administrator',
            description: 'Manage day-to-day cloud operations, monitoring, and maintenance.',
            skills: ['Resource Management', 'Monitoring', 'Troubleshooting', 'Cost Management', 'User Access'],
            certifications: {
                aws: ['AWS Certified SysOps Administrator', 'AWS Certified Cloud Practitioner'],
                azure: ['Microsoft Certified: Azure Administrator', 'Microsoft Certified: Azure Fundamentals'],
                gcp: ['Google Cloud Associate Cloud Engineer', 'Google Cloud Digital Leader']
            }
        },
        {
            id: 'site-reliability',
            title: 'Site Reliability Engineer (SRE)',
            description: 'Ensure system reliability, availability, and performance in cloud environments.',
            skills: ['Reliability Engineering', 'Monitoring', 'Incident Response', 'Performance Optimization', 'Automation'],
            certifications: {
                aws: ['AWS Certified DevOps Engineer', 'AWS Certified SysOps Administrator'],
                azure: ['Microsoft Certified: DevOps Engineer', 'Microsoft Certified: Azure Administrator'],
                gcp: ['Google Cloud Professional DevOps Engineer', 'Google Cloud Professional Cloud Architect']
            }
        }
    ];
    
    // Private functions
    function validateCareerGoalsData(data) {
        // Basic validation
        if (!data) return false;
        if (!data.primaryPath) return false;
        if (!data.priorities || typeof data.priorities !== 'object') return false;
        
        return true;
    }
    
    function generateCareerGoalsId() {
        return 'career-goals-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Public API
    return {
        /**
         * Initialize the career goals selection interface
         * @param {HTMLElement} container - The container element for the career goals interface
         */
        initCareerGoals: function(container) {
            if (!container) return;
            
            // Create career goals HTML
            const formHtml = `
                <div class="career-goals-form">
                    <h3 class="career-goals-form__title">Career Goals</h3>
                    <p class="career-goals-form__description">
                        Select your career goals to help us recommend the most relevant certification paths.
                    </p>
                    
                    <form id="career-goals-form">
                        <div class="career-goals-form__section">
                            <h4 class="career-goals-form__section-title">Primary Career Path</h4>
                            <p class="career-goals-form__section-description">
                                Select the primary career path you're interested in pursuing.
                            </p>
                            
                            <div class="career-goals-form__paths">
                                ${careerPaths.map(path => `
                                    <div class="career-goals-form__path">
                                        <input type="radio" name="primary-path" id="primary-${path.id}" value="${path.id}" required>
                                        <label for="primary-${path.id}" class="career-goals-form__path-label">
                                            <h5 class="career-goals-form__path-title">${path.title}</h5>
                                            <p class="career-goals-form__path-description">${path.description}</p>
                                            
                                            <div class="career-goals-form__path-skills">
                                                <strong>Key Skills:</strong>
                                                <span>${path.skills.join(', ')}</span>
                                            </div>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="career-goals-form__section">
                            <h4 class="career-goals-form__section-title">Secondary Career Paths</h4>
                            <p class="career-goals-form__section-description">
                                Optionally select additional career paths you're interested in exploring.
                            </p>
                            
                            <div class="career-goals-form__secondary-paths">
                                ${careerPaths.map(path => `
                                    <div class="career-goals-form__secondary-path">
                                        <input type="checkbox" name="secondary-path-${path.id}" id="secondary-${path.id}" value="${path.id}">
                                        <label for="secondary-${path.id}">${path.title}</label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="career-goals-form__section">
                            <h4 class="career-goals-form__section-title">Target Roles</h4>
                            <p class="career-goals-form__section-description">
                                Enter specific job roles you're targeting (optional).
                            </p>
                            
                            <div class="career-goals-form__target-roles">
                                <div class="career-goals-form__target-role-list" id="target-role-list">
                                    <div class="career-goals-form__target-role">
                                        <input type="text" name="target-role-0" placeholder="e.g., Senior Cloud Architect">
                                    </div>
                                </div>
                                
                                <button type="button" class="career-goals-form__add-role" id="add-target-role">
                                    Add Another Role
                                </button>
                            </div>
                        </div>
                        
                        <div class="career-goals-form__section">
                            <h4 class="career-goals-form__section-title">Priorities</h4>
                            <p class="career-goals-form__section-description">
                                Rate the importance of each factor in your career decisions (1 = Not Important, 5 = Very Important).
                            </p>
                            
                            <div class="career-goals-form__priorities">
                                <div class="career-goals-form__priority">
                                    <label for="priority-salary">Salary/Compensation</label>
                                    <div class="career-goals-form__priority-rating">
                                        <input type="range" id="priority-salary" name="priority-salary" min="1" max="5" value="3">
                                        <span class="career-goals-form__priority-value" id="priority-salary-value">3</span>
                                    </div>
                                </div>
                                
                                <div class="career-goals-form__priority">
                                    <label for="priority-work-life">Work-Life Balance</label>
                                    <div class="career-goals-form__priority-rating">
                                        <input type="range" id="priority-work-life" name="priority-work-life" min="1" max="5" value="3">
                                        <span class="career-goals-form__priority-value" id="priority-work-life-value">3</span>
                                    </div>
                                </div>
                                
                                <div class="career-goals-form__priority">
                                    <label for="priority-job-security">Job Security</label>
                                    <div class="career-goals-form__priority-rating">
                                        <input type="range" id="priority-job-security" name="priority-job-security" min="1" max="5" value="3">
                                        <span class="career-goals-form__priority-value" id="priority-job-security-value">3</span>
                                    </div>
                                </div>
                                
                                <div class="career-goals-form__priority">
                                    <label for="priority-remote">Remote Work Opportunities</label>
                                    <div class="career-goals-form__priority-rating">
                                        <input type="range" id="priority-remote" name="priority-remote" min="1" max="5" value="3">
                                        <span class="career-goals-form__priority-value" id="priority-remote-value">3</span>
                                    </div>
                                </div>
                                
                                <div class="career-goals-form__priority">
                                    <label for="priority-technical">Technical Depth</label>
                                    <div class="career-goals-form__priority-rating">
                                        <input type="range" id="priority-technical" name="priority-technical" min="1" max="5" value="3">
                                        <span class="career-goals-form__priority-value" id="priority-technical-value">3</span>
                                    </div>
                                </div>
                                
                                <div class="career-goals-form__priority">
                                    <label for="priority-leadership">Leadership Opportunities</label>
                                    <div class="career-goals-form__priority-rating">
                                        <input type="range" id="priority-leadership" name="priority-leadership" min="1" max="5" value="3">
                                        <span class="career-goals-form__priority-value" id="priority-leadership-value">3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="career-goals-form__section">
                            <h4 class="career-goals-form__section-title">Industry Focus</h4>
                            <p class="career-goals-form__section-description">
                                Select industries you're interested in working in (optional).
                            </p>
                            
                            <div class="career-goals-form__industries">
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-finance" name="industry-finance" value="finance">
                                    <label for="industry-finance">Finance/Banking</label>
                                </div>
                                
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-healthcare" name="industry-healthcare" value="healthcare">
                                    <label for="industry-healthcare">Healthcare</label>
                                </div>
                                
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-retail" name="industry-retail" value="retail">
                                    <label for="industry-retail">Retail/E-commerce</label>
                                </div>
                                
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-tech" name="industry-tech" value="tech">
                                    <label for="industry-tech">Technology</label>
                                </div>
                                
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-manufacturing" name="industry-manufacturing" value="manufacturing">
                                    <label for="industry-manufacturing">Manufacturing</label>
                                </div>
                                
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-government" name="industry-government" value="government">
                                    <label for="industry-government">Government/Public Sector</label>
                                </div>
                                
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-education" name="industry-education" value="education">
                                    <label for="industry-education">Education</label>
                                </div>
                                
                                <div class="career-goals-form__industry">
                                    <input type="checkbox" id="industry-media" name="industry-media" value="media">
                                    <label for="industry-media">Media/Entertainment</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="career-goals-form__section">
                            <h4 class="career-goals-form__section-title">Timeline Goals</h4>
                            <p class="career-goals-form__section-description">
                                Set your career timeline goals (optional).
                            </p>
                            
                            <div class="career-goals-form__timeline-goals">
                                <div class="career-goals-form__timeline-goal-list" id="timeline-goal-list">
                                    <!-- Timeline goals will be added here -->
                                </div>
                                
                                <button type="button" class="career-goals-form__add-goal" id="add-timeline-goal">
                                    Add Timeline Goal
                                </button>
                            </div>
                        </div>
                        
                        <div class="career-goals-form__actions">
                            <button type="submit" class="career-goals-form__submit">Submit Career Goals</button>
                            <button type="reset" class="career-goals-form__reset">Reset Form</button>
                        </div>
                    </form>
                </div>
            `;
            
            // Insert form into container
            container.innerHTML = formHtml;
            
            // Set up event listeners
            this.setupFormListeners(container);
        },
        
        /**
         * Set up event listeners for the career goals form
         * @param {HTMLElement} container - The container element for the career goals form
         */
        setupFormListeners: function(container) {
            if (!container) return;
            
            const form = container.querySelector('#career-goals-form');
            if (!form) return;
            
            // Priority range input listeners
            const priorityInputs = form.querySelectorAll('input[type="range"]');
            priorityInputs.forEach(input => {
                const valueDisplay = document.getElementById(`${input.id}-value`);
                if (valueDisplay) {
                    // Update value display on input change
                    input.addEventListener('input', function() {
                        valueDisplay.textContent = this.value;
                    });
                }
            });
            
            // Add target role button
            const addRoleButton = form.querySelector('#add-target-role');
            const roleList = form.querySelector('#target-role-list');
            
            if (addRoleButton && roleList) {
                let roleCount = 1;
                
                addRoleButton.addEventListener('click', function() {
                    const roleItem = document.createElement('div');
                    roleItem.className = 'career-goals-form__target-role';
                    
                    roleItem.innerHTML = `
                        <input type="text" name="target-role-${roleCount}" placeholder="e.g., Senior Cloud Architect">
                        <button type="button" class="career-goals-form__remove-role">Remove</button>
                    `;
                    
                    roleList.appendChild(roleItem);
                    roleCount++;
                    
                    // Add remove button listener
                    const removeBtn = roleItem.querySelector('.career-goals-form__remove-role');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', function() {
                            roleList.removeChild(roleItem);
                        });
                    }
                });
            }
            
            // Add timeline goal button
            const addGoalButton = form.querySelector('#add-timeline-goal');
            const goalList = form.querySelector('#timeline-goal-list');
            
            if (addGoalButton && goalList) {
                let goalCount = 0;
                
                addGoalButton.addEventListener('click', function() {
                    const goalItem = document.createElement('div');
                    goalItem.className = 'career-goals-form__timeline-goal';
                    
                    goalItem.innerHTML = `
                        <div class="career-goals-form__timeline-goal-fields">
                            <input type="text" name="goal-${goalCount}-milestone" placeholder="Career Milestone" required>
                            
                            <label>
                                Target Date:
                                <input type="date" name="goal-${goalCount}-date" required>
                            </label>
                        </div>
                        
                        <button type="button" class="career-goals-form__remove-goal">Remove</button>
                    `;
                    
                    goalList.appendChild(goalItem);
                    goalCount++;
                    
                    // Add remove button listener
                    const removeBtn = goalItem.querySelector('.career-goals-form__remove-goal');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', function() {
                            goalList.removeChild(goalItem);
                        });
                    }
                });
            }
            
            // Primary path selection logic
            const primaryPathInputs = form.querySelectorAll('input[name="primary-path"]');
            primaryPathInputs.forEach(input => {
                input.addEventListener('change', function() {
                    const pathId = this.value;
                    
                    // Disable corresponding secondary path checkbox
                    const secondaryCheckbox = form.querySelector(`#secondary-${pathId}`);
                    if (secondaryCheckbox) {
                        secondaryCheckbox.checked = false;
                        secondaryCheckbox.disabled = true;
                    }
                    
                    // Enable all other secondary path checkboxes
                    primaryPathInputs.forEach(otherInput => {
                        if (otherInput.value !== pathId) {
                            const otherSecondaryCheckbox = form.querySelector(`#secondary-${otherInput.value}`);
                            if (otherSecondaryCheckbox) {
                                otherSecondaryCheckbox.disabled = false;
                            }
                        }
                    });
                });
            });
            
            // Form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Process form data
                const formData = new FormData(form);
                const careerGoalsData = this.processFormData(formData);
                
                // Store career goals data
                this.saveCareerGoals(careerGoalsData);
                
                // Trigger completion event
                const event = new CustomEvent('career-goals-complete', {
                    detail: { careerGoalsData }
                });
                document.dispatchEvent(event);
            });
        },
        
        /**
         * Process form data into career goals data structure
         * @param {FormData} formData - The form data to process
         * @returns {Object} The processed career goals data
         */
        processFormData: function(formData) {
            // Create career goals data structure
            const careerGoals = {
                id: generateCareerGoalsId(),
                timestamp: new Date(),
                primaryPath: formData.get('primary-path'),
                secondaryPaths: [],
                targetRoles: [],
                priorities: {
                    salary: parseInt(formData.get('priority-salary'), 10),
                    workLifeBalance: parseInt(formData.get('priority-work-life'), 10),
                    jobSecurity: parseInt(formData.get('priority-job-security'), 10),
                    remoteWork: parseInt(formData.get('priority-remote'), 10),
                    technicalDepth: parseInt(formData.get('priority-technical'), 10),
                    leadershipOpportunities: parseInt(formData.get('priority-leadership'), 10)
                },
                industryFocus: [],
                timelineGoals: []
            };
            
            // Process secondary paths
            careerPaths.forEach(path => {
                const isSelected = formData.get(`secondary-path-${path.id}`);
                if (isSelected && path.id !== careerGoals.primaryPath) {
                    careerGoals.secondaryPaths.push(path.id);
                }
            });
            
            // Process target roles
            const roleKeys = Array.from(formData.keys())
                .filter(key => key.startsWith('target-role-'));
            
            roleKeys.forEach(key => {
                const role = formData.get(key);
                if (role && role.trim()) {
                    careerGoals.targetRoles.push(role.trim());
                }
            });
            
            // Process industry focus
            const industries = ['finance', 'healthcare', 'retail', 'tech', 'manufacturing', 'government', 'education', 'media'];
            industries.forEach(industry => {
                const isSelected = formData.get(`industry-${industry}`);
                if (isSelected) {
                    careerGoals.industryFocus.push(industry);
                }
            });
            
            // Process timeline goals
            const goalKeys = Array.from(formData.keys())
                .filter(key => key.endsWith('-milestone'))
                .map(key => key.replace('-milestone', ''));
            
            goalKeys.forEach(goalKey => {
                const milestone = formData.get(`${goalKey}-milestone`);
                const targetDate = formData.get(`${goalKey}-date`);
                
                if (milestone && targetDate) {
                    careerGoals.timelineGoals.push({
                        milestone: milestone,
                        targetDate: new Date(targetDate)
                    });
                }
            });
            
            return careerGoals;
        },
        
        /**
         * Save career goals data to local storage
         * @param {Object} data - The career goals data to save
         * @returns {Boolean} True if save was successful
         */
        saveCareerGoals: function(data) {
            if (!validateCareerGoalsData(data)) return false;
            
            try {
                // Store career goals data
                careerGoalsData = data;
                
                // Save to local storage
                localStorage.setItem('certificationRoadmap.careerGoals', JSON.stringify(data));
                
                return true;
            } catch (error) {
                console.error('Error saving career goals data:', error);
                return false;
            }
        },
        
        /**
         * Load career goals data from local storage
         * @returns {Object|null} The loaded career goals data or null if not found
         */
        loadCareerGoals: function() {
            try {
                const storedData = localStorage.getItem('certificationRoadmap.careerGoals');
                if (!storedData) return null;
                
                const data = JSON.parse(storedData);
                if (!validateCareerGoalsData(data)) return null;
                
                // Convert date strings back to Date objects
                if (data.timestamp) data.timestamp = new Date(data.timestamp);
                
                if (data.timelineGoals && Array.isArray(data.timelineGoals)) {
                    data.timelineGoals.forEach(goal => {
                        if (goal.targetDate) goal.targetDate = new Date(goal.targetDate);
                    });
                }
                
                // Store in memory
                careerGoalsData = data;
                
                return data;
            } catch (error) {
                console.error('Error loading career goals data:', error);
                return null;
            }
        },
        
        /**
         * Get the current career goals data
         * @returns {Object|null} The current career goals data or null if not available
         */
        getCareerGoalsData: function() {
            return careerGoalsData;
        },
        
        /**
         * Clear career goals data from memory and storage
         * @returns {Boolean} True if clear was successful
         */
        clearCareerGoals: function() {
            try {
                careerGoalsData = null;
                localStorage.removeItem('certificationRoadmap.careerGoals');
                return true;
            } catch (error) {
                console.error('Error clearing career goals data:', error);
                return false;
            }
        },
        
        /**
         * Update existing career goals data
         * @param {Object} data - The updated career goals data
         * @returns {Boolean} True if update was successful
         */
        updateCareerGoals: function(data) {
            return this.saveCareerGoals(data);
        },
        
        /**
         * Get career path information by ID
         * @param {String} pathId - The career path ID
         * @returns {Object|null} The career path information or null if not found
         */
        getCareerPathById: function(pathId) {
            return careerPaths.find(path => path.id === pathId) || null;
        },
        
        /**
         * Get all available career paths
         * @returns {Array} Array of career path objects
         */
        getAllCareerPaths: function() {
            return [...careerPaths];
        }
    };
})();