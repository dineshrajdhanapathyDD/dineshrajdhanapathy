/**
 * Cloud Certification Roadmap - Certification Details
 * 
 * This module handles the display of detailed information about certifications.
 */

// Certification Details Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.CertificationDetails = (function() {
    // Private variables
    let currentCertification = null;
    let containerElement = null;
    
    // Private functions
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }
    
    function formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        
        return `${mins}m`;
    }
    
    function createTopicChart(topics, container) {
        // Clear container
        container.innerHTML = '';
        
        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'certification-details__topic-chart';
        
        // Calculate total weight
        const totalWeight = topics.reduce((sum, topic) => sum + topic.weight, 0);
        
        // Create bars for each topic
        topics.forEach(topic => {
            const percentage = (topic.weight / totalWeight) * 100;
            
            const topicBar = document.createElement('div');
            topicBar.className = 'certification-details__topic-bar';
            
            const topicFill = document.createElement('div');
            topicFill.className = 'certification-details__topic-fill';
            topicFill.style.width = `${percentage}%`;
            
            const topicLabel = document.createElement('div');
            topicLabel.className = 'certification-details__topic-label';
            topicLabel.textContent = `${topic.name} (${topic.weight}%)`;
            
            topicBar.appendChild(topicFill);
            topicBar.appendChild(topicLabel);
            chartContainer.appendChild(topicBar);
        });
        
        container.appendChild(chartContainer);
    }
    
    function createSubtopicsList(topics, container) {
        // Clear container
        container.innerHTML = '';
        
        // Create list container
        const listContainer = document.createElement('div');
        listContainer.className = 'certification-details__subtopics';
        
        // Create lists for each topic
        topics.forEach(topic => {
            const topicSection = document.createElement('div');
            topicSection.className = 'certification-details__subtopic-section';
            
            const topicHeader = document.createElement('h4');
            topicHeader.className = 'certification-details__subtopic-header';
            topicHeader.textContent = topic.name;
            
            const subtopicList = document.createElement('ul');
            subtopicList.className = 'certification-details__subtopic-list';
            
            topic.subtopics.forEach(subtopic => {
                const listItem = document.createElement('li');
                listItem.textContent = subtopic;
                subtopicList.appendChild(listItem);
            });
            
            topicSection.appendChild(topicHeader);
            topicSection.appendChild(subtopicList);
            listContainer.appendChild(topicSection);
        });
        
        container.appendChild(listContainer);
    }
    
    function createPreparationTimeChart(prepTimes, container) {
        // Clear container
        container.innerHTML = '';
        
        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'certification-details__prep-chart';
        
        // Create bars for each experience level
        const levels = [
            { key: 'beginner', label: 'Beginner' },
            { key: 'intermediate', label: 'Intermediate' },
            { key: 'advanced', label: 'Advanced' }
        ];
        
        // Find max hours for scaling
        const maxHours = Math.max(prepTimes.beginner, prepTimes.intermediate, prepTimes.advanced);
        
        levels.forEach(level => {
            const hours = prepTimes[level.key];
            const percentage = (hours / maxHours) * 100;
            
            const prepBar = document.createElement('div');
            prepBar.className = 'certification-details__prep-bar';
            
            const prepLabel = document.createElement('div');
            prepLabel.className = 'certification-details__prep-label';
            prepLabel.textContent = level.label;
            
            const prepFill = document.createElement('div');
            prepFill.className = 'certification-details__prep-fill';
            prepFill.style.width = `${percentage}%`;
            
            const prepHours = document.createElement('div');
            prepHours.className = 'certification-details__prep-hours';
            prepHours.textContent = `${hours} hours`;
            
            prepBar.appendChild(prepLabel);
            prepBar.appendChild(prepFill);
            prepBar.appendChild(prepHours);
            chartContainer.appendChild(prepBar);
        });
        
        container.appendChild(chartContainer);
    }
    
    // Public API
    return {
        /**
         * Initialize the certification details component
         * @param {HTMLElement} container - The container element for certification details
         */
        initDetails: function(container) {
            if (!container) return;
            
            containerElement = container;
            
            // Create initial placeholder content
            container.innerHTML = `
                <div class="certification-details__placeholder">
                    <p>Select a certification from the roadmap to view details</p>
                </div>
            `;
            
            // Listen for certification selection events
            document.addEventListener('certification-selected', event => {
                const certification = event.detail.certification;
                this.showCertificationDetails(certification);
            });
        },
        
        /**
         * Show detailed information for a certification
         * @param {Object} certification - The certification to display
         */
        showCertificationDetails: function(certification) {
            if (!containerElement || !certification) return;
            
            currentCertification = certification;
            
            // Create details HTML
            const detailsHtml = `
                <div class="certification-details__content">
                    <div class="certification-details__header">
                        <h3 class="certification-details__title">${certification.name}</h3>
                        <div class="certification-details__meta">
                            <span class="certification-details__code">${certification.examCode}</span>
                            <span class="certification-details__level">${certification.level}</span>
                        </div>
                    </div>
                    
                    <div class="certification-details__description">
                        <p>${certification.description}</p>
                    </div>
                    
                    <div class="certification-details__tabs">
                        <div class="certification-details__tab-headers">
                            <button class="certification-details__tab-button active" data-tab="exam-details">Exam Details</button>
                            <button class="certification-details__tab-button" data-tab="topics">Topics & Content</button>
                            <button class="certification-details__tab-button" data-tab="preparation">Preparation</button>
                            <button class="certification-details__tab-button" data-tab="career">Career Impact</button>
                            <button class="certification-details__tab-button" data-tab="resources">Resources</button>
                        </div>
                        
                        <div class="certification-details__tab-content active" data-tab="exam-details">
                            <div class="certification-details__exam-info">
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Duration:</span>
                                    <span class="certification-details__info-value">${formatDuration(certification.examDetails.duration)}</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Questions:</span>
                                    <span class="certification-details__info-value">${certification.examDetails.questionCount}</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Passing Score:</span>
                                    <span class="certification-details__info-value">${certification.examDetails.passingScore}%</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Format:</span>
                                    <span class="certification-details__info-value">${certification.examDetails.format}</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Price:</span>
                                    <span class="certification-details__info-value">${formatCurrency(certification.examDetails.price)}</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Languages:</span>
                                    <span class="certification-details__info-value">${certification.examDetails.languages.join(', ')}</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Validity:</span>
                                    <span class="certification-details__info-value">${certification.validity > 0 ? certification.validity + ' years' : 'Does not expire'}</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Recertification:</span>
                                    <span class="certification-details__info-value">${certification.recertification}</span>
                                </div>
                            </div>
                            
                            <div class="certification-details__official-link">
                                <a href="${certification.officialLink}" target="_blank" rel="noopener noreferrer">
                                    Official Certification Page <i class="fas fa-external-link-alt"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div class="certification-details__tab-content" data-tab="topics">
                            <div class="certification-details__topic-distribution">
                                <h4>Topic Distribution</h4>
                                <div class="certification-details__topic-chart-container"></div>
                            </div>
                            
                            <div class="certification-details__topic-details">
                                <h4>Detailed Topics</h4>
                                <div class="certification-details__subtopics-container"></div>
                            </div>
                        </div>
                        
                        <div class="certification-details__tab-content" data-tab="preparation">
                            <div class="certification-details__prep-info">
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Recommended Experience:</span>
                                    <span class="certification-details__info-value">${certification.recommendedExperience}</span>
                                </div>
                                
                                <div class="certification-details__info-item">
                                    <span class="certification-details__info-label">Difficulty Level:</span>
                                    <span class="certification-details__info-value">
                                        ${'★'.repeat(certification.difficulty)}${'☆'.repeat(5 - certification.difficulty)}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="certification-details__prep-time">
                                <h4>Estimated Preparation Time</h4>
                                <div class="certification-details__prep-chart-container"></div>
                            </div>
                            
                            <div class="certification-details__prerequisites">
                                <h4>Prerequisites</h4>
                                <div class="certification-details__prerequisites-container">
                                    ${certification.prerequisites && certification.prerequisites.length > 0 ? 
                                        '<ul class="certification-details__prerequisites-list" id="prerequisites-list"></ul>' : 
                                        '<p>No prerequisites required</p>'
                                    }
                                </div>
                            </div>
                        </div>
                        
                        <div class="certification-details__tab-content" data-tab="career">
                            <div class="certification-details__job-roles">
                                <h4>Relevant Job Roles</h4>
                                <ul class="certification-details__job-roles-list">
                                    ${certification.jobRoles.map(role => `<li>${role}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="certification-details__related-certs">
                                <h4>Related Certifications</h4>
                                <div class="certification-details__related-container">
                                    ${certification.relatedCertifications && certification.relatedCertifications.length > 0 ? 
                                        '<ul class="certification-details__related-list" id="related-certs-list"></ul>' : 
                                        '<p>No related certifications</p>'
                                    }
                                </div>
                            </div>
                        </div>
                        
                        <div class="certification-details__tab-content" data-tab="resources">
                            <div class="certification-details__resources">
                                <div class="certification-details__resource-section">
                                    <h4>Official Documentation</h4>
                                    <div class="certification-details__resource-links" id="official-docs-container">
                                        <ul class="certification-details__resource-list">
                                            <li class="certification-details__resource-item">
                                                <a href="${certification.officialLink}" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                    <div class="certification-details__resource-icon">📄</div>
                                                    <div class="certification-details__resource-info">
                                                        <div class="certification-details__resource-title">Official Certification Page</div>
                                                        <div class="certification-details__resource-description">Official certification information, exam guide, and registration</div>
                                                    </div>
                                                </a>
                                            </li>
                                            ${certification.id.startsWith('aws-') ? `
                                                <li class="certification-details__resource-item">
                                                    <a href="https://aws.amazon.com/training/" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">🎓</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">AWS Training and Certification</div>
                                                            <div class="certification-details__resource-description">Official AWS training courses and certification resources</div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li class="certification-details__resource-item">
                                                    <a href="https://docs.aws.amazon.com/" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">📚</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">AWS Documentation</div>
                                                            <div class="certification-details__resource-description">Comprehensive documentation for all AWS services</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ` : ''}
                                            ${certification.id.startsWith('azure-') ? `
                                                <li class="certification-details__resource-item">
                                                    <a href="https://learn.microsoft.com/en-us/certifications/" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">🎓</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Microsoft Learn</div>
                                                            <div class="certification-details__resource-description">Official Microsoft training and certification resources</div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li class="certification-details__resource-item">
                                                    <a href="https://learn.microsoft.com/en-us/azure/" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">📚</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Azure Documentation</div>
                                                            <div class="certification-details__resource-description">Comprehensive documentation for all Azure services</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ` : ''}
                                            ${certification.id.startsWith('gcp-') ? `
                                                <li class="certification-details__resource-item">
                                                    <a href="https://cloud.google.com/learn/certification" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">🎓</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Google Cloud Training</div>
                                                            <div class="certification-details__resource-description">Official Google Cloud training and certification resources</div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li class="certification-details__resource-item">
                                                    <a href="https://cloud.google.com/docs" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">📚</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Google Cloud Documentation</div>
                                                            <div class="certification-details__resource-description">Comprehensive documentation for all Google Cloud services</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ` : ''}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="certification-details__resource-section">
                                    <h4>Exam Preparation</h4>
                                    <div class="certification-details__resource-links">
                                        <ul class="certification-details__resource-list">
                                            <li class="certification-details__resource-item">
                                                <a href="#" class="certification-details__resource-link" id="study-plan-link">
                                                    <div class="certification-details__resource-icon">📝</div>
                                                    <div class="certification-details__resource-info">
                                                        <div class="certification-details__resource-title">Create Study Plan</div>
                                                        <div class="certification-details__resource-description">Generate a personalized study plan for this certification</div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li class="certification-details__resource-item">
                                                <a href="#" class="certification-details__resource-link" id="recommended-resources-link">
                                                    <div class="certification-details__resource-icon">📚</div>
                                                    <div class="certification-details__resource-info">
                                                        <div class="certification-details__resource-title">Recommended Resources</div>
                                                        <div class="certification-details__resource-description">View recommended learning resources for this certification</div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="certification-details__resource-section">
                                    <h4>Community Resources</h4>
                                    <div class="certification-details__resource-links">
                                        <ul class="certification-details__resource-list">
                                            ${certification.id.startsWith('aws-') ? `
                                                <li class="certification-details__resource-item">
                                                    <a href="https://aws.amazon.com/blogs/" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">📰</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">AWS Blog</div>
                                                            <div class="certification-details__resource-description">Official AWS blog with latest updates and best practices</div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li class="certification-details__resource-item">
                                                    <a href="https://reddit.com/r/AWSCertifications" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">💬</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">AWS Certifications Reddit</div>
                                                            <div class="certification-details__resource-description">Community discussions and exam preparation tips</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ` : ''}
                                            ${certification.id.startsWith('azure-') ? `
                                                <li class="certification-details__resource-item">
                                                    <a href="https://techcommunity.microsoft.com/t5/azure/ct-p/Azure" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">💬</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Azure Tech Community</div>
                                                            <div class="certification-details__resource-description">Official Microsoft Azure community forums</div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li class="certification-details__resource-item">
                                                    <a href="https://reddit.com/r/AzureCertification" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">💬</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Azure Certification Reddit</div>
                                                            <div class="certification-details__resource-description">Community discussions and exam preparation tips</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ` : ''}
                                            ${certification.id.startsWith('gcp-') ? `
                                                <li class="certification-details__resource-item">
                                                    <a href="https://cloud.google.com/blog" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">📰</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Google Cloud Blog</div>
                                                            <div class="certification-details__resource-description">Official Google Cloud blog with latest updates and best practices</div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li class="certification-details__resource-item">
                                                    <a href="https://www.reddit.com/r/googlecloud/" target="_blank" rel="noopener noreferrer" class="certification-details__resource-link">
                                                        <div class="certification-details__resource-icon">💬</div>
                                                        <div class="certification-details__resource-info">
                                                            <div class="certification-details__resource-title">Google Cloud Reddit</div>
                                                            <div class="certification-details__resource-description">Community discussions and exam preparation tips</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ` : ''}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Update container content
            containerElement.innerHTML = detailsHtml;
            
            // Set up tab switching
            const tabButtons = containerElement.querySelectorAll('.certification-details__tab-button');
            const tabContents = containerElement.querySelectorAll('.certification-details__tab-content');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Deactivate all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    // Activate selected tab
                    button.classList.add('active');
                    const tabName = button.getAttribute('data-tab');
                    containerElement.querySelector(`.certification-details__tab-content[data-tab="${tabName}"]`).classList.add('active');
                });
            });
            
            // Set up resource links
            const studyPlanLink = containerElement.querySelector('#study-plan-link');
            if (studyPlanLink) {
                studyPlanLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Navigate to study plan step
                    if (window.CertificationRoadmap.Main && window.CertificationRoadmap.Main.navigateToStep) {
                        window.CertificationRoadmap.Main.navigateToStep('study-plan');
                    }
                    
                    // Generate study plan for this certification
                    if (window.CertificationRoadmap.Main && window.CertificationRoadmap.Main.generateStudyPlan) {
                        window.CertificationRoadmap.Main.generateStudyPlan(certification.id);
                    }
                });
            }
            
            const recommendedResourcesLink = containerElement.querySelector('#recommended-resources-link');
            if (recommendedResourcesLink) {
                recommendedResourcesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Show recommended resources for this certification
                    if (window.CertificationRoadmap.ResourceRecommender) {
                        const resources = window.CertificationRoadmap.ResourceRecommender.getResourcesForCertification(certification.id);
                        
                        if (resources && resources.length > 0) {
                            // Create a modal to display resources
                            const modal = document.createElement('div');
                            modal.className = 'certification-details__modal';
                            
                            const modalContent = document.createElement('div');
                            modalContent.className = 'certification-details__modal-content';
                            
                            const modalHeader = document.createElement('div');
                            modalHeader.className = 'certification-details__modal-header';
                            
                            const modalTitle = document.createElement('h3');
                            modalTitle.textContent = `Resources for ${certification.name}`;
                            
                            const closeButton = document.createElement('button');
                            closeButton.className = 'certification-details__modal-close';
                            closeButton.textContent = '×';
                            closeButton.addEventListener('click', () => {
                                document.body.removeChild(modal);
                            });
                            
                            modalHeader.appendChild(modalTitle);
                            modalHeader.appendChild(closeButton);
                            
                            const modalBody = document.createElement('div');
                            modalBody.className = 'certification-details__modal-body';
                            
                            // Create resource cards
                            resources.forEach(resource => {
                                const resourceCard = document.createElement('div');
                                resourceCard.className = 'certification-details__resource-card';
                                
                                const resourceHeader = document.createElement('div');
                                resourceHeader.className = 'certification-details__resource-card-header';
                                
                                const resourceTitle = document.createElement('h4');
                                resourceTitle.textContent = resource.title;
                                
                                const resourceProvider = document.createElement('span');
                                resourceProvider.className = 'certification-details__resource-provider';
                                resourceProvider.textContent = resource.provider;
                                
                                resourceHeader.appendChild(resourceTitle);
                                resourceHeader.appendChild(resourceProvider);
                                
                                const resourceDescription = document.createElement('p');
                                resourceDescription.className = 'certification-details__resource-description';
                                resourceDescription.textContent = resource.description;
                                
                                const resourceMeta = document.createElement('div');
                                resourceMeta.className = 'certification-details__resource-meta';
                                
                                const resourceFormat = document.createElement('span');
                                resourceFormat.className = 'certification-details__resource-format';
                                resourceFormat.textContent = resource.format;
                                
                                const resourceCost = document.createElement('span');
                                resourceCost.className = 'certification-details__resource-cost';
                                resourceCost.textContent = resource.cost.type === 'free' ? 'Free' : `${resource.cost.currency}${resource.cost.amount}`;
                                
                                resourceMeta.appendChild(resourceFormat);
                                resourceMeta.appendChild(resourceCost);
                                
                                const resourceLink = document.createElement('a');
                                resourceLink.className = 'certification-details__resource-link-button';
                                resourceLink.href = resource.url;
                                resourceLink.target = '_blank';
                                resourceLink.rel = 'noopener noreferrer';
                                resourceLink.textContent = 'View Resource';
                                
                                resourceCard.appendChild(resourceHeader);
                                resourceCard.appendChild(resourceDescription);
                                resourceCard.appendChild(resourceMeta);
                                resourceCard.appendChild(resourceLink);
                                
                                modalBody.appendChild(resourceCard);
                            });
                            
                            modalContent.appendChild(modalHeader);
                            modalContent.appendChild(modalBody);
                            modal.appendChild(modalContent);
                            
                            document.body.appendChild(modal);
                        } else {
                            alert('No recommended resources available for this certification.');
                        }
                    }
                });
            }
            
            // Create topic chart
            const topicChartContainer = containerElement.querySelector('.certification-details__topic-chart-container');
            if (topicChartContainer && certification.topics) {
                createTopicChart(certification.topics, topicChartContainer);
            }
            
            // Create subtopics list
            const subtopicsContainer = containerElement.querySelector('.certification-details__subtopics-container');
            if (subtopicsContainer && certification.topics) {
                createSubtopicsList(certification.topics, subtopicsContainer);
            }
            
            // Create preparation time chart
            const prepChartContainer = containerElement.querySelector('.certification-details__prep-chart-container');
            if (prepChartContainer && certification.preparationTimeHours) {
                createPreparationTimeChart(certification.preparationTimeHours, prepChartContainer);
            }
            
            // Populate prerequisites list
            const prerequisitesList = containerElement.querySelector('#prerequisites-list');
            if (prerequisitesList && certification.prerequisites && certification.prerequisites.length > 0) {
                this.populatePrerequisitesList(certification.prerequisites, prerequisitesList);
            }
            
            // Populate related certifications list
            const relatedCertsList = containerElement.querySelector('#related-certs-list');
            if (relatedCertsList && certification.relatedCertifications && certification.relatedCertifications.length > 0) {
                this.populateRelatedCertificationsList(certification.relatedCertifications, relatedCertsList);
            }
        },
        
        /**
         * Populate the prerequisites list
         * @param {Array} prerequisites - Array of prerequisite certification IDs
         * @param {HTMLElement} container - The container element for the list
         */
        populatePrerequisitesList: function(prerequisites, container) {
            if (!container || !prerequisites || prerequisites.length === 0) return;
            
            // Clear container
            container.innerHTML = '';
            
            // Get certification database
            const certDatabase = window.CertificationRoadmap.CertificationDatabase;
            
            // Add each prerequisite to the list
            prerequisites.forEach(prereqId => {
                const prereq = certDatabase.getCertificationById(prereqId);
                if (prereq) {
                    const listItem = document.createElement('li');
                    listItem.className = 'certification-details__prerequisite-item';
                    
                    const certLink = document.createElement('a');
                    certLink.href = '#';
                    certLink.className = 'certification-details__cert-link';
                    certLink.textContent = prereq.name;
                    certLink.setAttribute('data-cert-id', prereq.id);
                    
                    certLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showCertificationDetails(prereq);
                        
                        // Also update the roadmap visualization if available
                        if (window.CertificationRoadmap.RoadmapVisualizer) {
                            window.CertificationRoadmap.RoadmapVisualizer.selectCertification(prereq.id);
                        }
                    });
                    
                    listItem.appendChild(certLink);
                    container.appendChild(listItem);
                }
            });
        },
        
        /**
         * Populate the related certifications list
         * @param {Array} relatedCerts - Array of related certification IDs
         * @param {HTMLElement} container - The container element for the list
         */
        populateRelatedCertificationsList: function(relatedCerts, container) {
            if (!container || !relatedCerts || relatedCerts.length === 0) return;
            
            // Clear container
            container.innerHTML = '';
            
            // Get certification database
            const certDatabase = window.CertificationRoadmap.CertificationDatabase;
            
            // Add each related certification to the list
            relatedCerts.forEach(relatedId => {
                const related = certDatabase.getCertificationById(relatedId);
                if (related) {
                    const listItem = document.createElement('li');
                    listItem.className = 'certification-details__related-item';
                    
                    const certLink = document.createElement('a');
                    certLink.href = '#';
                    certLink.className = 'certification-details__cert-link';
                    certLink.textContent = related.name;
                    certLink.setAttribute('data-cert-id', related.id);
                    
                    certLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showCertificationDetails(related);
                        
                        // Also update the roadmap visualization if available
                        if (window.CertificationRoadmap.RoadmapVisualizer) {
                            window.CertificationRoadmap.RoadmapVisualizer.selectCertification(related.id);
                        }
                    });
                    
                    listItem.appendChild(certLink);
                    container.appendChild(listItem);
                }
            });
        },
        
        /**
         * Compare multiple certifications
         * @param {Array} certIds - Array of certification IDs to compare
         * @param {HTMLElement} container - The container element for the comparison
         */
        compareCertifications: function(certIds, container) {
            if (!container || !certIds || certIds.length === 0) return;
            
            // Get certification database
            const certDatabase = window.CertificationRoadmap.CertificationDatabase;
            
            // Get comparison data
            const comparison = certDatabase.compareCertifications(certIds);
            if (!comparison) return;
            
            // Create comparison HTML
            let comparisonHtml = `
                <div class="certification-details__comparison">
                    <h3 class="certification-details__comparison-title">Certification Comparison</h3>
                    
                    <table class="certification-details__comparison-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                ${comparison.certifications.map(cert => `<th>${cert.shortName}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Provider</td>
                                ${comparison.certifications.map(cert => {
                                    let provider = '';
                                    if (cert.id.startsWith('aws-')) provider = 'AWS';
                                    else if (cert.id.startsWith('azure-')) provider = 'Microsoft Azure';
                                    else if (cert.id.startsWith('gcp-')) provider = 'Google Cloud';
                                    return `<td>${provider}</td>`;
                                }).join('')}
                            </tr>
                            <tr>
                                <td>Level</td>
                                ${comparison.comparisonPoints.level.map(level => `<td>${level}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Exam Duration</td>
                                ${comparison.comparisonPoints.examDuration.map(duration => `<td>${formatDuration(duration)}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Questions</td>
                                ${comparison.comparisonPoints.questionCount.map(count => `<td>${count}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Passing Score</td>
                                ${comparison.comparisonPoints.passingScore.map(score => `<td>${score}%</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Price</td>
                                ${comparison.comparisonPoints.price.map(price => `<td>${formatCurrency(price)}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Validity</td>
                                ${comparison.comparisonPoints.validity.map(validity => 
                                    `<td>${validity > 0 ? validity + ' years' : 'Does not expire'}</td>`
                                ).join('')}
                            </tr>
                            <tr>
                                <td>Difficulty</td>
                                ${comparison.comparisonPoints.difficulty.map(difficulty => 
                                    `<td>${'★'.repeat(difficulty)}${'☆'.repeat(5 - difficulty)}</td>`
                                ).join('')}
                            </tr>
                            <tr>
                                <td>Preparation Time (Intermediate)</td>
                                ${comparison.comparisonPoints.preparationTime.map(prep => 
                                    `<td>${prep.intermediate} hours</td>`
                                ).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            
            // Update container content
            container.innerHTML = comparisonHtml;
        },
        
        /**
         * Get the current certification
         * @returns {Object|null} The current certification or null if none selected
         */
        getCurrentCertification: function() {
            return currentCertification;
        },
        
        /**
         * Clear the certification details
         */
        clearDetails: function() {
            if (!containerElement) return;
            
            currentCertification = null;
            
            // Reset to placeholder content
            containerElement.innerHTML = `
                <div class="certification-details__placeholder">
                    <p>Select a certification from the roadmap to view details</p>
                </div>
            `;
        }
    };
})();