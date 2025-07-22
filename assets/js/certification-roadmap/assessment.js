/**
 * Cloud Certification Roadmap - Assessment Module
 * 
 * This module handles the skill assessment functionality for the Cloud Certification Roadmap feature.
 * It provides functions for collecting and analyzing the user's current cloud skills and experience.
 */

// Assessment Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.AssessmentModule = (function() {
    // Private variables
    let assessmentData = null;
    const cloudProviders = ['AWS', 'Azure', 'GCP', 'Multi-Cloud'];
    const skillDomains = [
        {
            name: 'Compute',
            description: 'Virtual machines, containers, serverless computing',
            skills: ['EC2', 'Lambda', 'ECS', 'EKS', 'Virtual Machines', 'App Service', 'Azure Functions', 'AKS', 'Compute Engine', 'Cloud Functions', 'GKE', 'Kubernetes', 'Docker']
        },
        {
            name: 'Storage',
            description: 'Object storage, block storage, file systems',
            skills: ['S3', 'EBS', 'EFS', 'Glacier', 'Blob Storage', 'Disk Storage', 'Files', 'Archive Storage', 'Cloud Storage', 'Persistent Disk', 'Filestore']
        },
        {
            name: 'Networking',
            description: 'VPCs, load balancing, DNS, CDN',
            skills: ['VPC', 'Route 53', 'CloudFront', 'API Gateway', 'Virtual Network', 'Load Balancer', 'Front Door', 'CDN', 'VPC Network', 'Cloud DNS', 'Cloud CDN']
        },
        {
            name: 'Databases',
            description: 'Relational, NoSQL, in-memory databases',
            skills: ['RDS', 'DynamoDB', 'ElastiCache', 'Redshift', 'SQL Database', 'Cosmos DB', 'Cache for Redis', 'Cloud SQL', 'Firestore', 'Bigtable', 'Spanner']
        },
        {
            name: 'Security',
            description: 'Identity management, encryption, network security',
            skills: ['IAM', 'KMS', 'WAF', 'Shield', 'Security Center', 'Key Vault', 'Sentinel', 'IAM', 'Security Command Center', 'KMS']
        },
        {
            name: 'DevOps',
            description: 'CI/CD, infrastructure as code, monitoring',
            skills: ['CloudFormation', 'CodePipeline', 'CloudWatch', 'ARM Templates', 'DevOps', 'Monitor', 'Deployment Manager', 'Cloud Build', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions']
        },
        {
            name: 'Management',
            description: 'Resource management, cost optimization, governance',
            skills: ['Organizations', 'Cost Explorer', 'Resource Manager', 'Cost Management', 'Resource Groups', 'Resource Manager', 'Cloud Billing']
        }
    ];
    
    // Private functions
    function validateAssessmentData(data) {
        // Basic validation
        if (!data) return false;
        if (!data.cloudProviders || !Array.isArray(data.cloudProviders)) return false;
        if (!data.domainSkills || !Array.isArray(data.domainSkills)) return false;
        
        return true;
    }
    
    function generateAssessmentId() {
        return 'assessment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Public API
    return {
        /**
         * Initialize the assessment form
         * @param {HTMLElement} container - The container element for the assessment form
         */
        initAssessment: function(container) {
            if (!container) return;
            
            // Create assessment form HTML
            const formHtml = `
                <div class="assessment-form">
                    <h3 class="assessment-form__title">Cloud Skills Assessment</h3>
                    <p class="assessment-form__description">
                        Please select your experience level with different cloud providers and technologies.
                        This will help us create a personalized certification roadmap for you.
                    </p>
                    
                    <form id="cloud-assessment-form">
                        <div class="assessment-form__section">
                            <h4 class="assessment-form__section-title">Cloud Providers</h4>
                            <p class="assessment-form__section-description">
                                Select your experience level with each cloud provider.
                            </p>
                            
                            <div class="assessment-form__providers">
                                ${cloudProviders.map(provider => `
                                    <div class="assessment-form__provider">
                                        <h5 class="assessment-form__provider-name">${provider}</h5>
                                        <div class="assessment-form__provider-levels">
                                            <label class="assessment-form__level">
                                                <input type="radio" name="provider-${provider.toLowerCase()}" value="0">
                                                <span>None</span>
                                            </label>
                                            <label class="assessment-form__level">
                                                <input type="radio" name="provider-${provider.toLowerCase()}" value="1">
                                                <span>Beginner</span>
                                            </label>
                                            <label class="assessment-form__level">
                                                <input type="radio" name="provider-${provider.toLowerCase()}" value="2">
                                                <span>Intermediate</span>
                                            </label>
                                            <label class="assessment-form__level">
                                                <input type="radio" name="provider-${provider.toLowerCase()}" value="3">
                                                <span>Advanced</span>
                                            </label>
                                            <label class="assessment-form__level">
                                                <input type="radio" name="provider-${provider.toLowerCase()}" value="4">
                                                <span>Expert</span>
                                            </label>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="assessment-form__section">
                            <h4 class="assessment-form__section-title">Cloud Domains</h4>
                            <p class="assessment-form__section-description">
                                For each domain, select the skills you have experience with and rate your proficiency.
                            </p>
                            
                            <div class="assessment-form__domains">
                                ${skillDomains.map(domain => `
                                    <div class="assessment-form__domain">
                                        <h5 class="assessment-form__domain-name">${domain.name}</h5>
                                        <p class="assessment-form__domain-description">${domain.description}</p>
                                        
                                        <div class="assessment-form__skills">
                                            ${domain.skills.map(skill => `
                                                <div class="assessment-form__skill">
                                                    <label class="assessment-form__skill-label">
                                                        <input type="checkbox" name="skill-${skill.toLowerCase().replace(/\s+/g, '-')}" class="assessment-form__skill-checkbox">
                                                        <span>${skill}</span>
                                                    </label>
                                                    
                                                    <div class="assessment-form__skill-level" data-skill="${skill.toLowerCase().replace(/\s+/g, '-')}">
                                                        <select name="skill-level-${skill.toLowerCase().replace(/\s+/g, '-')}" disabled>
                                                            <option value="1">Beginner</option>
                                                            <option value="2">Intermediate</option>
                                                            <option value="3">Advanced</option>
                                                            <option value="4">Expert</option>
                                                        </select>
                                                        
                                                        <label>
                                                            Years: 
                                                            <input type="number" name="skill-years-${skill.toLowerCase().replace(/\s+/g, '-')}" min="0" max="20" step="0.5" value="0" disabled>
                                                        </label>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="assessment-form__section">
                            <h4 class="assessment-form__section-title">Current Certifications</h4>
                            <p class="assessment-form__section-description">
                                List any cloud certifications you already have.
                            </p>
                            
                            <div class="assessment-form__certifications">
                                <div class="assessment-form__certification-list" id="certification-list">
                                    <!-- Certification items will be added here -->
                                </div>
                                
                                <button type="button" class="assessment-form__add-certification" id="add-certification">
                                    Add Certification
                                </button>
                            </div>
                        </div>
                        
                        <div class="assessment-form__section">
                            <h4 class="assessment-form__section-title">Learning Preferences</h4>
                            
                            <div class="assessment-form__preferences">
                                <div class="assessment-form__preference">
                                    <label for="learning-style">Preferred Learning Style:</label>
                                    <select id="learning-style" name="learning-style">
                                        <option value="visual">Visual (videos, diagrams)</option>
                                        <option value="reading">Reading (documentation, books)</option>
                                        <option value="interactive">Interactive (labs, exercises)</option>
                                        <option value="mixed">Mixed (combination of styles)</option>
                                    </select>
                                </div>
                                
                                <div class="assessment-form__preference">
                                    <label for="hours-per-week">Available Study Hours Per Week:</label>
                                    <input type="number" id="hours-per-week" name="hours-per-week" min="1" max="40" value="10">
                                </div>
                                
                                <div class="assessment-form__preference">
                                    <label for="budget">Budget for Learning Resources:</label>
                                    <select id="budget" name="budget">
                                        <option value="free">Free resources only</option>
                                        <option value="low">Low budget ($1-100)</option>
                                        <option value="medium">Medium budget ($100-500)</option>
                                        <option value="high">High budget ($500+)</option>
                                    </select>
                                </div>
                                
                                <div class="assessment-form__preference">
                                    <label for="timeframe">Desired Completion Timeframe:</label>
                                    <select id="timeframe" name="timeframe">
                                        <option value="1-3">1-3 months</option>
                                        <option value="3-6">3-6 months</option>
                                        <option value="6-12">6-12 months</option>
                                        <option value="12+">12+ months</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="assessment-form__actions">
                            <button type="submit" class="assessment-form__submit">Submit Assessment</button>
                            <button type="reset" class="assessment-form__reset">Reset Form</button>
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
         * Set up event listeners for the assessment form
         * @param {HTMLElement} container - The container element for the assessment form
         */
        setupFormListeners: function(container) {
            if (!container) return;
            
            const form = container.querySelector('#cloud-assessment-form');
            if (!form) return;
            
            // Skill checkbox listeners
            const skillCheckboxes = form.querySelectorAll('.assessment-form__skill-checkbox');
            skillCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const skillName = this.name.replace('skill-', '');
                    const levelSelect = form.querySelector(`select[name="skill-level-${skillName}"]`);
                    const yearsInput = form.querySelector(`input[name="skill-years-${skillName}"]`);
                    
                    if (levelSelect) levelSelect.disabled = !this.checked;
                    if (yearsInput) yearsInput.disabled = !this.checked;
                });
            });
            
            // Add certification button
            const addCertButton = form.querySelector('#add-certification');
            const certList = form.querySelector('#certification-list');
            
            if (addCertButton && certList) {
                let certCount = 0;
                
                addCertButton.addEventListener('click', function() {
                    const certId = `cert-${certCount++}`;
                    const certItem = document.createElement('div');
                    certItem.className = 'assessment-form__certification-item';
                    certItem.dataset.certId = certId;
                    
                    certItem.innerHTML = `
                        <div class="assessment-form__certification-fields">
                            <select name="${certId}-provider" required>
                                <option value="">Select Provider</option>
                                <option value="AWS">AWS</option>
                                <option value="Azure">Microsoft Azure</option>
                                <option value="GCP">Google Cloud</option>
                                <option value="CompTIA">CompTIA</option>
                                <option value="Cisco">Cisco</option>
                                <option value="Other">Other</option>
                            </select>
                            
                            <input type="text" name="${certId}-name" placeholder="Certification Name" required>
                            
                            <label>
                                Achieved:
                                <input type="date" name="${certId}-date" required>
                            </label>
                            
                            <label>
                                Expires:
                                <input type="date" name="${certId}-expiration">
                            </label>
                        </div>
                        
                        <button type="button" class="assessment-form__remove-certification">Remove</button>
                    `;
                    
                    certList.appendChild(certItem);
                    
                    // Add remove button listener
                    const removeBtn = certItem.querySelector('.assessment-form__remove-certification');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', function() {
                            certList.removeChild(certItem);
                        });
                    }
                });
            }
            
            // Form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Process form data
                const formData = new FormData(form);
                const assessmentData = this.processFormData(formData);
                
                // Store assessment data
                this.saveAssessment(assessmentData);
                
                // Trigger completion event
                const event = new CustomEvent('assessment-complete', {
                    detail: { assessmentData }
                });
                document.dispatchEvent(event);
            });
        },
        
        /**
         * Process form data into assessment data structure
         * @param {FormData} formData - The form data to process
         * @returns {Object} The processed assessment data
         */
        processFormData: function(formData) {
            // Create assessment data structure
            const assessment = {
                id: generateAssessmentId(),
                timestamp: new Date(),
                cloudProviders: [],
                domainSkills: [],
                certifications: [],
                preferences: {}
            };
            
            // Process cloud providers
            cloudProviders.forEach(provider => {
                const level = formData.get(`provider-${provider.toLowerCase()}`);
                if (level) {
                    assessment.cloudProviders.push({
                        name: provider,
                        experienceLevel: parseInt(level, 10)
                    });
                }
            });
            
            // Process domain skills
            skillDomains.forEach(domain => {
                const domainSkills = {
                    domain: domain.name,
                    skills: []
                };
                
                domain.skills.forEach(skill => {
                    const skillKey = skill.toLowerCase().replace(/\s+/g, '-');
                    const hasSkill = formData.get(`skill-${skillKey}`);
                    
                    if (hasSkill) {
                        const level = formData.get(`skill-level-${skillKey}`);
                        const years = formData.get(`skill-years-${skillKey}`);
                        
                        domainSkills.skills.push({
                            name: skill,
                            level: parseInt(level, 10),
                            yearsExperience: parseFloat(years)
                        });
                    }
                });
                
                if (domainSkills.skills.length > 0) {
                    assessment.domainSkills.push(domainSkills);
                }
            });
            
            // Process certifications
            const certIds = Array.from(formData.keys())
                .filter(key => key.endsWith('-provider'))
                .map(key => key.replace('-provider', ''));
            
            certIds.forEach(certId => {
                const provider = formData.get(`${certId}-provider`);
                const name = formData.get(`${certId}-name`);
                const dateAchieved = formData.get(`${certId}-date`);
                const expirationDate = formData.get(`${certId}-expiration`);
                
                if (provider && name && dateAchieved) {
                    assessment.certifications.push({
                        id: certId,
                        name: name,
                        provider: provider,
                        dateAchieved: new Date(dateAchieved),
                        expirationDate: expirationDate ? new Date(expirationDate) : null
                    });
                }
            });
            
            // Process preferences
            assessment.preferences = {
                learningStyle: formData.get('learning-style'),
                availableHoursPerWeek: parseInt(formData.get('hours-per-week'), 10),
                budgetConstraints: formData.get('budget'),
                timeframe: formData.get('timeframe')
            };
            
            return assessment;
        },
        
        /**
         * Save assessment data to local storage
         * @param {Object} data - The assessment data to save
         * @returns {Boolean} True if save was successful
         */
        saveAssessment: function(data) {
            if (!validateAssessmentData(data)) return false;
            
            try {
                // Store assessment data
                assessmentData = data;
                
                // Save to local storage
                localStorage.setItem('certificationRoadmap.assessment', JSON.stringify(data));
                
                return true;
            } catch (error) {
                console.error('Error saving assessment data:', error);
                return false;
            }
        },
        
        /**
         * Load assessment data from local storage
         * @returns {Object|null} The loaded assessment data or null if not found
         */
        loadAssessment: function() {
            try {
                const storedData = localStorage.getItem('certificationRoadmap.assessment');
                if (!storedData) return null;
                
                const data = JSON.parse(storedData);
                if (!validateAssessmentData(data)) return null;
                
                // Convert date strings back to Date objects
                if (data.timestamp) data.timestamp = new Date(data.timestamp);
                
                if (data.certifications && Array.isArray(data.certifications)) {
                    data.certifications.forEach(cert => {
                        if (cert.dateAchieved) cert.dateAchieved = new Date(cert.dateAchieved);
                        if (cert.expirationDate) cert.expirationDate = new Date(cert.expirationDate);
                    });
                }
                
                // Store in memory
                assessmentData = data;
                
                return data;
            } catch (error) {
                console.error('Error loading assessment data:', error);
                return null;
            }
        },
        
        /**
         * Get the current assessment data
         * @returns {Object|null} The current assessment data or null if not available
         */
        getAssessmentData: function() {
            return assessmentData;
        },
        
        /**
         * Clear assessment data from memory and storage
         * @returns {Boolean} True if clear was successful
         */
        clearAssessment: function() {
            try {
                assessmentData = null;
                localStorage.removeItem('certificationRoadmap.assessment');
                return true;
            } catch (error) {
                console.error('Error clearing assessment data:', error);
                return false;
            }
        },
        
        /**
         * Update existing assessment data
         * @param {Object} data - The updated assessment data
         * @returns {Boolean} True if update was successful
         */
        updateAssessment: function(data) {
            return this.saveAssessment(data);
        }
    };
})();