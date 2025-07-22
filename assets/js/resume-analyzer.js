/**
 * Resume Analyzer Module
 * 
 * This module analyzes resume content to provide insights, scores, and recommendations
 * for improving the resume.
 */

window.ResumeAnalyzerModule = (function() {
    'use strict';

    /**
     * Analyze a resume based on its text content
     * @param {string} resumeText - The text content of the resume
     * @returns {Object} - Analysis results
     */
    function analyzeResume(resumeText) {
        try {
            // Extract sections from the resume text
            const sections = window.ResumeParserModule.extractSections(resumeText);
            
            // Extract keywords from the resume text
            const keywords = window.ResumeParserModule.extractKeywords(resumeText);
            
            // Analyze each section
            const sectionScores = analyzeSections(sections);
            
            // Calculate overall completion score
            const completionScore = calculateCompletionScore(sectionScores);
            
            // Analyze keywords
            const keywordAnalysis = analyzeKeywords(keywords, resumeText);
            
            // Calculate readability score
            const readabilityScore = calculateReadabilityScore(resumeText);
            
            // Detect issues in the resume
            const issuesDetected = detectIssues(sections, resumeText);
            
            // Identify strengths and improvement areas
            const strengths = identifyStrengths(sectionScores, keywordAnalysis, readabilityScore);
            const improvementAreas = identifyImprovementAreas(sectionScores, issuesDetected);
            
            // Return the complete analysis results
            return {
                completionScore,
                sectionScores,
                keywordAnalysis,
                readabilityScore,
                issuesDetected,
                strengths,
                improvementAreas
            };
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw new Error(`Failed to analyze resume: ${error.message}`);
        }
    }

    /**
     * Analyze each section of the resume
     * @param {Object} sections - The extracted sections of the resume
     * @returns {Object} - Scores for each section
     */
    function analyzeSections(sections) {
        const scores = {};
        
        // Contact Information
        scores.contactInfo = analyzeContactInfo(sections.contactInfo);
        
        // Summary/Objective
        scores.summary = analyzeSummary(sections.summary);
        
        // Education
        scores.education = analyzeEducation(sections.education);
        
        // Experience
        scores.experience = analyzeExperience(sections.experience);
        
        // Skills
        scores.skills = analyzeSkills(sections.skills);
        
        return scores;
    }

    /**
     * Analyze contact information section
     * @param {string} contactText - The contact information text
     * @returns {number} - Score from 0-100
     */
    function analyzeContactInfo(contactText) {
        if (!contactText) return 0;
        
        let score = 0;
        const maxScore = 100;
        
        // Check for essential contact elements
        const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(contactText);
        const hasPhone = /(\+?[0-9]{1,3}[-. ]?)?(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}/.test(contactText);
        const hasLocation = /[A-Za-z]+(,\s*[A-Za-z]+)?/.test(contactText);
        const hasLinkedIn = /linkedin\.com/.test(contactText);
        const hasWebsite = /https?:\/\//.test(contactText) && !hasLinkedIn; // Website other than LinkedIn
        
        // Score based on presence of elements
        if (hasEmail) score += 30;
        if (hasPhone) score += 25;
        if (hasLocation) score += 20;
        if (hasLinkedIn) score += 15;
        if (hasWebsite) score += 10;
        
        // Cap at max score
        return Math.min(score, maxScore);
    }

    /**
     * Analyze summary/objective section
     * @param {string} summaryText - The summary text
     * @returns {number} - Score from 0-100
     */
    function analyzeSummary(summaryText) {
        if (!summaryText) return 0;
        
        let score = 50; // Base score for having a summary
        const maxScore = 100;
        
        // Length check - ideal is 3-5 sentences
        const sentences = summaryText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length < 2) {
            score -= 20; // Too short
        } else if (sentences.length > 6) {
            score -= 10; // Too long
        } else if (sentences.length >= 3 && sentences.length <= 5) {
            score += 10; // Ideal length
        }
        
        // Check for personal pronouns (should be limited)
        const pronounCount = (summaryText.match(/\b(I|me|my|mine)\b/gi) || []).length;
        if (pronounCount > 3) {
            score -= 10; // Too many personal pronouns
        }
        
        // Check for action verbs
        const actionVerbs = [
            'achieved', 'improved', 'developed', 'managed', 'created', 'increased',
            'reduced', 'negotiated', 'led', 'organized', 'designed', 'implemented'
        ];
        let actionVerbCount = 0;
        actionVerbs.forEach(verb => {
            if (new RegExp(`\\b${verb}\\b`, 'i').test(summaryText)) {
                actionVerbCount++;
            }
        });
        
        if (actionVerbCount >= 2) {
            score += 15; // Good use of action verbs
        }
        
        // Check for industry keywords
        const industryKeywords = [
            'professional', 'experienced', 'skilled', 'expert', 'specialist',
            'background', 'knowledge', 'proficient', 'certified', 'qualified'
        ];
        let keywordCount = 0;
        industryKeywords.forEach(keyword => {
            if (new RegExp(`\\b${keyword}\\b`, 'i').test(summaryText)) {
                keywordCount++;
            }
        });
        
        if (keywordCount >= 2) {
            score += 15; // Good use of industry keywords
        }
        
        // Check for quantifiable achievements
        if (/\d+%|\d+ years|\d+\+/.test(summaryText)) {
            score += 10; // Contains quantifiable information
        }
        
        // Cap at max score
        return Math.min(Math.max(score, 0), maxScore);
    }

    /**
     * Analyze education section
     * @param {string} educationText - The education text
     * @returns {number} - Score from 0-100
     */
    function analyzeEducation(educationText) {
        if (!educationText) return 0;
        
        let score = 50; // Base score for having education
        const maxScore = 100;
        
        // Check for degree mentions
        const degreePatterns = [
            /bachelor|b\.?a\.?|b\.?s\.?|b\.?e\.?|undergraduate/i,
            /master|m\.?a\.?|m\.?s\.?|m\.?b\.?a\.?|graduate/i,
            /ph\.?d\.?|doctor|doctorate/i,
            /associate|a\.?a\.?|a\.?s\.?/i,
            /diploma|certificate/i
        ];
        
        let degreeCount = 0;
        degreePatterns.forEach(pattern => {
            if (pattern.test(educationText)) {
                degreeCount++;
            }
        });
        
        if (degreeCount > 0) {
            score += 15; // Has degree information
        }
        
        // Check for institution names
        if (/university|college|institute|school/i.test(educationText)) {
            score += 10; // Mentions educational institutions
        }
        
        // Check for graduation dates
        if (/graduated|graduation|class of|[12][0-9]{3}|'[0-9]{2}/i.test(educationText)) {
            score += 10; // Includes graduation dates
        }
        
        // Check for GPA
        if (/gpa|grade point|[0-4]\.[0-9]/i.test(educationText)) {
            score += 5; // Includes GPA
        }
        
        // Check for honors/achievements
        if (/honors|cum laude|magna|summa|distinction|dean'?s list|scholarship/i.test(educationText)) {
            score += 5; // Includes honors
        }
        
        // Check for relevant coursework
        if (/coursework|courses|curriculum|major|minor/i.test(educationText)) {
            score += 5; // Includes coursework
        }
        
        // Cap at max score
        return Math.min(score, maxScore);
    }

    /**
     * Analyze experience section
     * @param {string} experienceText - The experience text
     * @returns {number} - Score from 0-100
     */
    function analyzeExperience(experienceText) {
        if (!experienceText) return 0;
        
        let score = 50; // Base score for having experience
        const maxScore = 100;
        
        // Check for job titles
        const jobTitlePatterns = [
            /developer|engineer|manager|director|analyst|specialist|coordinator|assistant|associate|consultant|lead/i
        ];
        
        if (jobTitlePatterns.some(pattern => pattern.test(experienceText))) {
            score += 10; // Has job titles
        }
        
        // Check for company names
        if (/inc\.|corp\.|ltd\.|company|group|systems|technologies|solutions/i.test(experienceText)) {
            score += 10; // Mentions company names
        }
        
        // Check for dates
        if (/[12][0-9]{3}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|present/i.test(experienceText)) {
            score += 10; // Includes dates
        }
        
        // Check for bullet points (indicated by line breaks followed by common bullet point starters)
        const bulletPointIndicators = experienceText.split('\\n').filter(line => 
            /^[\s•\-\*]*(developed|created|managed|implemented|led|designed|improved|increased|decreased|reduced|negotiated|coordinated|maintained|generated|delivered)/i.test(line.trim())
        );
        
        if (bulletPointIndicators.length >= 3) {
            score += 15; // Good use of bullet points
        } else if (bulletPointIndicators.length >= 1) {
            score += 5; // Some use of bullet points
        }
        
        // Check for action verbs
        const actionVerbs = [
            'achieved', 'improved', 'developed', 'managed', 'created', 'increased',
            'reduced', 'negotiated', 'led', 'organized', 'designed', 'implemented',
            'coordinated', 'delivered', 'generated', 'maintained', 'supervised',
            'trained', 'analyzed', 'established', 'launched', 'executed'
        ];
        
        let actionVerbCount = 0;
        actionVerbs.forEach(verb => {
            const regex = new RegExp(`\\b${verb}\\b`, 'i');
            const matches = experienceText.match(regex) || [];
            actionVerbCount += matches.length;
        });
        
        if (actionVerbCount >= 5) {
            score += 15; // Excellent use of action verbs
        } else if (actionVerbCount >= 3) {
            score += 10; // Good use of action verbs
        } else if (actionVerbCount >= 1) {
            score += 5; // Some use of action verbs
        }
        
        // Check for quantifiable achievements
        const quantifiablePattern = /\d+%|\$\d+|\d+ (people|employees|team members|clients|customers|projects|products|services|years|months)/i;
        const quantifiableMatches = experienceText.match(quantifiablePattern) || [];
        
        if (quantifiableMatches.length >= 3) {
            score += 15; // Excellent use of quantifiable achievements
        } else if (quantifiableMatches.length >= 1) {
            score += 10; // Some use of quantifiable achievements
        }
        
        // Cap at max score
        return Math.min(score, maxScore);
    }

    /**
     * Analyze skills section
     * @param {string} skillsText - The skills text
     * @returns {number} - Score from 0-100
     */
    function analyzeSkills(skillsText) {
        if (!skillsText) return 0;
        
        let score = 50; // Base score for having skills
        const maxScore = 100;
        
        // Count the number of skills
        const skillLines = skillsText.split(/[,;\\n]/).filter(s => s.trim().length > 0);
        const skillCount = skillLines.length;
        
        if (skillCount >= 10) {
            score += 15; // Good number of skills
        } else if (skillCount >= 5) {
            score += 10; // Decent number of skills
        } else if (skillCount >= 3) {
            score += 5; // Minimal skills
        }
        
        // Check for technical skills
        const technicalSkills = [
            'javascript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'php', 'swift', 'kotlin',
            'html', 'css', 'sql', 'nosql', 'react', 'angular', 'vue', 'node', 'express',
            'django', 'flask', 'spring', 'asp\\.net', 'laravel', 'rails',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
            'rest', 'graphql', 'api', 'microservices', 'serverless',
            'mongodb', 'mysql', 'postgresql', 'oracle', 'sql server', 'redis'
        ];
        
        let technicalSkillCount = 0;
        technicalSkills.forEach(skill => {
            if (new RegExp(`\\b${skill}\\b`, 'i').test(skillsText)) {
                technicalSkillCount++;
            }
        });
        
        if (technicalSkillCount >= 5) {
            score += 15; // Good technical skills
        } else if (technicalSkillCount >= 3) {
            score += 10; // Some technical skills
        } else if (technicalSkillCount >= 1) {
            score += 5; // Minimal technical skills
        }
        
        // Check for soft skills
        const softSkills = [
            'communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking',
            'time management', 'organization', 'adaptability', 'flexibility', 'creativity',
            'project management', 'collaboration', 'interpersonal', 'presentation'
        ];
        
        let softSkillCount = 0;
        softSkills.forEach(skill => {
            if (new RegExp(`\\b${skill}\\b`, 'i').test(skillsText)) {
                softSkillCount++;
            }
        });
        
        if (softSkillCount >= 3) {
            score += 10; // Good soft skills
        } else if (softSkillCount >= 1) {
            score += 5; // Some soft skills
        }
        
        // Check for organization (categorization or grouping)
        if (/technical|programming|languages|frameworks|tools|soft skills|professional|certifications/i.test(skillsText)) {
            score += 10; // Organized skills
        }
        
        // Cap at max score
        return Math.min(score, maxScore);
    }

    /**
     * Calculate overall completion score based on section scores
     * @param {Object} sectionScores - Scores for each section
     * @returns {number} - Overall completion score (0-100)
     */
    function calculateCompletionScore(sectionScores) {
        // Define weights for each section
        const weights = {
            contactInfo: 0.15,
            summary: 0.15,
            education: 0.2,
            experience: 0.3,
            skills: 0.2
        };
        
        // Calculate weighted average
        let weightedSum = 0;
        let totalWeight = 0;
        
        for (const [section, score] of Object.entries(sectionScores)) {
            if (section in weights) {
                weightedSum += score * weights[section];
                totalWeight += weights[section];
            }
        }
        
        // Return rounded score
        return Math.round(weightedSum / totalWeight);
    }

    /**
     * Analyze keywords found in the resume
     * @param {Array<string>} keywords - Extracted keywords
     * @param {string} resumeText - Full resume text
     * @returns {Object} - Keyword analysis results
     */
    function analyzeKeywords(keywords, resumeText) {
        // Calculate keyword frequency and relevance
        const extractedKeywords = keywords.map(keyword => {
            // Count occurrences
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = resumeText.match(regex) || [];
            const frequency = matches.length;
            
            // Calculate relevance score (0-100)
            // This is a simplified calculation - in a real system this would be more sophisticated
            let relevance = Math.min(frequency * 10 + 60, 100);
            
            // Adjust relevance based on keyword position
            // Keywords in summary and skills sections are more relevant
            const sections = window.ResumeParserModule.extractSections(resumeText);
            if ((sections.summary && new RegExp(`\\b${keyword}\\b`, 'i').test(sections.summary)) ||
                (sections.skills && new RegExp(`\\b${keyword}\\b`, 'i').test(sections.skills))) {
                relevance = Math.min(relevance + 10, 100);
            }
            
            return {
                keyword,
                relevance,
                frequency
            };
        });
        
        // Sort by relevance (descending)
        extractedKeywords.sort((a, b) => b.relevance - a.relevance);
        
        // Identify missing keywords that would be valuable to add
        const commonKeywords = [
            'leadership', 'teamwork', 'communication', 'problem-solving',
            'project management', 'analytical', 'detail-oriented', 'innovative',
            'strategic', 'collaborative', 'agile', 'scrum', 'customer-focused',
            'results-driven', 'time management', 'adaptable', 'flexible'
        ];
        
        const missingKeywords = commonKeywords.filter(keyword => 
            !keywords.some(k => k.toLowerCase() === keyword.toLowerCase())
        );
        
        return {
            extractedKeywords: extractedKeywords.slice(0, 5), // Top 5 keywords
            missingKeywords: missingKeywords.slice(0, 3) // Top 3 missing keywords
        };
    }

    /**
     * Calculate readability score for the resume
     * @param {string} text - Resume text
     * @returns {number} - Readability score (0-100)
     */
    function calculateReadabilityScore(text) {
        // This is a simplified readability calculation
        // In a real system, you might use established algorithms like Flesch-Kincaid
        
        // Split text into sentences and words
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.trim().length > 0);
        
        // Count syllables (simplified)
        let syllableCount = 0;
        words.forEach(word => {
            // Count vowel groups as syllables (simplified)
            const vowelGroups = word.toLowerCase().match(/[aeiouy]+/g) || [];
            syllableCount += vowelGroups.length;
        });
        
        // Calculate metrics
        const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
        const avgSyllablesPerWord = syllableCount / Math.max(words.length, 1);
        
        // Penalize very long sentences
        let readabilityScore = 100;
        if (avgWordsPerSentence > 25) {
            readabilityScore -= 20;
        } else if (avgWordsPerSentence > 20) {
            readabilityScore -= 10;
        } else if (avgWordsPerSentence > 15) {
            readabilityScore -= 5;
        }
        
        // Penalize complex words
        if (avgSyllablesPerWord > 2) {
            readabilityScore -= 15;
        } else if (avgSyllablesPerWord > 1.8) {
            readabilityScore -= 10;
        } else if (avgSyllablesPerWord > 1.6) {
            readabilityScore -= 5;
        }
        
        // Penalize very short or very long resumes
        if (words.length < 200) {
            readabilityScore -= 10;
        } else if (words.length > 1000) {
            readabilityScore -= 15;
        }
        
        // Cap at 0-100 range
        return Math.max(0, Math.min(100, readabilityScore));
    }

    /**
     * Detect issues in the resume
     * @param {Object} sections - Resume sections
     * @param {string} resumeText - Full resume text
     * @returns {Array<Object>} - Detected issues
     */
    function detectIssues(sections, resumeText) {
        const issues = [];
        
        // Check for missing or weak sections
        if (!sections.contactInfo) {
            issues.push({
                type: 'content',
                severity: 'high',
                description: 'Missing contact information',
                location: 'Contact section',
                recommendation: 'Add complete contact details including email, phone, and location'
            });
        }
        
        if (!sections.summary) {
            issues.push({
                type: 'content',
                severity: 'medium',
                description: 'Missing professional summary',
                location: 'Summary section',
                recommendation: 'Add a concise professional summary highlighting your value proposition'
            });
        } else if (sections.summary.split(/\s+/).length < 30) {
            issues.push({
                type: 'content',
                severity: 'low',
                description: 'Professional summary is too brief',
                location: 'Summary section',
                recommendation: 'Expand your summary to 3-5 sentences highlighting key qualifications'
            });
        }
        
        if (!sections.experience) {
            issues.push({
                type: 'content',
                severity: 'high',
                description: 'Missing work experience',
                location: 'Experience section',
                recommendation: 'Add your work history with job titles, companies, dates, and accomplishments'
            });
        }
        
        if (!sections.education) {
            issues.push({
                type: 'content',
                severity: 'medium',
                description: 'Missing education information',
                location: 'Education section',
                recommendation: 'Add your educational background including degrees, institutions, and graduation dates'
            });
        }
        
        if (!sections.skills) {
            issues.push({
                type: 'content',
                severity: 'medium',
                description: 'Missing skills section',
                location: 'Skills section',
                recommendation: 'Add a comprehensive list of your technical and soft skills'
            });
        }
        
        // Check for passive voice (simplified check)
        const passiveVoicePatterns = [
            /was (made|created|developed|implemented|designed|managed)/gi,
            /were (made|created|developed|implemented|designed|managed)/gi,
            /has been/gi,
            /have been/gi,
            /is being/gi,
            /are being/gi
        ];
        
        let passiveVoiceCount = 0;
        passiveVoicePatterns.forEach(pattern => {
            const matches = resumeText.match(pattern) || [];
            passiveVoiceCount += matches.length;
        });
        
        if (passiveVoiceCount > 3) {
            issues.push({
                type: 'language',
                severity: 'medium',
                description: 'Excessive use of passive voice',
                location: 'Throughout resume',
                recommendation: 'Replace passive voice with active voice and action verbs'
            });
        }
        
        // Check for clichés and buzzwords
        const clichePatterns = [
            /think outside the box/gi,
            /team player/gi,
            /detail[ -]oriented/gi,
            /self[ -]starter/gi,
            /go[ -]getter/gi,
            /hard worker/gi,
            /results[ -]driven/gi,
            /proactive/gi
        ];
        
        let clicheCount = 0;
        clichePatterns.forEach(pattern => {
            const matches = resumeText.match(pattern) || [];
            clicheCount += matches.length;
        });
        
        if (clicheCount > 2) {
            issues.push({
                type: 'language',
                severity: 'low',
                description: 'Overuse of clichés and buzzwords',
                location: 'Throughout resume',
                recommendation: 'Replace generic phrases with specific accomplishments and skills'
            });
        }
        
        // Check for inconsistent date formats
        const dateFormats = [];
        const datePatterns = [
            /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* [0-9]{4}\b/g, // Month Year
            /\b[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}\b/g, // MM/DD/YYYY
            /\b[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\b/g, // YYYY-MM-DD
            /\b[0-9]{4}\b/g // Just year
        ];
        
        datePatterns.forEach((pattern, index) => {
            const matches = resumeText.match(pattern) || [];
            if (matches.length > 0) {
                dateFormats.push(index);
            }
        });
        
        if (dateFormats.length > 1) {
            issues.push({
                type: 'formatting',
                severity: 'low',
                description: 'Inconsistent date formats',
                location: 'Throughout resume',
                recommendation: 'Use a consistent date format throughout (e.g., MM/YYYY)'
            });
        }
        
        // Check for personal pronouns
        const pronounCount = (resumeText.match(/\b(I|me|my|mine)\b/gi) || []).length;
        if (pronounCount > 5) {
            issues.push({
                type: 'language',
                severity: 'medium',
                description: 'Excessive use of personal pronouns',
                location: 'Throughout resume',
                recommendation: 'Remove personal pronouns and focus on accomplishments'
            });
        }
        
        return issues;
    }

    /**
     * Identify strengths in the resume
     * @param {Object} sectionScores - Scores for each section
     * @param {Object} keywordAnalysis - Keyword analysis results
     * @param {number} readabilityScore - Readability score
     * @returns {Array<string>} - Identified strengths
     */
    function identifyStrengths(sectionScores, keywordAnalysis, readabilityScore) {
        const strengths = [];
        
        // Check section scores
        if (sectionScores.contactInfo >= 90) {
            strengths.push('Comprehensive contact information');
        }
        
        if (sectionScores.summary >= 85) {
            strengths.push('Strong professional summary');
        }
        
        if (sectionScores.education >= 85) {
            strengths.push('Well-documented educational background');
        }
        
        if (sectionScores.experience >= 85) {
            strengths.push('Detailed work experience with accomplishments');
        }
        
        if (sectionScores.skills >= 85) {
            strengths.push('Comprehensive skills section');
        }
        
        // Check keywords
        if (keywordAnalysis.extractedKeywords.length >= 3 && 
            keywordAnalysis.extractedKeywords[0].relevance >= 90) {
            strengths.push('Strong industry-relevant keywords');
        }
        
        // Check readability
        if (readabilityScore >= 85) {
            strengths.push('Excellent readability and clarity');
        }
        
        // Return top strengths (max 5)
        return strengths.slice(0, 5);
    }

    /**
     * Identify areas for improvement in the resume
     * @param {Object} sectionScores - Scores for each section
     * @param {Array<Object>} issues - Detected issues
     * @returns {Array<string>} - Identified improvement areas
     */
    function identifyImprovementAreas(sectionScores, issues) {
        const improvementAreas = [];
        
        // Check section scores
        if (sectionScores.summary < 70) {
            improvementAreas.push('Enhance professional summary');
        }
        
        if (sectionScores.experience < 70) {
            improvementAreas.push('Strengthen work experience with specific achievements');
        }
        
        if (sectionScores.skills < 70) {
            improvementAreas.push('Expand skills section with relevant technical and soft skills');
        }
        
        // Add recommendations based on high and medium severity issues
        issues.forEach(issue => {
            if (issue.severity === 'high' || issue.severity === 'medium') {
                improvementAreas.push(issue.recommendation);
            }
        });
        
        // Return unique improvement areas (max 5)
        return [...new Set(improvementAreas)].slice(0, 5);
    }

    // Public API
    return {
        analyzeResume
    };
})();