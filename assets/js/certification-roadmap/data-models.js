/**
 * Cloud Certification Roadmap - Data Models
 * 
 * This module defines the core data models and validation functions for the Cloud Certification Roadmap feature.
 */

// Data Models Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.DataModels = (function() {
    // Private validation functions
    function isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }
    
    function isValidString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }
    
    function isValidNumber(num) {
        return typeof num === 'number' && !isNaN(num);
    }
    
    function isValidArray(arr) {
        return Array.isArray(arr);
    }
    
    function isValidObject(obj) {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    }
    
    // Public API
    return {
        /**
         * Create a new assessment data object
         * @returns {Object} Empty assessment data object with default values
         */
        createAssessment: function() {
            return {
                id: 'assessment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                cloudProviders: [],
                domainSkills: [],
                certifications: [],
                preferences: {
                    learningStyle: 'mixed',
                    availableHoursPerWeek: 10,
                    budgetConstraints: 'medium',
                    timeframe: '3-6'
                }
            };
        },
        
        /**
         * Create a new career goals data object
         * @returns {Object} Empty career goals data object with default values
         */
        createCareerGoals: function() {
            return {
                id: 'career-goals-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                primaryPath: '',
                secondaryPaths: [],
                targetRoles: [],
                priorities: {
                    salary: 3,
                    workLifeBalance: 3,
                    jobSecurity: 3,
                    remoteWork: 3,
                    technicalDepth: 3,
                    leadershipOpportunities: 3
                },
                industryFocus: [],
                timelineGoals: []
            };
        },
        
        /**
         * Create a new certification roadmap data object
         * @returns {Object} Empty roadmap data object with default values
         */
        createRoadmap: function() {
            return {
                id: 'roadmap-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                name: 'My Certification Roadmap',
                createdAt: new Date(),
                updatedAt: new Date(),
                basedOn: {
                    assessment: '',
                    careerGoals: ''
                },
                certifications: [],
                paths: [],
                estimatedCompletion: {
                    optimistic: null,
                    realistic: null,
                    conservative: null
                }
            };
        },
        
        /**
         * Create a new study plan data object
         * @returns {Object} Empty study plan data object with default values
         */
        createStudyPlan: function() {
            return {
                id: 'study-plan-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                name: 'My Study Plan',
                certifications: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                weeklyHours: 10,
                startDate: new Date(),
                targetEndDate: null,
                currentWeek: 1,
                topics: [],
                milestones: [],
                progress: {
                    completedTopics: 0,
                    totalTopics: 0,
                    completedHours: 0,
                    totalHours: 0,
                    percentage: 0
                }
            };
        },
        
        /**
         * Validate assessment data
         * @param {Object} data - The assessment data to validate
         * @returns {Object} Validation result with isValid flag and errors array
         */
        validateAssessment: function(data) {
            const errors = [];
            
            // Check required fields
            if (!data) {
                return { isValid: false, errors: ['Assessment data is missing'] };
            }
            
            if (!isValidString(data.id)) {
                errors.push('Assessment ID is missing or invalid');
            }
            
            if (!isValidDate(data.timestamp)) {
                errors.push('Assessment timestamp is missing or invalid');
            }
            
            if (!isValidArray(data.cloudProviders)) {
                errors.push('Cloud providers must be an array');
            } else {
                // Check cloud provider objects
                data.cloudProviders.forEach((provider, index) => {
                    if (!isValidObject(provider)) {
                        errors.push(`Cloud provider at index ${index} is not a valid object`);
                    } else {
                        if (!isValidString(provider.name)) {
                            errors.push(`Cloud provider at index ${index} is missing a name`);
                        }
                        if (!isValidNumber(provider.experienceLevel)) {
                            errors.push(`Cloud provider at index ${index} is missing a valid experience level`);
                        }
                    }
                });
            }
            
            if (!isValidArray(data.domainSkills)) {
                errors.push('Domain skills must be an array');
            } else {
                // Check domain skill objects
                data.domainSkills.forEach((domain, index) => {
                    if (!isValidObject(domain)) {
                        errors.push(`Domain at index ${index} is not a valid object`);
                    } else {
                        if (!isValidString(domain.domain)) {
                            errors.push(`Domain at index ${index} is missing a name`);
                        }
                        if (!isValidArray(domain.skills)) {
                            errors.push(`Domain at index ${index} has invalid skills array`);
                        } else {
                            domain.skills.forEach((skill, skillIndex) => {
                                if (!isValidObject(skill)) {
                                    errors.push(`Skill at index ${index}.${skillIndex} is not a valid object`);
                                } else {
                                    if (!isValidString(skill.name)) {
                                        errors.push(`Skill at index ${index}.${skillIndex} is missing a name`);
                                    }
                                    if (!isValidNumber(skill.level)) {
                                        errors.push(`Skill at index ${index}.${skillIndex} is missing a valid level`);
                                    }
                                }
                            });
                        }
                    }
                });
            }
            
            if (!isValidObject(data.preferences)) {
                errors.push('Preferences must be an object');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        
        /**
         * Validate career goals data
         * @param {Object} data - The career goals data to validate
         * @returns {Object} Validation result with isValid flag and errors array
         */
        validateCareerGoals: function(data) {
            const errors = [];
            
            // Check required fields
            if (!data) {
                return { isValid: false, errors: ['Career goals data is missing'] };
            }
            
            if (!isValidString(data.id)) {
                errors.push('Career goals ID is missing or invalid');
            }
            
            if (!isValidDate(data.timestamp)) {
                errors.push('Career goals timestamp is missing or invalid');
            }
            
            if (!isValidString(data.primaryPath)) {
                errors.push('Primary career path is required');
            }
            
            if (!isValidArray(data.secondaryPaths)) {
                errors.push('Secondary paths must be an array');
            }
            
            if (!isValidArray(data.targetRoles)) {
                errors.push('Target roles must be an array');
            }
            
            if (!isValidObject(data.priorities)) {
                errors.push('Priorities must be an object');
            } else {
                // Check priority values
                const priorityFields = ['salary', 'workLifeBalance', 'jobSecurity', 'remoteWork', 'technicalDepth', 'leadershipOpportunities'];
                priorityFields.forEach(field => {
                    if (!isValidNumber(data.priorities[field])) {
                        errors.push(`Priority ${field} must be a valid number`);
                    }
                });
            }
            
            if (!isValidArray(data.industryFocus)) {
                errors.push('Industry focus must be an array');
            }
            
            if (!isValidArray(data.timelineGoals)) {
                errors.push('Timeline goals must be an array');
            } else {
                // Check timeline goal objects
                data.timelineGoals.forEach((goal, index) => {
                    if (!isValidObject(goal)) {
                        errors.push(`Timeline goal at index ${index} is not a valid object`);
                    } else {
                        if (!isValidString(goal.milestone)) {
                            errors.push(`Timeline goal at index ${index} is missing a milestone`);
                        }
                        if (!isValidDate(goal.targetDate)) {
                            errors.push(`Timeline goal at index ${index} has an invalid target date`);
                        }
                    }
                });
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        
        /**
         * Validate roadmap data
         * @param {Object} data - The roadmap data to validate
         * @returns {Object} Validation result with isValid flag and errors array
         */
        validateRoadmap: function(data) {
            const errors = [];
            
            // Check required fields
            if (!data) {
                return { isValid: false, errors: ['Roadmap data is missing'] };
            }
            
            if (!isValidString(data.id)) {
                errors.push('Roadmap ID is missing or invalid');
            }
            
            if (!isValidString(data.name)) {
                errors.push('Roadmap name is missing or invalid');
            }
            
            if (!isValidDate(data.createdAt)) {
                errors.push('Roadmap creation date is missing or invalid');
            }
            
            if (!isValidDate(data.updatedAt)) {
                errors.push('Roadmap update date is missing or invalid');
            }
            
            if (!isValidObject(data.basedOn)) {
                errors.push('Roadmap basedOn must be an object');
            }
            
            if (!isValidArray(data.certifications)) {
                errors.push('Certifications must be an array');
            } else {
                // Check certification objects
                data.certifications.forEach((cert, index) => {
                    if (!isValidObject(cert)) {
                        errors.push(`Certification at index ${index} is not a valid object`);
                    } else {
                        if (!isValidString(cert.id)) {
                            errors.push(`Certification at index ${index} is missing an ID`);
                        }
                        if (!isValidString(cert.status)) {
                            errors.push(`Certification at index ${index} is missing a status`);
                        }
                    }
                });
            }
            
            if (!isValidArray(data.paths)) {
                errors.push('Paths must be an array');
            } else {
                // Check path objects
                data.paths.forEach((path, index) => {
                    if (!isValidObject(path)) {
                        errors.push(`Path at index ${index} is not a valid object`);
                    } else {
                        if (!isValidString(path.from)) {
                            errors.push(`Path at index ${index} is missing a from value`);
                        }
                        if (!isValidString(path.to)) {
                            errors.push(`Path at index ${index} is missing a to value`);
                        }
                        if (!isValidString(path.type)) {
                            errors.push(`Path at index ${index} is missing a type value`);
                        }
                    }
                });
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        
        /**
         * Validate study plan data
         * @param {Object} data - The study plan data to validate
         * @returns {Object} Validation result with isValid flag and errors array
         */
        validateStudyPlan: function(data) {
            const errors = [];
            
            // Check required fields
            if (!data) {
                return { isValid: false, errors: ['Study plan data is missing'] };
            }
            
            if (!isValidString(data.id)) {
                errors.push('Study plan ID is missing or invalid');
            }
            
            if (!isValidString(data.name)) {
                errors.push('Study plan name is missing or invalid');
            }
            
            if (!isValidArray(data.certifications)) {
                errors.push('Certifications must be an array');
            }
            
            if (!isValidDate(data.createdAt)) {
                errors.push('Study plan creation date is missing or invalid');
            }
            
            if (!isValidDate(data.updatedAt)) {
                errors.push('Study plan update date is missing or invalid');
            }
            
            if (!isValidNumber(data.weeklyHours)) {
                errors.push('Weekly hours must be a valid number');
            }
            
            if (!isValidDate(data.startDate)) {
                errors.push('Start date is missing or invalid');
            }
            
            if (data.targetEndDate && !isValidDate(data.targetEndDate)) {
                errors.push('Target end date is invalid');
            }
            
            if (!isValidNumber(data.currentWeek)) {
                errors.push('Current week must be a valid number');
            }
            
            if (!isValidArray(data.topics)) {
                errors.push('Topics must be an array');
            } else {
                // Check topic objects
                data.topics.forEach((topic, index) => {
                    if (!isValidObject(topic)) {
                        errors.push(`Topic at index ${index} is not a valid object`);
                    } else {
                        if (!isValidString(topic.id)) {
                            errors.push(`Topic at index ${index} is missing an ID`);
                        }
                        if (!isValidString(topic.name)) {
                            errors.push(`Topic at index ${index} is missing a name`);
                        }
                        if (!isValidNumber(topic.duration)) {
                            errors.push(`Topic at index ${index} is missing a valid duration`);
                        }
                    }
                });
            }
            
            if (!isValidArray(data.milestones)) {
                errors.push('Milestones must be an array');
            } else {
                // Check milestone objects
                data.milestones.forEach((milestone, index) => {
                    if (!isValidObject(milestone)) {
                        errors.push(`Milestone at index ${index} is not a valid object`);
                    } else {
                        if (!isValidString(milestone.id)) {
                            errors.push(`Milestone at index ${index} is missing an ID`);
                        }
                        if (!isValidString(milestone.name)) {
                            errors.push(`Milestone at index ${index} is missing a name`);
                        }
                        if (!isValidNumber(milestone.week)) {
                            errors.push(`Milestone at index ${index} is missing a valid week number`);
                        }
                    }
                });
            }
            
            if (!isValidObject(data.progress)) {
                errors.push('Progress must be an object');
            } else {
                // Check progress values
                if (!isValidNumber(data.progress.completedTopics)) {
                    errors.push('Completed topics must be a valid number');
                }
                if (!isValidNumber(data.progress.totalTopics)) {
                    errors.push('Total topics must be a valid number');
                }
                if (!isValidNumber(data.progress.completedHours)) {
                    errors.push('Completed hours must be a valid number');
                }
                if (!isValidNumber(data.progress.totalHours)) {
                    errors.push('Total hours must be a valid number');
                }
                if (!isValidNumber(data.progress.percentage)) {
                    errors.push('Progress percentage must be a valid number');
                }
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        
        /**
         * Convert date strings to Date objects in an object
         * @param {Object} obj - The object to process
         * @returns {Object} The processed object with Date objects
         */
        convertDates: function(obj) {
            if (!obj || typeof obj !== 'object') return obj;
            
            const result = Array.isArray(obj) ? [...obj] : {...obj};
            
            for (const key in result) {
                if (result.hasOwnProperty(key)) {
                    const value = result[key];
                    
                    // Check if value is a date string
                    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                            result[key] = date;
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        // Recursively process nested objects and arrays
                        result[key] = this.convertDates(value);
                    }
                }
            }
            
            return result;
        },
        
        /**
         * Generate a unique ID with a prefix
         * @param {String} prefix - The prefix for the ID
         * @returns {String} A unique ID
         */
        generateId: function(prefix = 'item') {
            return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
    };
})();