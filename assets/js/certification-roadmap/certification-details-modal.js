/**
 * Certification Details Modal Component
 * 
 * This component displays detailed information about AWS certifications
 * including exam details, domains, prerequisites, and study resources.
 */

window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.CertificationModal = (function() {
    
    let modalElement = null;
    let initialized = false;
    
    function init() {
        if (initialized) return;
        createModal();
        setupEventListeners();
        initialized = true;
    }
    
    function createModal() {
        modalElement = document.createElement('div');
        modalElement.className = 'certification-modal';
        modalElement.innerHTML = `
            <div class="certification-modal__backdrop"></div>
            <div class="certification-modal__container">
                <div class="certification-modal__header">
                    <h2 class="certification-modal__title" id="modal-title"></h2>
                    <button class="certification-modal__close" aria-label="Close modal">&times;</button>
                </div>
                <div class="certification-modal__content" id="modal-content">
                    <!-- Content will be populated dynamically -->
                </div>
            </div>
        `;
        document.body.appendChild(modalElement);
    }
    
    function setupEventListeners() {
        // Close modal when clicking backdrop or close button
        modalElement.querySelector('.certification-modal__backdrop').addEventListener('click', closeModal);
        modalElement.querySelector('.certification-modal__close').addEventListener('click', closeModal);
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalElement.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    function showCertificationDetails(certificationId) {
        const cert = getCertificationData(certificationId);
        if (!cert) {
            console.error('Certification not found:', certificationId);
            return;
        }
        
        populateModalContent(cert);
        openModal();
    }
    
    function getCertificationData(certificationId) {
        // Get certification from AWS certifications database
        const awsCerts = window.CertificationRoadmap.AWSCertifications;
        
        // Search through all levels
        for (const level in awsCerts) {
            if (awsCerts[level][certificationId]) {
                return awsCerts[level][certificationId];
            }
        }
        
        return null;
    }
    
    function populateModalContent(cert) {
        const titleElement = document.getElementById('modal-title');
        const contentElement = document.getElementById('modal-content');
        
        titleElement.textContent = cert.name;
        
        contentElement.innerHTML = `
            <div class="cert-overview">
                <div class="cert-badge ${cert.level.toLowerCase()}">${cert.level}</div>
                <div class="cert-code">${cert.examCode}</div>
                <p class="cert-description">${cert.description}</p>
            </div>
            
            <div class="cert-details-grid">
                <div class="cert-section">
                    <h3>Exam Details</h3>
                    <div class="cert-info-grid">
                        <div class="info-item">
                            <span class="info-label">Duration:</span>
                            <span class="info-value">${cert.duration} minutes</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Questions:</span>
                            <span class="info-value">${cert.questions}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Passing Score:</span>
                            <span class="info-value">${cert.passingScore}%</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Price:</span>
                            <span class="info-value">$${cert.price}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Validity:</span>
                            <span class="info-value">${cert.validity}</span>
                        </div>
                        ${cert.examLabs ? '<div class="info-item"><span class="info-label">Format:</span><span class="info-value">Multiple Choice + Labs</span></div>' : ''}
                    </div>
                </div>
                
                <div class="cert-section">
                    <h3>Exam Domains</h3>
                    <div class="domains-list">
                        ${cert.domains.map(domain => `
                            <div class="domain-item">
                                <div class="domain-header">
                                    <span class="domain-name">${domain.name}</span>
                                    <span class="domain-weight">${domain.weight}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="cert-section">
                    <h3>Prerequisites & Experience</h3>
                    <div class="prereq-info">
                        <div class="info-item">
                            <span class="info-label">Prerequisites:</span>
                            <span class="info-value">${cert.prerequisites}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Recommended Experience:</span>
                            <span class="info-value">${cert.experience}</span>
                        </div>
                    </div>
                </div>
                
                <div class="cert-section">
                    <h3>Career Information</h3>
                    <div class="career-info">
                        <div class="job-roles">
                            <h4>Target Job Roles:</h4>
                            <div class="roles-list">
                                ${cert.jobRoles.map(role => `<span class="role-tag">${role}</span>`).join('')}
                            </div>
                        </div>
                        ${cert.nextSteps ? `
                            <div class="next-steps">
                                <h4>Next Steps:</h4>
                                <ul>
                                    ${cert.nextSteps.map(step => `<li>${step}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="cert-section">
                    <h3>Languages Available</h3>
                    <div class="languages-list">
                        ${cert.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="cert-actions">
                <a href="${cert.officialLink}" target="_blank" rel="noopener" class="btn btn-primary">
                    Official Exam Guide
                </a>
                <button class="btn btn-secondary" onclick="CertificationRoadmap.CertificationModal.showStudyResources('${cert.id}')">
                    Study Resources
                </button>
                <button class="btn btn-outline" onclick="CertificationRoadmap.CertificationModal.addToStudyPlan('${cert.id}')">
                    Add to Study Plan
                </button>
            </div>
        `;
    }
    
    function openModal() {
        modalElement.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const closeButton = modalElement.querySelector('.certification-modal__close');
        closeButton.focus();
    }
    
    function closeModal() {
        modalElement.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showStudyResources(certificationId) {
        // Navigate to resources section filtered for this certification
        closeModal();
        
        // Trigger navigation to resources step
        if (window.CertificationRoadmap && window.CertificationRoadmap.App) {
            window.CertificationRoadmap.App.navigateToStep('resources');
        }
        
        // Filter resources by certification
        setTimeout(() => {
            const certFilter = document.getElementById('resource-certification-filter');
            if (certFilter) {
                certFilter.value = certificationId;
                certFilter.dispatchEvent(new Event('change'));
            }
        }, 500);
    }
    
    function addToStudyPlan(certificationId) {
        // Add certification to study plan
        closeModal();
        
        // Show notification
        if (window.CertificationRoadmap && window.CertificationRoadmap.AccessibilityEnhancements) {
            window.CertificationRoadmap.AccessibilityEnhancements.announce('Certification added to study plan');
        }
        
        // Navigate to study plan
        setTimeout(() => {
            if (window.CertificationRoadmap && window.CertificationRoadmap.App) {
                window.CertificationRoadmap.App.navigateToStep('study-plan');
            }
        }, 1000);
    }
    
    // Public API
    return {
        init: init,
        show: showCertificationDetails,
        close: closeModal,
        showStudyResources: showStudyResources,
        addToStudyPlan: addToStudyPlan
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.CertificationRoadmap.CertificationModal.init();
});