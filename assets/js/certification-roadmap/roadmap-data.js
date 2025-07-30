/**
 * Cloud Certification Roadmap - Roadmap Data
 * 
 * This module contains detailed roadmap paths and recommendations
 * for different cloud career paths and skill levels.
 */

window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.RoadmapData = (function() {
    
    // Career path roadmaps
    const roadmapPaths = {
        'cloud-architect': {
            name: 'Cloud Architect',
            description: 'Design and implement scalable, secure cloud architectures',
            icon: '🏗️',
            color: '#0066cc',
            paths: {
                aws: {
                    beginner: [
                        { id: 'aws-cloud-practitioner', order: 1, required: true },
                        { id: 'aws-solutions-architect-associate', order: 2, required: true },
                        { id: 'aws-solutions-architect-professional', order: 3, required: true }
                    ],
                    intermediate: [
                        { id: 'aws-solutions-architect-associate', order: 1, required: true },
                        { id: 'aws-solutions-architect-professional', order: 2, required: true },
                        { id: 'aws-security-specialty', order: 3, required: false }
                    ],
                    advanced: [
                        { id: 'aws-solutions-architect-professional', order: 1, required: true },
                        { id: 'aws-security-specialty', order: 2, required: false },
                        { id: 'aws-advanced-networking-specialty', order: 3, required: false }
                    ]
                },
                azure: {
                    beginner: [
                        { id: 'azure-fundamentals', order: 1, required: true },
                        { id: 'azure-solutions-architect-expert', order: 2, required: true }
                    ]
                },
                gcp: {
                    beginner: [
                        { id: 'gcp-cloud-digital-leader', order: 1, required: true },
                        { id: 'gcp-professional-cloud-architect', order: 2, required: true }
                    ]
                }
            },
            estimatedTimeMonths: { beginner: 12, intermediate: 8, advanced: 6 },
            averageSalary: { entry: 95000, mid: 130000, senior: 180000 }
        }
    };

    // Public API
    return {
        getRoadmapPaths: function() { return roadmapPaths; },
        getCareerPath: function(pathId) { return roadmapPaths[pathId]; }
    };
})();