/**
 * Job Matcher Module
 * 
 * This module matches resume content against potential job roles and provides
 * job match suggestions based on skills and experience.
 */

window.JobMatcherModule = (function() {
    'use strict';

    // Sample job roles database
    // In a real implementation, this would be a more comprehensive database or API
    const jobRolesDatabase = [
        {
            jobTitle: 'Frontend Developer',
            industry: 'Technology',
            experienceLevel: 'Mid-Senior',
            requiredSkills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript', 'Responsive Design'],
            preferredSkills: ['Vue.js', 'Angular', 'Webpack', 'Jest', 'UI/UX Design'],
            description: 'Develop and maintain user interfaces for web applications using modern JavaScript frameworks.'
        },
        {
            jobTitle: 'Backend Developer',
            industry: 'Technology',
            experienceLevel: 'Mid-Level',
            requiredSkills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'API Design', 'Authentication'],
            preferredSkills: ['GraphQL', 'Redis', 'Docker', 'Microservices', 'AWS'],
            description: 'Build server-side applications, APIs, and database integrations using modern backend technologies.'
        },
        {
            jobTitle: 'Full Stack Developer',
            industry: 'Technology',
            experienceLevel: 'Mid-Level',
            requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'API Design'],
            preferredSkills: ['TypeScript', 'MongoDB', 'Docker', 'AWS', 'Testing'],
            description: 'Build end-to-end web applications using JavaScript technologies for both frontend and backend.'
        },
        {
            jobTitle: 'DevOps Engineer',
            industry: 'Technology',
            experienceLevel: 'Mid-Senior',
            requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Scripting'],
            preferredSkills: ['Terraform', 'Ansible', 'Monitoring', 'Security', 'Networking'],
            description: 'Implement and maintain infrastructure automation, deployment pipelines, and cloud resources.'
        },
        {
            jobTitle: 'Data Scientist',
            industry: 'Data & Analytics',
            experienceLevel: 'Mid-Level',
            requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'Statistics', 'Data Visualization'],
            preferredSkills: ['R', 'TensorFlow', 'PyTorch', 'Big Data', 'NLP'],
            description: 'Analyze complex data sets to identify patterns and insights using statistical methods and machine learning.'
        },
        {
            jobTitle: 'UI/UX Designer',
            industry: 'Design & Technology',
            experienceLevel: 'Mid-Level',
            requiredSkills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Figma', 'User Testing'],
            preferredSkills: ['HTML', 'CSS', 'Design Systems', 'Accessibility', 'Animation'],
            description: 'Create visually appealing and user-friendly interfaces with a focus on user experience and design principles.'
        },
        {
            jobTitle: 'Product Manager',
            industry: 'Product Management',
            experienceLevel: 'Mid-Senior',
            requiredSkills: ['Product Strategy', 'Roadmapping', 'User Stories', 'Agile', 'Stakeholder Management', 'Market Research'],
            preferredSkills: ['Technical Background', 'Data Analysis', 'UX Design', 'A/B Testing', 'Product Analytics'],
            description: 'Lead product development from conception to launch, balancing business goals with user needs and technical constraints.'
        },
        {
            jobTitle: 'QA Engineer',
            industry: 'Technology',
            experienceLevel: 'Mid-Level',
            requiredSkills: ['Test Planning', 'Manual Testing', 'Automated Testing', 'Bug Tracking', 'Test Cases', 'Quality Assurance'],
            preferredSkills: ['Selenium', 'Cypress', 'API Testing', 'Performance Testing', 'CI/CD'],
            description: 'Ensure software quality through comprehensive testing strategies, including manual and automated testing.'
        },
        {
            jobTitle: 'Project Manager',
            industry: 'Various',
            experienceLevel: 'Mid-Senior',
            requiredSkills: ['Project Planning', 'Team Management', 'Budgeting', 'Risk Management', 'Stakeholder Communication', 'Agile'],
            preferredSkills: ['Technical Background', 'Scrum Master', 'JIRA', 'Resource Allocation', 'Reporting'],
            description: 'Plan, execute, and close projects on time and within budget while managing resources and stakeholders.'
        },
        {
            jobTitle: 'Technical Writer',
            industry: 'Technology',
            experienceLevel: 'Mid-Level',
            requiredSkills: ['Technical Documentation', 'Writing', 'Editing', 'Information Architecture', 'Markdown', 'Research'],
            preferredSkills: ['API Documentation', 'Developer Tools', 'HTML', 'CSS', 'Technical Background'],
            description: 'Create clear, concise documentation for technical products, APIs, and software systems.'
        }
    ];

    /**
     * Match a resume against potential job roles
     * @param {string} resumeText - The text content of the resume
     * @returns {Object} - Job match results
     */
    function matchJobsForResume(resumeText) {
        try {
            // Extract keywords from the resume
            const keywords = window.ResumeParserModule.extractKeywords(resumeText);
            
            // Extract sections from the resume
            const sections = window.ResumeParserModule.extractSections(resumeText);
            
            // Calculate job matches
            const jobMatches = calculateJobMatches(keywords, sections, resumeText);
            
            // Identify top industries based on matches
            const topIndustries = identifyTopIndustries(jobMatches);
            
            // Generate recommended job roles
            const recommendedRoles = generateRecommendedRoles(jobMatches, keywords);
            
            return {
                resumeId: 'resume-' + Date.now(),
                jobMatches: jobMatches.slice(0, 5), // Top 5 job matches
                topIndustries,
                recommendedRoles
            };
        } catch (error) {
            console.error('Error matching jobs for resume:', error);
            throw new Error(`Failed to match jobs: ${error.message}`);
        }
    }

    /**
     * Calculate job matches based on resume content
     * @param {Array<string>} keywords - Extracted keywords from the resume
     * @param {Object} sections - Extracted sections from the resume
     * @param {string} resumeText - Full resume text
     * @returns {Array<Object>} - Sorted job matches with scores
     */
    function calculateJobMatches(keywords, sections, resumeText) {
        const matches = [];
        
        // Process each job role
        jobRolesDatabase.forEach(job => {
            // Initialize match data
            const matchData = {
                jobTitle: job.jobTitle,
                matchScore: 0,
                industry: job.industry,
                experienceLevel: job.experienceLevel,
                keySkillMatches: [],
                missingSkills: [],
                description: job.description
            };
            
            // Calculate skill matches
            let skillMatchCount = 0;
            let totalSkills = job.requiredSkills.length;
            
            // Check required skills
            job.requiredSkills.forEach(skill => {
                if (hasSkill(skill, keywords, resumeText)) {
                    skillMatchCount++;
                    matchData.keySkillMatches.push(skill);
                } else {
                    matchData.missingSkills.push(skill);
                }
            });
            
            // Check preferred skills (weighted less than required skills)
            job.preferredSkills.forEach(skill => {
                if (hasSkill(skill, keywords, resumeText)) {
                    skillMatchCount += 0.5;
                    matchData.keySkillMatches.push(skill);
                }
                totalSkills += 0.5;
            });
            
            // Calculate base match score from skills (0-100)
            const skillScore = Math.round((skillMatchCount / totalSkills) * 100);
            
            // Adjust score based on experience
            let experienceScore = 0;
            if (sections.experience) {
                // Check for relevant experience keywords
                const relevantExperienceKeywords = getRelevantExperienceKeywords(job.jobTitle);
                let relevantExperienceCount = 0;
                
                relevantExperienceKeywords.forEach(keyword => {
                    if (new RegExp(`\\b${keyword}\\b`, 'i').test(sections.experience)) {
                        relevantExperienceCount++;
                    }
                });
                
                // Calculate experience score (0-20)
                experienceScore = Math.min(relevantExperienceCount * 5, 20);
            }
            
            // Calculate final match score
            matchData.matchScore = Math.min(skillScore + experienceScore, 100);
            
            // Only include matches with a minimum score
            if (matchData.matchScore >= 50) {
                matches.push(matchData);
            }
        });
        
        // Sort by match score (descending)
        return matches.sort((a, b) => b.matchScore - a.matchScore);
    }

    /**
     * Check if a resume has a particular skill
     * @param {string} skill - The skill to check for
     * @param {Array<string>} keywords - Extracted keywords
     * @param {string} resumeText - Full resume text
     * @returns {boolean} - Whether the skill is present
     */
    function hasSkill(skill, keywords, resumeText) {
        // Check if the skill is in the extracted keywords
        if (keywords.some(k => k.toLowerCase() === skill.toLowerCase())) {
            return true;
        }
        
        // Check for the skill in the resume text
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(resumeText);
    }

    /**
     * Get relevant experience keywords for a job title
     * @param {string} jobTitle - The job title
     * @returns {Array<string>} - Relevant experience keywords
     */
    function getRelevantExperienceKeywords(jobTitle) {
        // Define relevant keywords based on job title
        const jobKeywords = {
            'Frontend Developer': ['frontend', 'web development', 'javascript', 'react', 'angular', 'vue', 'ui', 'user interface'],
            'Backend Developer': ['backend', 'server', 'api', 'database', 'node.js', 'express', 'django', 'flask'],
            'Full Stack Developer': ['full stack', 'frontend', 'backend', 'web development', 'javascript', 'node.js'],
            'DevOps Engineer': ['devops', 'ci/cd', 'pipeline', 'infrastructure', 'cloud', 'aws', 'azure', 'docker'],
            'Data Scientist': ['data science', 'machine learning', 'analytics', 'statistics', 'python', 'r', 'data analysis'],
            'UI/UX Designer': ['ui', 'ux', 'user experience', 'design', 'wireframe', 'prototype', 'usability'],
            'Product Manager': ['product', 'roadmap', 'strategy', 'stakeholder', 'agile', 'scrum', 'requirements'],
            'QA Engineer': ['qa', 'quality assurance', 'testing', 'test', 'automation', 'selenium', 'quality'],
            'Project Manager': ['project', 'management', 'agile', 'scrum', 'budget', 'timeline', 'stakeholder'],
            'Technical Writer': ['documentation', 'writing', 'technical writing', 'content', 'editor', 'author']
        };
        
        // Return keywords for the job title, or a default set if not found
        return jobKeywords[jobTitle] || ['experience', 'work', 'professional', 'job', 'role', 'position'];
    }

    /**
     * Identify top industries based on job matches
     * @param {Array<Object>} jobMatches - Calculated job matches
     * @returns {Array<Object>} - Top industries with relevance scores
     */
    function identifyTopIndustries(jobMatches) {
        // Count matches by industry and calculate average match score
        const industryScores = {};
        
        jobMatches.forEach(match => {
            if (!industryScores[match.industry]) {
                industryScores[match.industry] = {
                    totalScore: 0,
                    count: 0
                };
            }
            
            industryScores[match.industry].totalScore += match.matchScore;
            industryScores[match.industry].count++;
        });
        
        // Calculate average score for each industry
        const industries = Object.keys(industryScores).map(industry => {
            const { totalScore, count } = industryScores[industry];
            return {
                name: industry,
                relevance: Math.round(totalScore / count)
            };
        });
        
        // Sort by relevance (descending)
        return industries.sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Generate recommended job roles based on matches and keywords
     * @param {Array<Object>} jobMatches - Calculated job matches
     * @param {Array<string>} keywords - Extracted keywords
     * @returns {Array<string>} - Recommended job roles
     */
    function generateRecommendedRoles(jobMatches, keywords) {
        // Start with the top job match titles
        const recommendedRoles = jobMatches.slice(0, 3).map(match => match.jobTitle);
        
        // Add specialized roles based on keywords
        const specializedRoles = [];
        
        // Check for frontend specialization
        if (keywords.some(k => ['react', 'angular', 'vue'].includes(k.toLowerCase()))) {
            const framework = keywords.find(k => ['react', 'angular', 'vue'].includes(k.toLowerCase()));
            specializedRoles.push(`${framework.charAt(0).toUpperCase() + framework.slice(1)} Developer`);
        }
        
        // Check for backend specialization
        if (keywords.some(k => ['node.js', 'express', 'django', 'flask', 'spring'].includes(k.toLowerCase()))) {
            const framework = keywords.find(k => ['node.js', 'express', 'django', 'flask', 'spring'].includes(k.toLowerCase()));
            specializedRoles.push(`${framework.charAt(0).toUpperCase() + framework.slice(1)} Developer`);
        }
        
        // Check for cloud specialization
        if (keywords.some(k => ['aws', 'azure', 'gcp', 'cloud'].includes(k.toLowerCase()))) {
            const platform = keywords.find(k => ['aws', 'azure', 'gcp'].includes(k.toLowerCase())) || 'Cloud';
            specializedRoles.push(`${platform.toUpperCase()} Cloud Engineer`);
        }
        
        // Combine and deduplicate roles
        return [...new Set([...recommendedRoles, ...specializedRoles])].slice(0, 5);
    }

    /**
     * Get a job description by title
     * @param {string} jobTitle - The job title to look up
     * @returns {Object|null} - The job description or null if not found
     */
    function getJobByTitle(jobTitle) {
        return jobRolesDatabase.find(job => job.jobTitle === jobTitle) || null;
    }

    // Public API
    return {
        matchJobsForResume,
        getJobByTitle
    };
})();