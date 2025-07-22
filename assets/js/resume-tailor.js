/**
 * Resume Tailor Module
 * 
 * This module provides functionality for tailoring resumes to specific job descriptions,
 * identifying gaps, and generating recommendations for improvement.
 */

window.ResumeTailorModule = (function() {
    'use strict';

    /**
     * Tailor a resume for a specific job description
     * @param {string} resumeText - The text content of the resume
     * @param {Object} jobDescription - The job description to tailor for
     * @returns {Object} - Tailoring recommendations
     */
    function tailorResume(resumeText, jobDescription) {
        try {
            // Extract sections from the resume
            const resumeSections = window.ResumeParserModule ? 
                window.ResumeParserModule.extractSections(resumeText) : 
                extractSectionsFallback(resumeText);
            
            // Extract requirements from the job description
            const requirements = extractRequirements(jobDescription);
            
            // Perform gap analysis
            const gapAnalysis = analyzeGaps(resumeText, resumeSections, requirements);
            
            // Generate tailoring recommendations
            const recommendations = generateRecommendations(resumeSections, requirements, gapAnalysis);
            
            // Identify keywords to add or emphasize
            const keywordAnalysis = analyzeKeywords(resumeText, jobDescription);
            
            return {
                jobDescription: {
                    title: jobDescription.jobTitle || jobDescription.title,
                    company: jobDescription.company || 'Company',
                    description: jobDescription.description,
                    extractedRequirements: requirements
                },
                gapAnalysis: gapAnalysis,
                recommendations: recommendations,
                keywordsToAdd: keywordAnalysis.keywordsToAdd,
                keywordsToEmphasize: keywordAnalysis.keywordsToEmphasize,
                contentToHighlight: keywordAnalysis.contentToHighlight
            };
        } catch (error) {
            console.error('Error tailoring resume:', error);
            throw new Error(`Failed to tailor resume: ${error.message}`);
        }
    }

    /**
     * Extract requirements from a job description
     * @param {Object} jobDescription - The job description
     * @returns {Array<Object>} - Categorized requirements
     */
    function extractRequirements(jobDescription) {
        // If the job description already has extracted requirements, use them
        if (jobDescription.extractedRequirements) {
            return jobDescription.extractedRequirements;
        }
        
        // Initialize requirements categories
        const requirements = [
            {
                category: 'technical',
                items: []
            },
            {
                category: 'soft',
                items: []
            },
            {
                category: 'experience',
                items: []
            }
        ];
        
        // If we have required skills in the job description, use them
        if (jobDescription.requiredSkills) {
            requirements[0].items = [...jobDescription.requiredSkills];
            
            // Add preferred skills if available
            if (jobDescription.preferredSkills) {
                jobDescription.preferredSkills.forEach(skill => {
                    if (!requirements[0].items.includes(skill)) {
                        requirements[0].items.push(skill);
                    }
                });
            }
        } else {
            // Extract requirements from the description text
            const description = jobDescription.description || '';
            
            // Extract technical skills
            const technicalSkills = [
                'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
                'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind',
                'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Go',
                'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle', 'NoSQL',
                'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
                'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence',
                'REST', 'GraphQL', 'API', 'Microservices', 'Serverless',
                'Testing', 'Jest', 'Mocha', 'Cypress', 'Selenium',
                'Agile', 'Scrum', 'Kanban', 'DevOps', 'TDD', 'BDD'
            ];
            
            technicalSkills.forEach(skill => {
                const regex = new RegExp(`\\b${skill}\\b`, 'i');
                if (regex.test(description)) {
                    requirements[0].items.push(skill);
                }
            });
            
            // Extract soft skills
            const softSkills = [
                'Communication', 'Teamwork', 'Leadership', 'Problem-solving',
                'Critical thinking', 'Time management', 'Organization',
                'Adaptability', 'Flexibility', 'Creativity', 'Collaboration',
                'Interpersonal', 'Presentation', 'Negotiation', 'Decision-making'
            ];
            
            softSkills.forEach(skill => {
                const regex = new RegExp(`\\b${skill}\\b`, 'i');
                if (regex.test(description)) {
                    requirements[1].items.push(skill);
                }
            });
            
            // Extract experience requirements
            const experiencePatterns = [
                /(\d+\+?\s+years?(?:\s+of)?\s+experience)/i,
                /experience\s+(?:with|in|using)\s+([^.]+)/i,
                /background\s+(?:with|in)\s+([^.]+)/i,
                /knowledge\s+of\s+([^.]+)/i
            ];
            
            experiencePatterns.forEach(pattern => {
                const matches = description.match(pattern);
                if (matches && matches.length > 1) {
                    requirements[2].items.push(matches[1].trim());
                }
            });
        }
        
        // Ensure we have at least some items in each category
        if (requirements[0].items.length === 0) {
            requirements[0].items = ['Technical skills relevant to the position'];
        }
        
        if (requirements[1].items.length === 0) {
            requirements[1].items = ['Communication', 'Teamwork', 'Problem-solving'];
        }
        
        if (requirements[2].items.length === 0) {
            requirements[2].items = ['Relevant experience in the field'];
        }
        
        return requirements;
    }

    /**
     * Analyze gaps between resume and job requirements
     * @param {string} resumeText - The resume text
     * @param {Object} resumeSections - The extracted resume sections
     * @param {Array<Object>} requirements - The job requirements
     * @returns {Object} - Gap analysis results
     */
    function analyzeGaps(resumeText, resumeSections, requirements) {
        const matchedSkills = [];
        const missingSkills = [];
        const overqualifiedAreas = [];
        
        // Check technical requirements
        const technicalRequirements = requirements.find(req => req.category === 'technical');
        if (technicalRequirements) {
            technicalRequirements.items.forEach(skill => {
                const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(resumeText)) {
                    matchedSkills.push(skill);
                } else {
                    missingSkills.push(skill);
                }
            });
        }
        
        // Check for overqualification (skills mentioned multiple times or with senior terms)
        const skillFrequency = {};
        matchedSkills.forEach(skill => {
            const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            const matches = resumeText.match(regex) || [];
            skillFrequency[skill] = matches.length;
            
            // Check for senior terms near the skill
            const seniorRegex = new RegExp(`\\b(senior|lead|principal|expert|advanced)\\b.{0,30}\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b|\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b.{0,30}\\b(senior|lead|principal|expert|advanced)\\b`, 'i');
            if (seniorRegex.test(resumeText) && !skill.toLowerCase().includes('senior')) {
                overqualifiedAreas.push(skill);
            }
        });
        
        return {
            matchedSkills,
            missingSkills,
            overqualifiedAreas
        };
    }

    /**
     * Generate tailoring recommendations
     * @param {Object} resumeSections - The extracted resume sections
     * @param {Array<Object>} requirements - The job requirements
     * @param {Object} gapAnalysis - The gap analysis results
     * @returns {Array<Object>} - Tailoring recommendations
     */
    function generateRecommendations(resumeSections, requirements, gapAnalysis) {
        const recommendations = [];
        
        // Summary recommendation
        if (resumeSections.summary) {
            const summaryRec = {
                section: 'Summary',
                currentContent: resumeSections.summary,
                suggestedContent: '',
                explanation: ''
            };
            
            // Get job title from requirements
            let jobTitle = '';
            const experienceReqs = requirements.find(req => req.category === 'experience');
            if (experienceReqs && experienceReqs.items.length > 0) {
                const titleMatch = experienceReqs.items[0].match(/(\w+\s+\w+(?:\s+\w+)?)\s+experience/i);
                if (titleMatch) {
                    jobTitle = titleMatch[1];
                }
            }
            
            // Generate suggested summary
            let suggestedSummary = resumeSections.summary;
            
            // Add job title if missing
            if (jobTitle && !new RegExp(`\\b${jobTitle}\\b`, 'i').test(suggestedSummary)) {
                suggestedSummary = `${jobTitle} professional with ${suggestedSummary}`;
            }
            
            // Add missing key skills
            const technicalReqs = requirements.find(req => req.category === 'technical');
            if (technicalReqs) {
                const topSkills = technicalReqs.items.slice(0, 3);
                const skillsPhrase = topSkills.join(', ');
                
                if (!topSkills.some(skill => new RegExp(`\\b${skill}\\b`, 'i').test(suggestedSummary))) {
                    suggestedSummary = suggestedSummary.replace(/\.$/, '') + ` with expertise in ${skillsPhrase}.`;
                }
            }
            
            summaryRec.suggestedContent = suggestedSummary;
            summaryRec.explanation = 'Align your summary with the job requirements and highlight key skills';
            
            recommendations.push(summaryRec);
        }
        
        // Skills recommendation
        if (resumeSections.skills) {
            const skillsRec = {
                section: 'Skills',
                currentContent: resumeSections.skills,
                suggestedContent: '',
                explanation: ''
            };
            
            // Get all technical requirements
            const technicalReqs = requirements.find(req => req.category === 'technical');
            if (technicalReqs) {
                // Start with matched skills
                const prioritizedSkills = [...gapAnalysis.matchedSkills];
                
                // Add missing skills that might be relevant
                gapAnalysis.missingSkills.forEach(skill => {
                    // Check if the person might have the skill but used different terminology
                    const synonyms = getSkillSynonyms(skill);
                    const hasSynonym = synonyms.some(syn => new RegExp(`\\b${syn}\\b`, 'i').test(resumeSections.skills));
                    
                    if (hasSynonym) {
                        prioritizedSkills.push(skill);
                    }
                });
                
                // Create suggested skills section
                skillsRec.suggestedContent = prioritizedSkills.join(', ');
                skillsRec.explanation = 'Prioritize skills mentioned in the job description and ensure consistent terminology';
                
                recommendations.push(skillsRec);
            }
        }
        
        // Experience recommendation
        if (resumeSections.experience) {
            const experienceRec = {
                section: 'Experience',
                currentContent: resumeSections.experience.split('\\n')[0] + '...',
                suggestedContent: '',
                explanation: ''
            };
            
            // Get key requirements to emphasize
            const keyRequirements = [];
            requirements.forEach(reqCategory => {
                reqCategory.items.slice(0, 3).forEach(item => {
                    keyRequirements.push(item);
                });
            });
            
            // Generate suggested experience bullet points
            let suggestedExperience = 'Consider emphasizing these achievements in your experience section:\n\n';
            
            keyRequirements.forEach(req => {
                // Create a bullet point that incorporates the requirement
                suggestedExperience += `• Demonstrated expertise in ${req} by [specific achievement or project]\n`;
            });
            
            // Add quantifiable results suggestion
            suggestedExperience += `• Improved [relevant metric] by [percentage] through implementation of [relevant skill]\n`;
            suggestedExperience += `• Led a team of [number] to deliver [relevant project] on time and under budget\n`;
            
            experienceRec.suggestedContent = suggestedExperience;
            experienceRec.explanation = 'Highlight experiences that directly relate to the job requirements and include quantifiable achievements';
            
            recommendations.push(experienceRec);
        }
        
        return recommendations;
    }

    /**
     * Analyze keywords in the resume and job description
     * @param {string} resumeText - The resume text
     * @param {Object} jobDescription - The job description
     * @returns {Object} - Keyword analysis results
     */
    function analyzeKeywords(resumeText, jobDescription) {
        const keywordsToAdd = [];
        const keywordsToEmphasize = [];
        const contentToHighlight = [];
        
        // Extract job description text
        const jobDescText = jobDescription.description || '';
        
        // Find important phrases in job description
        const importantPhrases = extractImportantPhrases(jobDescText);
        
        // Check which phrases are missing from the resume
        importantPhrases.forEach(phrase => {
            const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            
            if (regex.test(resumeText)) {
                // Phrase exists but may need emphasis
                keywordsToEmphasize.push(phrase);
            } else {
                // Phrase is missing
                keywordsToAdd.push(phrase);
            }
        });
        
        // Find content to highlight (important context)
        const contextPhrases = [
            'team', 'leadership', 'project', 'development', 'implementation',
            'design', 'architecture', 'solution', 'client', 'customer',
            'performance', 'optimization', 'improvement', 'innovation'
        ];
        
        contextPhrases.forEach(phrase => {
            const regex = new RegExp(`\\b${phrase}\\b.{0,30}`, 'gi');
            const matches = jobDescText.match(regex);
            
            if (matches && matches.length > 0) {
                // Add unique matches
                matches.forEach(match => {
                    const trimmedMatch = match.trim();
                    if (!contentToHighlight.includes(trimmedMatch)) {
                        contentToHighlight.push(trimmedMatch);
                    }
                });
            }
        });
        
        return {
            keywordsToAdd: keywordsToAdd.slice(0, 5),
            keywordsToEmphasize: keywordsToEmphasize.slice(0, 5),
            contentToHighlight: contentToHighlight.slice(0, 5)
        };
    }

    /**
     * Extract important phrases from job description
     * @param {string} text - The job description text
     * @returns {Array<string>} - Important phrases
     */
    function extractImportantPhrases(text) {
        const phrases = [];
        
        // Technical skills
        const technicalSkills = [
            'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
            'HTML5', 'CSS3', 'SASS', 'LESS', 'Bootstrap', 'Tailwind',
            'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Go',
            'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle', 'NoSQL',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
            'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence',
            'REST', 'GraphQL', 'API', 'Microservices', 'Serverless',
            'Testing', 'Jest', 'Mocha', 'Cypress', 'Selenium',
            'Agile', 'Scrum', 'Kanban', 'DevOps', 'TDD', 'BDD'
        ];
        
        technicalSkills.forEach(skill => {
            const regex = new RegExp(`\\b${skill}\\b`, 'i');
            if (regex.test(text)) {
                phrases.push(skill);
            }
        });
        
        // Soft skills
        const softSkills = [
            'Communication', 'Teamwork', 'Leadership', 'Problem-solving',
            'Critical thinking', 'Time management', 'Organization',
            'Adaptability', 'Flexibility', 'Creativity', 'Collaboration',
            'Interpersonal', 'Presentation', 'Negotiation', 'Decision-making'
        ];
        
        softSkills.forEach(skill => {
            const regex = new RegExp(`\\b${skill}\\b`, 'i');
            if (regex.test(text)) {
                phrases.push(skill);
            }
        });
        
        // Domain-specific phrases
        const domainPhrases = [
            'frontend development', 'backend development', 'full stack',
            'web application', 'mobile application', 'cloud architecture',
            'database design', 'user experience', 'user interface',
            'responsive design', 'cross-browser compatibility',
            'performance optimization', 'security best practices',
            'code review', 'continuous integration', 'continuous deployment',
            'test-driven development', 'agile methodology', 'scrum master'
        ];
        
        domainPhrases.forEach(phrase => {
            const regex = new RegExp(`\\b${phrase.replace(/\s+/g, '\\s+')}\\b`, 'i');
            if (regex.test(text)) {
                phrases.push(phrase);
            }
        });
        
        return phrases;
    }

    /**
     * Get synonyms for a skill
     * @param {string} skill - The skill to find synonyms for
     * @returns {Array<string>} - Synonyms for the skill
     */
    function getSkillSynonyms(skill) {
        const synonymMap = {
            'JavaScript': ['JS', 'ECMAScript', 'ES6', 'ES2015'],
            'TypeScript': ['TS', 'Typed JS'],
            'React': ['React.js', 'ReactJS', 'React Native'],
            'Angular': ['AngularJS', 'Angular2+', 'Angular.js'],
            'Vue': ['Vue.js', 'VueJS'],
            'Node.js': ['NodeJS', 'Node'],
            'HTML': ['HTML5', 'XHTML'],
            'CSS': ['CSS3', 'Cascading Style Sheets'],
            'AWS': ['Amazon Web Services', 'Amazon Cloud'],
            'Azure': ['Microsoft Azure', 'MS Azure'],
            'GCP': ['Google Cloud Platform', 'Google Cloud'],
            'CI/CD': ['Continuous Integration', 'Continuous Deployment', 'DevOps Pipeline'],
            'REST': ['RESTful', 'REST API', 'RESTful API'],
            'GraphQL': ['GQL', 'Graph API'],
            'UI/UX': ['User Interface', 'User Experience', 'UX Design', 'UI Design'],
            'Agile': ['Scrum', 'Kanban', 'Agile Methodology'],
            'Communication': ['Interpersonal Skills', 'Verbal Communication', 'Written Communication'],
            'Problem-solving': ['Critical Thinking', 'Analytical Skills', 'Troubleshooting']
        };
        
        return synonymMap[skill] || [skill];
    }

    /**
     * Fallback function to extract sections from resume text
     * @param {string} text - The resume text
     * @returns {Object} - Extracted sections
     */
    function extractSectionsFallback(text) {
        // Define common section headers
        const sectionPatterns = {
            contactInfo: /(?:contact|personal)\s+information|contact|contact\s+details/i,
            summary: /(?:professional\s+)?summary|profile|objective|about\s+me/i,
            education: /education|academic|qualifications|degrees/i,
            experience: /(?:work|professional)\s+experience|employment|work\s+history|career/i,
            skills: /(?:technical\s+)?skills|core\s+competencies|expertise|qualifications/i,
            projects: /projects|portfolio|works/i,
            certifications: /certifications|certificates|accreditations/i,
            languages: /languages|language\s+proficiency/i,
            references: /references|recommendations/i
        };
        
        // Initialize sections object
        const sections = {
            contactInfo: '',
            summary: '',
            education: '',
            experience: '',
            skills: '',
            projects: '',
            certifications: '',
            languages: '',
            references: '',
            other: ''
        };
        
        // Split text into lines
        const lines = text.split(/\\r?\\n/);
        
        // Current section being processed
        let currentSection = 'other';
        
        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Check if this line is a section header
            let foundSection = false;
            for (const [section, pattern] of Object.entries(sectionPatterns)) {
                if (pattern.test(line)) {
                    currentSection = section;
                    foundSection = true;
                    break;
                }
            }
            
            // If this is a section header, skip adding it to the content
            if (foundSection) continue;
            
            // Add line to current section
            sections[currentSection] += line + '\\n';
        }
        
        // Trim all sections
        for (const section in sections) {
            sections[section] = sections[section].trim();
        }
        
        return sections;
    }

    // Public API
    return {
        tailorResume,
        extractRequirements,
        analyzeGaps,
        analyzeKeywords
    };
})();