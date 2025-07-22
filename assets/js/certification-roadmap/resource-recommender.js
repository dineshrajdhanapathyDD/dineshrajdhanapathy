/**
 * Cloud Certification Roadmap - Resource Recommender
 * 
 * This module provides recommendations for learning resources based on certifications and user preferences.
 */

// Resource Recommender Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.ResourceRecommender = (function() {
    // Private variables
    let resourceDatabase = {};
    let initialized = false;
    
    // Resource types
    const resourceTypes = {
        COURSE: 'course',
        DOCUMENTATION: 'documentation',
        PRACTICE_EXAM: 'practice-exam',
        BOOK: 'book',
        VIDEO: 'video',
        LAB: 'lab',
        TUTORIAL: 'tutorial',
        COMMUNITY: 'community'
    };
    
    // Resource formats
    const resourceFormats = {
        ONLINE: 'online',
        PDF: 'pdf',
        PHYSICAL: 'physical',
        INTERACTIVE: 'interactive',
        VIDEO: 'video',
        AUDIO: 'audio'
    };
    
    // Cost types
    const costTypes = {
        FREE: 'free',
        ONE_TIME: 'one-time',
        SUBSCRIPTION: 'subscription',
        MIXED: 'mixed'
    };
    
    // Private functions
    function loadResourceData() {
        // This would typically load from a JSON file or API
        // For now, we'll define a sample data structure inline
        
        resourceDatabase = {
            // AWS Resources
            'aws-cloud-practitioner': [
                {
                    id: 'aws-cp-official',
                    title: 'AWS Cloud Practitioner Essentials',
                    type: resourceTypes.COURSE,
                    provider: 'AWS Training',
                    format: resourceFormats.ONLINE,
                    url: 'https://aws.amazon.com/training/course-descriptions/cloud-practitioner-essentials/',
                    description: 'Official AWS training course covering the fundamentals of AWS Cloud.',
                    certifications: ['aws-cloud-practitioner'],
                    topics: ['Cloud Concepts', 'Security', 'Technology', 'Billing and Pricing'],
                    duration: 6,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.5,
                        count: 1250
                    },
                    tags: ['Official', 'Digital Training', 'Self-Paced'],
                    lastUpdated: new Date('2023-06-15')
                },
                {
                    id: 'aws-cp-whitepapers',
                    title: 'AWS Cloud Practitioner Essential Whitepapers',
                    type: resourceTypes.DOCUMENTATION,
                    provider: 'AWS',
                    format: resourceFormats.PDF,
                    url: 'https://aws.amazon.com/whitepapers/',
                    description: 'Collection of essential AWS whitepapers covering key concepts for the Cloud Practitioner exam.',
                    certifications: ['aws-cloud-practitioner'],
                    topics: ['Cloud Concepts', 'Security', 'Technology', 'Billing and Pricing'],
                    duration: 8,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.2,
                        count: 850
                    },
                    tags: ['Official', 'Documentation', 'Whitepapers'],
                    lastUpdated: new Date('2023-05-20')
                },
                {
                    id: 'aws-cp-practice-exam',
                    title: 'AWS Certified Cloud Practitioner Official Practice Exam',
                    type: resourceTypes.PRACTICE_EXAM,
                    provider: 'AWS Training',
                    format: resourceFormats.ONLINE,
                    url: 'https://aws.amazon.com/certification/certification-prep/',
                    description: 'Official AWS practice exam with questions similar to the actual certification exam.',
                    certifications: ['aws-cloud-practitioner'],
                    topics: ['Cloud Concepts', 'Security', 'Technology', 'Billing and Pricing'],
                    duration: 1.5,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.ONE_TIME,
                        amount: 20,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.7,
                        count: 980
                    },
                    tags: ['Official', 'Practice Exam', 'Assessment'],
                    lastUpdated: new Date('2023-07-10')
                },
                {
                    id: 'aws-cp-udemy',
                    title: 'Ultimate AWS Certified Cloud Practitioner',
                    type: resourceTypes.COURSE,
                    provider: 'Udemy',
                    format: resourceFormats.VIDEO,
                    url: 'https://www.udemy.com/course/aws-certified-cloud-practitioner-new/',
                    description: 'Comprehensive video course covering all aspects of the AWS Cloud Practitioner certification.',
                    certifications: ['aws-cloud-practitioner'],
                    topics: ['Cloud Concepts', 'Security', 'Technology', 'Billing and Pricing'],
                    duration: 15,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.ONE_TIME,
                        amount: 19.99,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.8,
                        count: 32500
                    },
                    tags: ['Video Course', 'Practice Tests', 'Bestseller'],
                    lastUpdated: new Date('2023-08-05')
                },
                {
                    id: 'aws-cp-freecodecamp',
                    title: 'AWS Certified Cloud Practitioner Training',
                    type: resourceTypes.VIDEO,
                    provider: 'freeCodeCamp',
                    format: resourceFormats.VIDEO,
                    url: 'https://www.youtube.com/watch?v=3hLmDS179YE',
                    description: 'Free comprehensive video course covering all AWS Cloud Practitioner exam topics.',
                    certifications: ['aws-cloud-practitioner'],
                    topics: ['Cloud Concepts', 'Security', 'Technology', 'Billing and Pricing'],
                    duration: 13,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.9,
                        count: 15800
                    },
                    tags: ['Free', 'Video Course', 'YouTube'],
                    lastUpdated: new Date('2023-04-18')
                }
            ],
            'aws-solutions-architect-associate': [
                {
                    id: 'aws-saa-official',
                    title: 'AWS Solutions Architect Associate Official Study Guide',
                    type: resourceTypes.BOOK,
                    provider: 'AWS / Wiley',
                    format: resourceFormats.PHYSICAL,
                    url: 'https://www.amazon.com/Certified-Solutions-Architect-Study-Guide/dp/1119713080/',
                    description: 'Official study guide for the AWS Solutions Architect Associate certification.',
                    certifications: ['aws-solutions-architect-associate'],
                    topics: ['Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Secure Applications and Architectures', 'Design Cost-Optimized Architectures'],
                    duration: 40,
                    difficulty: 'Intermediate',
                    cost: {
                        type: costTypes.ONE_TIME,
                        amount: 49.99,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.6,
                        count: 1850
                    },
                    tags: ['Official', 'Book', 'Study Guide'],
                    lastUpdated: new Date('2023-03-15')
                },
                {
                    id: 'aws-saa-acloudguru',
                    title: 'AWS Certified Solutions Architect Associate',
                    type: resourceTypes.COURSE,
                    provider: 'A Cloud Guru',
                    format: resourceFormats.VIDEO,
                    url: 'https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c03',
                    description: 'Comprehensive video course with hands-on labs for the AWS Solutions Architect Associate certification.',
                    certifications: ['aws-solutions-architect-associate'],
                    topics: ['Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Secure Applications and Architectures', 'Design Cost-Optimized Architectures'],
                    duration: 50,
                    difficulty: 'Intermediate',
                    cost: {
                        type: costTypes.SUBSCRIPTION,
                        amount: 39,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.8,
                        count: 25000
                    },
                    tags: ['Video Course', 'Hands-on Labs', 'Practice Exams'],
                    lastUpdated: new Date('2023-09-10')
                },
                {
                    id: 'aws-saa-cantrill',
                    title: 'AWS Certified Solutions Architect Associate - Adrian Cantrill',
                    type: resourceTypes.COURSE,
                    provider: 'Adrian Cantrill',
                    format: resourceFormats.VIDEO,
                    url: 'https://learn.cantrill.io/p/aws-certified-solutions-architect-associate-saa-c03',
                    description: 'In-depth video course with demos and hands-on exercises for the AWS Solutions Architect Associate certification.',
                    certifications: ['aws-solutions-architect-associate'],
                    topics: ['Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Secure Applications and Architectures', 'Design Cost-Optimized Architectures'],
                    duration: 65,
                    difficulty: 'Intermediate',
                    cost: {
                        type: costTypes.ONE_TIME,
                        amount: 49.99,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.9,
                        count: 8500
                    },
                    tags: ['Video Course', 'Demos', 'Diagrams'],
                    lastUpdated: new Date('2023-08-25')
                },
                {
                    id: 'aws-saa-whizlabs',
                    title: 'AWS Solutions Architect Associate Practice Tests',
                    type: resourceTypes.PRACTICE_EXAM,
                    provider: 'Whizlabs',
                    format: resourceFormats.ONLINE,
                    url: 'https://www.whizlabs.com/aws-solutions-architect-associate/',
                    description: 'Practice tests with detailed explanations for the AWS Solutions Architect Associate certification.',
                    certifications: ['aws-solutions-architect-associate'],
                    topics: ['Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Secure Applications and Architectures', 'Design Cost-Optimized Architectures'],
                    duration: 10,
                    difficulty: 'Intermediate',
                    cost: {
                        type: costTypes.ONE_TIME,
                        amount: 29.99,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.7,
                        count: 12000
                    },
                    tags: ['Practice Tests', 'Explanations', 'Exam Prep'],
                    lastUpdated: new Date('2023-07-20')
                },
                {
                    id: 'aws-saa-labs',
                    title: 'AWS Solutions Architect Hands-on Labs',
                    type: resourceTypes.LAB,
                    provider: 'AWS Skill Builder',
                    format: resourceFormats.INTERACTIVE,
                    url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/125/exam-prep-aws-certified-solutions-architect-associate-saa-c03',
                    description: 'Hands-on labs to practice real-world scenarios for the AWS Solutions Architect Associate certification.',
                    certifications: ['aws-solutions-architect-associate'],
                    topics: ['Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Secure Applications and Architectures', 'Design Cost-Optimized Architectures'],
                    duration: 20,
                    difficulty: 'Intermediate',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.6,
                        count: 9500
                    },
                    tags: ['Hands-on Labs', 'Interactive', 'Official'],
                    lastUpdated: new Date('2023-06-30')
                }
            ],
            // Azure Resources
            'azure-fundamentals': [
                {
                    id: 'azure-fundamentals-ms-learn',
                    title: 'Microsoft Azure Fundamentals Learning Path',
                    type: resourceTypes.COURSE,
                    provider: 'Microsoft Learn',
                    format: resourceFormats.ONLINE,
                    url: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/',
                    description: 'Official Microsoft learning path for Azure Fundamentals certification.',
                    certifications: ['azure-fundamentals'],
                    topics: ['Cloud Concepts', 'Azure Core Services', 'Security, Privacy, Compliance, and Trust', 'Azure Pricing and Support'],
                    duration: 10,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.7,
                        count: 18500
                    },
                    tags: ['Official', 'Self-Paced', 'Interactive'],
                    lastUpdated: new Date('2023-08-15')
                },
                {
                    id: 'azure-fundamentals-docs',
                    title: 'Azure Documentation',
                    type: resourceTypes.DOCUMENTATION,
                    provider: 'Microsoft',
                    format: resourceFormats.ONLINE,
                    url: 'https://learn.microsoft.com/en-us/azure/',
                    description: 'Official Azure documentation covering all services and concepts.',
                    certifications: ['azure-fundamentals', 'azure-administrator', 'azure-developer', 'azure-solutions-architect'],
                    topics: ['Cloud Concepts', 'Azure Core Services', 'Security, Privacy, Compliance, and Trust', 'Azure Pricing and Support'],
                    duration: 15,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.5,
                        count: 12000
                    },
                    tags: ['Official', 'Documentation', 'Reference'],
                    lastUpdated: new Date('2023-09-20')
                },
                {
                    id: 'azure-fundamentals-practice',
                    title: 'Azure Fundamentals Practice Assessment',
                    type: resourceTypes.PRACTICE_EXAM,
                    provider: 'Microsoft Learn',
                    format: resourceFormats.ONLINE,
                    url: 'https://learn.microsoft.com/en-us/certifications/exams/az-900/practice/assessment?assessment-type=practice&assessmentId=23',
                    description: 'Official practice assessment for the Azure Fundamentals certification.',
                    certifications: ['azure-fundamentals'],
                    topics: ['Cloud Concepts', 'Azure Core Services', 'Security, Privacy, Compliance, and Trust', 'Azure Pricing and Support'],
                    duration: 1.5,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.6,
                        count: 9800
                    },
                    tags: ['Official', 'Practice Exam', 'Assessment'],
                    lastUpdated: new Date('2023-07-05')
                },
                {
                    id: 'azure-fundamentals-youtube',
                    title: 'Azure Fundamentals Certification Course (AZ-900)',
                    type: resourceTypes.VIDEO,
                    provider: 'freeCodeCamp',
                    format: resourceFormats.VIDEO,
                    url: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA',
                    description: 'Free comprehensive video course covering all Azure Fundamentals exam topics.',
                    certifications: ['azure-fundamentals'],
                    topics: ['Cloud Concepts', 'Azure Core Services', 'Security, Privacy, Compliance, and Trust', 'Azure Pricing and Support'],
                    duration: 10,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.8,
                        count: 14500
                    },
                    tags: ['Free', 'Video Course', 'YouTube'],
                    lastUpdated: new Date('2023-05-12')
                },
                {
                    id: 'azure-fundamentals-sandbox',
                    title: 'Azure Fundamentals Interactive Labs',
                    type: resourceTypes.LAB,
                    provider: 'Microsoft Learn',
                    format: resourceFormats.INTERACTIVE,
                    url: 'https://learn.microsoft.com/en-us/training/modules/create-an-azure-account/',
                    description: 'Hands-on labs with free Azure sandbox environment for practicing Azure Fundamentals concepts.',
                    certifications: ['azure-fundamentals'],
                    topics: ['Cloud Concepts', 'Azure Core Services', 'Security, Privacy, Compliance, and Trust', 'Azure Pricing and Support'],
                    duration: 8,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.9,
                        count: 11200
                    },
                    tags: ['Free', 'Hands-on Labs', 'Interactive'],
                    lastUpdated: new Date('2023-08-08')
                }
            ],
            // GCP Resources
            'gcp-cloud-digital-leader': [
                {
                    id: 'gcp-cdl-official',
                    title: 'Cloud Digital Leader Learning Path',
                    type: resourceTypes.COURSE,
                    provider: 'Google Cloud',
                    format: resourceFormats.ONLINE,
                    url: 'https://cloud.google.com/training/business#cloud-digital-leader-path',
                    description: 'Official Google Cloud learning path for the Cloud Digital Leader certification.',
                    certifications: ['gcp-cloud-digital-leader'],
                    topics: ['Digital Transformation with Google Cloud', 'Innovative Google Cloud Solutions', 'Google Cloud Security and Operations', 'Google Cloud Value and Adoption'],
                    duration: 12,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.6,
                        count: 7500
                    },
                    tags: ['Official', 'Self-Paced', 'Digital Training'],
                    lastUpdated: new Date('2023-07-25')
                },
                {
                    id: 'gcp-cdl-coursera',
                    title: 'Google Cloud Digital Leader Training',
                    type: resourceTypes.COURSE,
                    provider: 'Coursera',
                    format: resourceFormats.VIDEO,
                    url: 'https://www.coursera.org/professional-certificates/google-cloud-digital-leader-training',
                    description: 'Official Google Cloud course on Coursera for the Cloud Digital Leader certification.',
                    certifications: ['gcp-cloud-digital-leader'],
                    topics: ['Digital Transformation with Google Cloud', 'Innovative Google Cloud Solutions', 'Google Cloud Security and Operations', 'Google Cloud Value and Adoption'],
                    duration: 20,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.SUBSCRIPTION,
                        amount: 39,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.7,
                        count: 9200
                    },
                    tags: ['Official', 'Video Course', 'Certificate'],
                    lastUpdated: new Date('2023-08-30')
                },
                {
                    id: 'gcp-cdl-practice',
                    title: 'Cloud Digital Leader Practice Exam',
                    type: resourceTypes.PRACTICE_EXAM,
                    provider: 'Google Cloud',
                    format: resourceFormats.ONLINE,
                    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfsSfkh9PE-HjdRRzJ24wPSjZrXF3gLxmncAYx31gyz2rLbtw/viewform',
                    description: 'Official practice exam for the Google Cloud Digital Leader certification.',
                    certifications: ['gcp-cloud-digital-leader'],
                    topics: ['Digital Transformation with Google Cloud', 'Innovative Google Cloud Solutions', 'Google Cloud Security and Operations', 'Google Cloud Value and Adoption'],
                    duration: 1.5,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.5,
                        count: 5800
                    },
                    tags: ['Official', 'Practice Exam', 'Assessment'],
                    lastUpdated: new Date('2023-06-18')
                },
                {
                    id: 'gcp-cdl-qwiklabs',
                    title: 'Google Cloud Skills Boost',
                    type: resourceTypes.LAB,
                    provider: 'Google Cloud',
                    format: resourceFormats.INTERACTIVE,
                    url: 'https://www.cloudskillsboost.google/paths',
                    description: 'Hands-on labs and interactive tutorials for Google Cloud services and concepts.',
                    certifications: ['gcp-cloud-digital-leader', 'gcp-cloud-engineer', 'gcp-cloud-architect'],
                    topics: ['Digital Transformation with Google Cloud', 'Innovative Google Cloud Solutions', 'Google Cloud Security and Operations', 'Google Cloud Value and Adoption'],
                    duration: 15,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.MIXED,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.8,
                        count: 12500
                    },
                    tags: ['Hands-on Labs', 'Interactive', 'Official'],
                    lastUpdated: new Date('2023-09-05')
                },
                {
                    id: 'gcp-cdl-youtube',
                    title: 'Google Cloud Digital Leader Certification Course',
                    type: resourceTypes.VIDEO,
                    provider: 'freeCodeCamp',
                    format: resourceFormats.VIDEO,
                    url: 'https://www.youtube.com/watch?v=UGRDM86MBIQ',
                    description: 'Free comprehensive video course covering all Google Cloud Digital Leader exam topics.',
                    certifications: ['gcp-cloud-digital-leader'],
                    topics: ['Digital Transformation with Google Cloud', 'Innovative Google Cloud Solutions', 'Google Cloud Security and Operations', 'Google Cloud Value and Adoption'],
                    duration: 11,
                    difficulty: 'Beginner',
                    cost: {
                        type: costTypes.FREE,
                        amount: 0,
                        currency: 'USD'
                    },
                    ratings: {
                        average: 4.7,
                        count: 8900
                    },
                    tags: ['Free', 'Video Course', 'YouTube'],
                    lastUpdated: new Date('2023-04-22')
                }
            ]
        };
        
        initialized = true;
    }
    
    function matchLearningStyle(resource, learningStyle) {
        if (!learningStyle) return 1; // No preference specified
        
        const styleMap = {
            'visual': ['video', 'online'],
            'reading': ['pdf', 'physical', 'documentation', 'book'],
            'interactive': ['interactive', 'lab', 'tutorial'],
            'mixed': [] // All formats are good
        };
        
        // If learning style is mixed, all resources match well
        if (learningStyle === 'mixed') return 1;
        
        // Check if resource format or type matches the preferred learning style
        const preferredFormats = styleMap[learningStyle] || [];
        
        if (preferredFormats.includes(resource.format) || preferredFormats.includes(resource.type)) {
            return 1; // Perfect match
        }
        
        return 0.5; // Partial match
    }
    
    function matchBudget(resource, budget) {
        if (!budget) return 1; // No budget constraint specified
        
        const budgetMap = {
            'free': [costTypes.FREE],
            'low': [costTypes.FREE, costTypes.ONE_TIME],
            'medium': [costTypes.FREE, costTypes.ONE_TIME, costTypes.SUBSCRIPTION],
            'high': [costTypes.FREE, costTypes.ONE_TIME, costTypes.SUBSCRIPTION, costTypes.MIXED]
        };
        
        const allowedCostTypes = budgetMap[budget] || [];
        
        // Free resources always match any budget
        if (resource.cost.type === costTypes.FREE) return 1;
        
        // Check if resource cost type is allowed by budget
        if (allowedCostTypes.includes(resource.cost.type)) {
            // For one-time purchases, check the amount against budget limits
            if (resource.cost.type === costTypes.ONE_TIME) {
                if (budget === 'low' && resource.cost.amount <= 50) return 1;
                if (budget === 'medium' && resource.cost.amount <= 200) return 1;
                if (budget === 'high') return 1;
                
                return 0.5; // Partial match (over budget but still one-time)
            }
            
            return 1; // Full match for subscription or mixed within budget category
        }
        
        return 0; // No match
    }
    
    function calculateResourceScore(resource, certification, userPreferences) {
        // Base score starts at 0
        let score = 0;
        
        // 1. Certification match (0-40 points)
        if (resource.certifications.includes(certification.id)) {
            score += 40;
        } else {
            // Check if resource is for a related certification
            const isRelated = resource.certifications.some(certId => 
                certification.relatedCertifications && certification.relatedCertifications.includes(certId)
            );
            
            if (isRelated) {
                score += 20; // Partial match for related certification
            } else {
                return 0; // No match, don't recommend
            }
        }
        
        // 2. Topic coverage (0-20 points)
        const topicMatchScore = calculateTopicMatchScore(resource, certification);
        score += topicMatchScore * 20;
        
        // 3. Learning style match (0-15 points)
        const learningStyleScore = matchLearningStyle(resource, userPreferences.learningStyle);
        score += learningStyleScore * 15;
        
        // 4. Budget match (0-15 points)
        const budgetScore = matchBudget(resource, userPreferences.budgetConstraints);
        score += budgetScore * 15;
        
        // 5. Ratings and popularity (0-10 points)
        const ratingScore = (resource.ratings.average / 5) * (Math.min(resource.ratings.count, 10000) / 10000);
        score += ratingScore * 10;
        
        return score;
    }
    
    function calculateTopicMatchScore(resource, certification) {
        if (!certification.topics || certification.topics.length === 0) return 0.5;
        
        // Extract topic names from certification
        const certTopicNames = certification.topics.map(topic => topic.name.toLowerCase());
        
        // Count how many certification topics are covered by the resource
        let matchCount = 0;
        
        resource.topics.forEach(resourceTopic => {
            const resourceTopicLower = resourceTopic.toLowerCase();
            
            // Check if resource topic matches any certification topic
            const matches = certTopicNames.some(certTopic => 
                resourceTopicLower.includes(certTopic) || certTopic.includes(resourceTopicLower)
            );
            
            if (matches) {
                matchCount++;
            }
        });
        
        // Calculate match percentage
        return matchCount / certTopicNames.length;
    }
    
    // Public API
    return {
        /**
         * Initialize the resource recommender
         * @returns {Promise} A promise that resolves when initialization is complete
         */
        initRecommender: function() {
            return new Promise((resolve, reject) => {
                try {
                    loadResourceData();
                    resolve();
                } catch (error) {
                    console.error('Error initializing resource recommender:', error);
                    reject(error);
                }
            });
        },
        
        /**
         * Recommend learning resources for a certification
         * @param {String} certificationId - The ID of the certification
         * @param {Object} userPreferences - User preferences for learning resources
         * @returns {Array} Array of recommended resources
         */
        recommendResources: function(certificationId, userPreferences) {
            if (!initialized) {
                loadResourceData();
            }
            
            // Get certification from database
            const certDatabase = window.CertificationRoadmap.CertificationDatabase;
            const certification = certDatabase.getCertificationById(certificationId);
            
            if (!certification) {
                console.error('Certification not found:', certificationId);
                return [];
            }
            
            // Default user preferences
            const preferences = {
                learningStyle: 'mixed',
                budgetConstraints: 'medium',
                ...userPreferences
            };
            
            // Get resources for this certification
            let resources = resourceDatabase[certificationId] || [];
            
            // If no direct resources found, look for resources for related certifications
            if (resources.length === 0 && certification.relatedCertifications) {
                certification.relatedCertifications.forEach(relatedId => {
                    const relatedResources = resourceDatabase[relatedId] || [];
                    resources = [...resources, ...relatedResources];
                });
            }
            
            // Score and sort resources
            const scoredResources = resources.map(resource => ({
                resource,
                score: calculateResourceScore(resource, certification, preferences)
            }));
            
            // Sort by score (descending)
            scoredResources.sort((a, b) => b.score - a.score);
            
            // Return resources with scores above threshold
            return scoredResources
                .filter(item => item.score > 20) // Minimum score threshold
                .map(item => item.resource);
        },
        
        /**
         * Filter resources based on criteria
         * @param {Array} resources - Array of resources to filter
         * @param {Object} criteria - Filter criteria
         * @returns {Array} Filtered resources
         */
        filterResources: function(resources, criteria) {
            if (!resources || !Array.isArray(resources)) return [];
            
            return resources.filter(resource => {
                // Filter by type
                if (criteria.type && resource.type !== criteria.type) {
                    return false;
                }
                
                // Filter by format
                if (criteria.format && resource.format !== criteria.format) {
                    return false;
                }
                
                // Filter by provider
                if (criteria.provider && resource.provider !== criteria.provider) {
                    return false;
                }
                
                // Filter by cost type
                if (criteria.costType && resource.cost.type !== criteria.costType) {
                    return false;
                }
                
                // Filter by maximum cost
                if (criteria.maxCost !== undefined && 
                    resource.cost.type !== costTypes.FREE && 
                    resource.cost.amount > criteria.maxCost) {
                    return false;
                }
                
                // Filter by difficulty
                if (criteria.difficulty && resource.difficulty !== criteria.difficulty) {
                    return false;
                }
                
                // Filter by maximum duration
                if (criteria.maxDuration !== undefined && resource.duration > criteria.maxDuration) {
                    return false;
                }
                
                // Filter by minimum rating
                if (criteria.minRating !== undefined && resource.ratings.average < criteria.minRating) {
                    return false;
                }
                
                // Filter by tags
                if (criteria.tags && Array.isArray(criteria.tags) && criteria.tags.length > 0) {
                    const hasAllTags = criteria.tags.every(tag => resource.tags.includes(tag));
                    if (!hasAllTags) {
                        return false;
                    }
                }
                
                return true;
            });
        },
        
        /**
         * Get all resources for a certification
         * @param {String} certificationId - The ID of the certification
         * @returns {Array} Array of resources
         */
        getResourcesForCertification: function(certificationId) {
            if (!initialized) {
                loadResourceData();
            }
            
            return resourceDatabase[certificationId] || [];
        },
        
        /**
         * Get resource by ID
         * @param {String} resourceId - The ID of the resource
         * @returns {Object|null} The resource object or null if not found
         */
        getResourceById: function(resourceId) {
            if (!initialized) {
                loadResourceData();
            }
            
            // Search through all certifications
            for (const certId in resourceDatabase) {
                const resources = resourceDatabase[certId];
                const resource = resources.find(r => r.id === resourceId);
                if (resource) {
                    return resource;
                }
            }
            
            return null;
        },
        
        /**
         * Get resource types
         * @returns {Object} Resource types
         */
        getResourceTypes: function() {
            return { ...resourceTypes };
        },
        
        /**
         * Get resource formats
         * @returns {Object} Resource formats
         */
        getResourceFormats: function() {
            return { ...resourceFormats };
        },
        
        /**
         * Get cost types
         * @returns {Object} Cost types
         */
        getCostTypes: function() {
            return { ...costTypes };
        }
    };
})();