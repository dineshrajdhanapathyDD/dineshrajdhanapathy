/**
 * Cloud Certification Roadmap - Roadmap Generator
 * 
 * This module handles the generation of personalized certification roadmaps
 * based on user assessment data and career goals.
 */

// Roadmap Generator Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.RoadmapGenerator = (function() {
    // Private variables
    let currentRoadmap = null;
    
    // Private functions
    function calculateCertificationScore(cert, assessmentData, careerGoalsData) {
        // Base score starts at 0
        let score = 0;
        
        // Get provider experience level
        const providerExperience = getProviderExperienceLevel(cert.id, assessmentData);
        
        // 1. Provider alignment (0-40 points)
        // Higher score if user has experience with this provider
        score += providerExperience * 10; // 0-40 points
        
        // 2. Career path alignment (0-30 points)
        score += calculateCareerPathAlignment(cert, careerGoalsData) * 30;
        
        // 3. Skill gap alignment (0-20 points)
        // Higher score if certification addresses skill gaps
        score += calculateSkillGapAlignment(cert, assessmentData) * 20;
        
        // 4. Difficulty appropriateness (0-10 points)
        // Higher score if certification difficulty matches user's experience level
        score += calculateDifficultyAppropriateness(cert, assessmentData) * 10;
        
        return score;
    }
    
    function getProviderExperienceLevel(certId, assessmentData) {
        if (!assessmentData || !assessmentData.cloudProviders) return 0;
        
        // Determine provider from cert ID
        let provider = '';
        if (certId.startsWith('aws-')) {
            provider = 'AWS';
        } else if (certId.startsWith('azure-')) {
            provider = 'Azure';
        } else if (certId.startsWith('gcp-')) {
            provider = 'GCP';
        } else {
            return 0;
        }
        
        // Find provider in assessment data
        const providerData = assessmentData.cloudProviders.find(p => p.name === provider);
        if (!providerData) return 0;
        
        // Normalize experience level to 0-1 range
        return providerData.experienceLevel / 4;
    }
    
    function calculateCareerPathAlignment(cert, careerGoalsData) {
        if (!careerGoalsData || !careerGoalsData.primaryPath) return 0;
        
        // Map certification IDs to career paths
        const certPathMap = {
            // AWS certifications
            'aws-cloud-practitioner': ['cloud-admin', 'devops-engineer', 'cloud-architect', 'cloud-developer'],
            'aws-solutions-architect-associate': ['cloud-architect', 'devops-engineer'],
            'aws-developer-associate': ['cloud-developer', 'devops-engineer'],
            'aws-sysops-administrator-associate': ['cloud-admin', 'devops-engineer', 'site-reliability'],
            'aws-solutions-architect-professional': ['cloud-architect'],
            'aws-devops-engineer-professional': ['devops-engineer', 'site-reliability'],
            'aws-security-specialty': ['cloud-security'],
            
            // Azure certifications
            'azure-fundamentals': ['cloud-admin', 'devops-engineer', 'cloud-architect', 'cloud-developer'],
            'azure-administrator': ['cloud-admin', 'devops-engineer'],
            'azure-developer': ['cloud-developer', 'devops-engineer'],
            'azure-solutions-architect': ['cloud-architect'],
            
            // GCP certifications
            'gcp-cloud-digital-leader': ['cloud-admin', 'devops-engineer', 'cloud-architect', 'cloud-developer'],
            'gcp-cloud-engineer': ['cloud-admin', 'devops-engineer'],
            'gcp-cloud-architect': ['cloud-architect'],
            'gcp-cloud-developer': ['cloud-developer', 'devops-engineer']
        };
        
        // Check if certification aligns with primary career path
        const certPaths = certPathMap[cert.id] || [];
        if (certPaths.includes(careerGoalsData.primaryPath)) {
            return 1.0; // Perfect alignment with primary path
        }
        
        // Check if certification aligns with secondary career paths
        if (careerGoalsData.secondaryPaths && careerGoalsData.secondaryPaths.length > 0) {
            for (const secondaryPath of careerGoalsData.secondaryPaths) {
                if (certPaths.includes(secondaryPath)) {
                    return 0.7; // Good alignment with secondary path
                }
            }
        }
        
        // No direct alignment, but might still be relevant
        return 0.3;
    }
    
    function calculateSkillGapAlignment(cert, assessmentData) {
        if (!assessmentData || !assessmentData.domainSkills) return 0.5; // Default to medium alignment
        
        // Map certification topics to skill domains
        const certTopicMap = {
            // Example mapping for AWS Solutions Architect Associate
            'aws-solutions-architect-associate': {
                'Compute': 0.8,
                'Storage': 0.9,
                'Networking': 0.9,
                'Databases': 0.7,
                'Security': 0.7,
                'Management': 0.6
            },
            // Add mappings for other certifications
        };
        
        // Get topic weights for this certification
        const topicWeights = certTopicMap[cert.id];
        if (!topicWeights) return 0.5; // Default to medium alignment
        
        // Calculate average skill level for each domain
        const domainSkillLevels = {};
        assessmentData.domainSkills.forEach(domain => {
            if (domain.skills.length === 0) return;
            
            const avgLevel = domain.skills.reduce((sum, skill) => sum + skill.level, 0) / domain.skills.length;
            domainSkillLevels[domain.domain] = avgLevel / 4; // Normalize to 0-1 range
        });
        
        // Calculate skill gap score
        let gapScore = 0;
        let weightSum = 0;
        
        for (const domain in topicWeights) {
            const weight = topicWeights[domain];
            const skillLevel = domainSkillLevels[domain] || 0;
            
            // Higher gap (lower skill level) means higher score
            const gap = 1 - skillLevel;
            gapScore += gap * weight;
            weightSum += weight;
        }
        
        return weightSum > 0 ? gapScore / weightSum : 0.5;
    }
    
    function calculateDifficultyAppropriateness(cert, assessmentData) {
        if (!assessmentData || !assessmentData.cloudProviders) return 0.5;
        
        // Determine provider from cert ID
        let provider = '';
        if (cert.id.startsWith('aws-')) {
            provider = 'AWS';
        } else if (cert.id.startsWith('azure-')) {
            provider = 'Azure';
        } else if (cert.id.startsWith('gcp-')) {
            provider = 'GCP';
        } else {
            return 0.5;
        }
        
        // Find provider in assessment data
        const providerData = assessmentData.cloudProviders.find(p => p.name === provider);
        const experienceLevel = providerData ? providerData.experienceLevel : 0;
        
        // Map certification levels to expected experience levels
        const levelMap = {
            'Foundational': 0, // No experience needed
            'Associate': 1,    // Beginner level
            'Professional': 3, // Advanced level
            'Specialty': 3,    // Advanced level
            'Expert': 4        // Expert level
        };
        
        const expectedLevel = levelMap[cert.level] || 0;
        
        // Calculate appropriateness (1 = perfect match, 0 = completely inappropriate)
        // Perfect match if user's experience is exactly at the expected level
        // Good match if user's experience is 1 level above or below expected
        // Poor match otherwise
        const levelDifference = Math.abs(experienceLevel - expectedLevel);
        
        if (levelDifference === 0) return 1.0;
        if (levelDifference === 1) return 0.7;
        if (levelDifference === 2) return 0.4;
        return 0.1;
    }
    
    function resolvePrerequisites(certId, certDatabase) {
        const result = {
            prerequisites: [],
            paths: []
        };
        
        const cert = certDatabase.getCertificationById(certId);
        if (!cert || !cert.prerequisites || cert.prerequisites.length === 0) {
            return result;
        }
        
        // Get direct prerequisites
        const directPrereqs = cert.prerequisites.map(prereqId => {
            const prereqCert = certDatabase.getCertificationById(prereqId);
            if (prereqCert) {
                result.paths.push({
                    from: prereqId,
                    to: certId,
                    type: 'prerequisite'
                });
                return prereqCert;
            }
            return null;
        }).filter(Boolean);
        
        result.prerequisites.push(...directPrereqs);
        
        // Recursively resolve prerequisites of prerequisites
        directPrereqs.forEach(prereq => {
            const nestedResult = resolvePrerequisites(prereq.id, certDatabase);
            result.prerequisites.push(...nestedResult.prerequisites);
            result.paths.push(...nestedResult.paths);
        });
        
        return result;
    }
    
    function calculateCompletionEstimates(roadmap, assessmentData) {
        if (!roadmap || !roadmap.certifications || roadmap.certifications.length === 0) {
            return {
                optimistic: null,
                realistic: null,
                conservative: null
            };
        }
        
        // Get user's available study hours per week
        const hoursPerWeek = assessmentData && assessmentData.preferences ? 
            assessmentData.preferences.availableHoursPerWeek : 10;
        
        // Calculate total preparation hours for all certifications
        let totalHours = 0;
        roadmap.certifications.forEach(cert => {
            const certData = window.CertificationRoadmap.CertificationDatabase.getCertificationById(cert.id);
            if (certData && certData.preparationTimeHours) {
                // Determine which preparation time to use based on experience
                const providerExperience = getProviderExperienceLevel(cert.id, assessmentData);
                
                let prepHours;
                if (providerExperience >= 0.75) {
                    prepHours = certData.preparationTimeHours.advanced;
                } else if (providerExperience >= 0.25) {
                    prepHours = certData.preparationTimeHours.intermediate;
                } else {
                    prepHours = certData.preparationTimeHours.beginner;
                }
                
                totalHours += prepHours;
            }
        });
        
        // Calculate weeks needed
        const optimisticWeeks = Math.ceil(totalHours * 0.8 / hoursPerWeek);
        const realisticWeeks = Math.ceil(totalHours / hoursPerWeek);
        const conservativeWeeks = Math.ceil(totalHours * 1.2 / hoursPerWeek);
        
        // Calculate completion dates
        const now = new Date();
        const optimisticDate = new Date(now);
        optimisticDate.setDate(now.getDate() + optimisticWeeks * 7);
        
        const realisticDate = new Date(now);
        realisticDate.setDate(now.getDate() + realisticWeeks * 7);
        
        const conservativeDate = new Date(now);
        conservativeDate.setDate(now.getDate() + conservativeWeeks * 7);
        
        return {
            optimistic: optimisticDate,
            realistic: realisticDate,
            conservative: conservativeDate
        };
    }
    
    // Public API
    return {
        /**
         * Generate a certification roadmap based on assessment and career goals
         * @param {Object} assessmentData - The user's assessment data
         * @param {Object} careerGoalsData - The user's career goals data
         * @returns {Object} The generated roadmap
         */
        generateRoadmap: function(assessmentData, careerGoalsData) {
            if (!assessmentData || !careerGoalsData) {
                console.error('Assessment data and career goals data are required');
                return null;
            }
            
            // Create roadmap object
            const roadmap = window.CertificationRoadmap.DataModels.createRoadmap();
            roadmap.name = `${careerGoalsData.primaryPath.charAt(0).toUpperCase() + careerGoalsData.primaryPath.slice(1)} Certification Roadmap`;
            roadmap.basedOn = {
                assessment: assessmentData.id,
                careerGoals: careerGoalsData.id
            };
            
            // Get certification database
            const certDatabase = window.CertificationRoadmap.CertificationDatabase;
            
            // Get all certifications
            const allCertifications = certDatabase.getAllCertifications();
            
            // Flatten certifications into a single array
            const flatCertifications = [];
            for (const provider in allCertifications) {
                for (const level in allCertifications[provider]) {
                    flatCertifications.push(...allCertifications[provider][level]);
                }
            }
            
            // Score certifications based on assessment and career goals
            const scoredCertifications = flatCertifications.map(cert => ({
                certification: cert,
                score: calculateCertificationScore(cert, assessmentData, careerGoalsData)
            }));
            
            // Sort by score (descending)
            scoredCertifications.sort((a, b) => b.score - a.score);
            
            // Select top certifications (up to 5)
            const topCertifications = scoredCertifications.slice(0, 5);
            
            // Add selected certifications to roadmap
            const certifications = [];
            const paths = [];
            
            // Process each top certification
            topCertifications.forEach((scoredCert, index) => {
                const cert = scoredCert.certification;
                
                // Add certification to roadmap
                certifications.push({
                    id: cert.id,
                    status: 'planned',
                    priority: index + 1,
                    startDate: null,
                    targetDate: null,
                    dependencies: [],
                    notes: ''
                });
                
                // Resolve prerequisites
                const prereqResult = resolvePrerequisites(cert.id, certDatabase);
                
                // Add prerequisites to roadmap if not already included
                prereqResult.prerequisites.forEach(prereq => {
                    if (!certifications.some(c => c.id === prereq.id)) {
                        certifications.push({
                            id: prereq.id,
                            status: 'planned',
                            priority: certifications.length + 1,
                            startDate: null,
                            targetDate: null,
                            dependencies: [],
                            notes: 'Prerequisite'
                        });
                    }
                });
                
                // Add paths
                paths.push(...prereqResult.paths);
                
                // Add related certification paths
                const relatedCerts = certDatabase.getRelatedCertifications(cert.id);
                relatedCerts.forEach(related => {
                    // Only add related certifications that are also in our top picks
                    if (topCertifications.some(tc => tc.certification.id === related.id)) {
                        paths.push({
                            from: cert.id,
                            to: related.id,
                            type: 'related'
                        });
                    }
                });
            });
            
            // Update roadmap with certifications and paths
            roadmap.certifications = certifications;
            roadmap.paths = paths;
            
            // Calculate estimated completion dates
            roadmap.estimatedCompletion = calculateCompletionEstimates(roadmap, assessmentData);
            
            // Store current roadmap
            currentRoadmap = roadmap;
            
            return roadmap;
        },
        
        /**
         * Get the current roadmap
         * @returns {Object|null} The current roadmap or null if not available
         */
        getCurrentRoadmap: function() {
            return currentRoadmap;
        },
        
        /**
         * Update an existing roadmap
         * @param {Object} roadmap - The roadmap to update
         * @returns {Object} The updated roadmap
         */
        updateRoadmap: function(roadmap) {
            if (!roadmap) return null;
            
            // Update timestamp
            roadmap.updatedAt = new Date();
            
            // Recalculate completion estimates if needed
            if (roadmap.certifications && roadmap.certifications.length > 0) {
                // Load assessment data
                const assessmentData = window.CertificationRoadmap.StorageService.loadAssessment();
                if (assessmentData) {
                    roadmap.estimatedCompletion = calculateCompletionEstimates(roadmap, assessmentData);
                }
            }
            
            // Store updated roadmap
            currentRoadmap = roadmap;
            
            return roadmap;
        },
        
        /**
         * Add a certification to the roadmap
         * @param {String} certId - The certification ID to add
         * @param {Object} roadmap - The roadmap to update (or current roadmap if not provided)
         * @returns {Object} The updated roadmap
         */
        addCertificationToRoadmap: function(certId, roadmap) {
            const targetRoadmap = roadmap || currentRoadmap;
            if (!targetRoadmap) return null;
            
            // Check if certification already exists in roadmap
            if (targetRoadmap.certifications.some(c => c.id === certId)) {
                return targetRoadmap;
            }
            
            // Get certification from database
            const cert = window.CertificationRoadmap.CertificationDatabase.getCertificationById(certId);
            if (!cert) return targetRoadmap;
            
            // Add certification to roadmap
            targetRoadmap.certifications.push({
                id: certId,
                status: 'planned',
                priority: targetRoadmap.certifications.length + 1,
                startDate: null,
                targetDate: null,
                dependencies: [],
                notes: ''
            });
            
            // Resolve prerequisites
            const prereqResult = resolvePrerequisites(certId, window.CertificationRoadmap.CertificationDatabase);
            
            // Add prerequisites to roadmap if not already included
            prereqResult.prerequisites.forEach(prereq => {
                if (!targetRoadmap.certifications.some(c => c.id === prereq.id)) {
                    targetRoadmap.certifications.push({
                        id: prereq.id,
                        status: 'planned',
                        priority: targetRoadmap.certifications.length + 1,
                        startDate: null,
                        targetDate: null,
                        dependencies: [],
                        notes: 'Prerequisite'
                    });
                }
            });
            
            // Add paths
            targetRoadmap.paths.push(...prereqResult.paths);
            
            // Update roadmap
            return this.updateRoadmap(targetRoadmap);
        },
        
        /**
         * Remove a certification from the roadmap
         * @param {String} certId - The certification ID to remove
         * @param {Object} roadmap - The roadmap to update (or current roadmap if not provided)
         * @returns {Object} The updated roadmap
         */
        removeCertificationFromRoadmap: function(certId, roadmap) {
            const targetRoadmap = roadmap || currentRoadmap;
            if (!targetRoadmap) return null;
            
            // Remove certification
            targetRoadmap.certifications = targetRoadmap.certifications.filter(c => c.id !== certId);
            
            // Remove paths involving this certification
            targetRoadmap.paths = targetRoadmap.paths.filter(p => p.from !== certId && p.to !== certId);
            
            // Update roadmap
            return this.updateRoadmap(targetRoadmap);
        },
        
        /**
         * Update certification status in the roadmap
         * @param {String} certId - The certification ID to update
         * @param {String} status - The new status ('planned', 'in-progress', 'completed', 'expired')
         * @param {Object} roadmap - The roadmap to update (or current roadmap if not provided)
         * @returns {Object} The updated roadmap
         */
        updateCertificationStatus: function(certId, status, roadmap) {
            const targetRoadmap = roadmap || currentRoadmap;
            if (!targetRoadmap) return null;
            
            // Find certification in roadmap
            const certIndex = targetRoadmap.certifications.findIndex(c => c.id === certId);
            if (certIndex === -1) return targetRoadmap;
            
            // Update status
            targetRoadmap.certifications[certIndex].status = status;
            
            // If completed, set completion date
            if (status === 'completed') {
                targetRoadmap.certifications[certIndex].completionDate = new Date();
            }
            
            // Update roadmap
            return this.updateRoadmap(targetRoadmap);
        },
        
        /**
         * Reorder certifications in the roadmap
         * @param {Array} orderedCertIds - Array of certification IDs in the desired order
         * @param {Object} roadmap - The roadmap to update (or current roadmap if not provided)
         * @returns {Object} The updated roadmap
         */
        reorderCertifications: function(orderedCertIds, roadmap) {
            const targetRoadmap = roadmap || currentRoadmap;
            if (!targetRoadmap) return null;
            
            // Validate that all IDs in the ordered list exist in the roadmap
            const validIds = orderedCertIds.filter(id => 
                targetRoadmap.certifications.some(c => c.id === id)
            );
            
            // If no valid IDs, return unchanged roadmap
            if (validIds.length === 0) return targetRoadmap;
            
            // Create a new array with the ordered certifications first
            const orderedCerts = [];
            
            // Add certifications in the specified order
            validIds.forEach((id, index) => {
                const cert = targetRoadmap.certifications.find(c => c.id === id);
                if (cert) {
                    // Update priority
                    cert.priority = index + 1;
                    orderedCerts.push(cert);
                }
            });
            
            // Add any remaining certifications that weren't in the ordered list
            targetRoadmap.certifications.forEach(cert => {
                if (!validIds.includes(cert.id)) {
                    cert.priority = orderedCerts.length + 1;
                    orderedCerts.push(cert);
                }
            });
            
            // Update roadmap with new order
            targetRoadmap.certifications = orderedCerts;
            
            // Update roadmap
            return this.updateRoadmap(targetRoadmap);
        }
    };
})();