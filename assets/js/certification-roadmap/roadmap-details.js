/**
 * Cloud Certification Roadmap - Roadmap Details Component
 * 
 * This module handles displaying detailed roadmap information
 * including certification paths, prerequisites, and recommendations.
 */

window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.RoadmapDetails = (function() {
    
    // Private variables
    let currentRoadmap = null;
    let initialized = false;
    
    // Private functions
    function createRoadmapVisualization(roadmapData) {
        const container = document.getElementById('roadmap-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="roadmap-header">
                <h3 class="roadmap-title">Your Personalized Certification Roadmap</h3>
                <p class="roadmap-description">Based on your skills and career goals</p>
            </div>
            
            <div class="roadmap-content">
                <div class="roadmap-path-selector">
                    <label for="provider-select">Cloud Provider:</label>
                    <select id="provider-select" class="roadmap-select">
                        <option value="aws">Amazon Web Services (AWS)</option>
                        <option value="azure">Microsoft Azure</option>
                        <option value="gcp">Google Cloud Platform (GCP)</option>
                        <option value="multicloud">Multi-Cloud Path</option>
                    </select>
                </div>
                
                <div class="roadmap-visualization" id="roadmap-viz">
                    ${generateRoadmapSteps(roadmapData)}
                </div>
                
                <div class="roadmap-summary">
                    <div class="roadmap-stats">
                        <div class="stat-item">
                            <span class="stat-number">3-5</span>
                            <span class="stat-label">Certifications</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">6-12</span>
                            <span class="stat-label">Months</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">$95k+</span>
                            <span class="stat-label">Avg Salary</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        setupRoadmapInteractions();
    }
    
    function generateRoadmapSteps(roadmapData) {
        // Sample roadmap steps - this would be dynamic based on user data
        const steps = [
            {
                id: 'aws-cloud-practitioner',
                name: 'AWS Cloud Practitioner',
                level: 'Foundational',
                duration: '2-3 months',
                difficulty: 'Beginner',
                status: 'recommended',
                description: 'Start your cloud journey with fundamental AWS concepts'
            },
            {
                id: 'aws-solutions-architect-associate',
                name: 'AWS Solutions Architect Associate',
                level: 'Associate',
                duration: '3-4 months',
                difficulty: 'Intermediate',
                status: 'next',
                description: 'Learn to design resilient and scalable AWS architectures'
            },
            {
                id: 'aws-solutions-architect-professional',
                name: 'AWS Solutions Architect Professional',
                level: 'Professional',
                duration: '4-6 months',
                difficulty: 'Advanced',
                status: 'future',
                description: 'Master complex architectural patterns and enterprise solutions'
            }
        ];
        
        return steps.map((step, index) => `
            <div class="roadmap-step ${step.status}" data-step-id="${step.id}">
                <div class="step-connector ${index > 0 ? 'visible' : ''}"></div>
                <div class="step-content">
                    <div class="step-header">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-badge ${step.level.toLowerCase()}">${step.level}</div>
                    </div>
                    <div class="step-body">
                        <h4 class="step-title">${step.name}</h4>
                        <p class="step-description">${step.description}</p>
                        <div class="step-meta">
                            <span class="meta-item">
                                <i class="icon-clock"></i>
                                ${step.duration}
                            </span>
                            <span class="meta-item">
                                <i class="icon-level"></i>
                                ${step.difficulty}
                            </span>
                        </div>
                    </div>
                    <div class="step-actions">
                        <button class="btn-step-details" data-cert-id="${step.id}">
                            View Details
                        </button>
                        <button class="btn-step-resources" data-cert-id="${step.id}">
                            Resources
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function setupRoadmapInteractions() {
        // Provider selector
        const providerSelect = document.getElementById('provider-select');
        if (providerSelect) {
            providerSelect.addEventListener('change', function() {
                updateRoadmapForProvider(this.value);
            });
        }
        
        // Step detail buttons
        document.querySelectorAll('.btn-step-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const certId = this.getAttribute('data-cert-id');
                showCertificationDetails(certId);
            });
        });
        
        // Resource buttons
        document.querySelectorAll('.btn-step-resources').forEach(btn => {
            btn.addEventListener('click', function() {
                const certId = this.getAttribute('data-cert-id');
                showCertificationResources(certId);
            });
        });
    }
    
    // Public API
    return {
        init: function() {
            if (initialized) return;
            initialized = true;
        },
        
        displayRoadmap: function(roadmapData) {
            currentRoadmap = roadmapData;
            createRoadmapVisualization(roadmapData);
        }
    };
})();