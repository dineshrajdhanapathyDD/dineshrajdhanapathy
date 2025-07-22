/**
 * ATS Checker Module
 * 
 * This module analyzes resumes for compatibility with Applicant Tracking Systems (ATS),
 * identifying potential issues and providing recommendations for improvement.
 */

window.ATSCheckerModule = (function () {
    'use strict';

    /**
     * Check a resume for ATS compatibility
     * @param {string} resumeText - The text content of the resume
     * @param {Object} jobDescription - Optional job description to check against
     * @returns {Object} - ATS compatibility analysis results
     */
    function checkATSCompatibility(resumeText, jobDescription = null) {
        try {
            // Extract sections from the resume
            const resumeSections = window.ResumeParserModule ?
                window.ResumeParserModule.extractSections(resumeText) :
                extractSectionsFallback(resumeText);

            // Check for formatting issues
            const formatIssues = checkFormatIssues(resumeText);

            // Analyze section parsing
            const sectionParsingResults = analyzeSectionParsing(resumeSections);

            // Calculate overall ATS score
            const overallScore = calculateATSScore(formatIssues, sectionParsingResults);

            // Analyze keywords if job description is provided
            const keywordAnalysis = jobDescription ?
                analyzeKeywords(resumeText, jobDescription) :
                { jobKeywords: [], foundKeywords: [], missingKeywords: [] };

            // Generate improvement recommendations
            const improvementRecommendations = generateRecommendations(formatIssues, sectionParsingResults, keywordAnalysis);

            return {
                overallScore,
                formatIssues,
                keywordAnalysis,
                sectionParsingResults,
                improvementRecommendations
            };
        } catch (error) {
            console.error('Error checking ATS compatibility:', error);
            throw new Error(`Failed to check ATS compatibility: ${error.message}`);
        }
    }

    /**
     * Check for formatting issues that could affect ATS parsing
     * @param {string} resumeText - The resume text
     * @returns {Array<Object>} - Detected formatting issues
     */
    function checkFormatIssues(resumeText) {
        const issues = [];

        // Check for tables (indicated by multiple spaces or tabs in a row)
        const tablePattern = /(\s{3,}|\t{2,})/;
        if (tablePattern.test(resumeText)) {
            issues.push({
                type: 'Tables',
                description: 'Possible table structure detected',
                impact: 'High - Many ATS systems cannot parse tables correctly',
                recommendation: 'Replace tables with bullet points or simple text formatting'
            });
        }

        // Check for complex formatting (special characters used for formatting)
        const complexFormattingPattern = /[│┃┆┇┊┋║▌▐▀▄■□●○◆◇★☆♦♢]/;
        if (complexFormattingPattern.test(resumeText)) {
            issues.push({
                type: 'Complex Characters',
                description: 'Special characters used for formatting',
                impact: 'Medium - May cause parsing errors in some ATS systems',
                recommendation: 'Use standard characters and formatting instead of special symbols'
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
                type: 'Inconsistent Dates',
                description: 'Multiple date formats detected',
                impact: 'Low - May cause confusion in date parsing',
                recommendation: 'Use a consistent date format throughout (e.g., MM/YYYY)'
            });
        }

        // Check for non-standard section headings
        const standardHeadings = [
            'summary', 'objective', 'experience', 'education', 'skills',
            'certifications', 'projects', 'publications', 'references'
        ];

        const headingPattern = /^([A-Z][A-Za-z\s]+)(?:\r?\n|:)/gm;
        let match;
        let nonStandardHeadingFound = false;

        while ((match = headingPattern.exec(resumeText)) !== null) {
            const heading = match[1].toLowerCase().trim();
            if (!standardHeadings.some(std => heading.includes(std))) {
                nonStandardHeadingFound = true;
                break;
            }
        }

        if (nonStandardHeadingFound) {
            issues.push({
                type: 'Non-standard Headings',
                description: 'Non-standard section headings detected',
                impact: 'Medium - May prevent proper section identification',
                recommendation: 'Use standard section headings (e.g., "Experience" instead of "Professional History")'
            });
        }

        // Check for headers/footers (text that repeats on multiple pages)
        const lines = resumeText.split(/\\r?\\n/);
        const potentialHeaderFooter = lines.filter(line => {
            // Look for lines that might be headers/footers (page numbers, name on every page, etc.)
            return /page \d+|\d+ of \d+|^\s*\d+\s*$/.test(line);
        });

        if (potentialHeaderFooter.length > 0) {
            issues.push({
                type: 'Headers/Footers',
                description: 'Possible headers or footers detected',
                impact: 'Medium - May be incorrectly parsed as content',
                recommendation: 'Remove headers, footers, and page numbers'
            });
        }

        // Check for text in columns (indicated by short lines with consistent indentation)
        const shortLines = lines.filter(line => line.trim().length > 0 && line.trim().length < 40);
        const indentedShortLines = shortLines.filter(line => line.startsWith(' ') || line.startsWith('\t'));

        if (indentedShortLines.length > 5 && indentedShortLines.length > shortLines.length * 0.5) {
            issues.push({
                type: 'Column Layout',
                description: 'Possible multi-column layout detected',
                impact: 'High - ATS systems typically read left-to-right, ignoring columns',
                recommendation: 'Use a single-column layout for better parsing'
            });
        }

        return issues;
    }

    /**
     * Analyze how well ATS systems will parse each section
     * @param {Object} sections - The extracted resume sections
     * @returns {Object} - Section parsing results
     */
    function analyzeSectionParsing(sections) {
        const results = {
            contactInfo: false,
            education: false,
            experience: false,
            skills: false
        };

        // Check contact information
        if (sections.contactInfo) {
            // Look for email and phone
            const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
            const phonePattern = /(\+?[0-9]{1,3}[-. ]?)?(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}/;

            results.contactInfo = emailPattern.test(sections.contactInfo) && phonePattern.test(sections.contactInfo);
        }

        // Check education section
        if (sections.education) {
            // Look for degree and institution
            const degreePattern = /bachelor|master|ph\.?d|associate|diploma|certificate|b\.?a|b\.?s|m\.?a|m\.?s|m\.?b\.?a/i;
            const institutionPattern = /university|college|institute|school/i;

            results.education = degreePattern.test(sections.education) && institutionPattern.test(sections.education);
        }

        // Check experience section
        if (sections.experience) {
            // Look for job titles, companies, and dates
            const jobTitlePattern = /developer|engineer|manager|director|analyst|specialist|coordinator|assistant|associate|consultant|lead/i;
            const companyPattern = /inc\.|corp\.|ltd\.|company|group|systems|technologies|solutions/i;
            const datePattern = /[12][0-9]{3}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|present/i;

            results.experience = jobTitlePattern.test(sections.experience) &&
                companyPattern.test(sections.experience) &&
                datePattern.test(sections.experience);
        }

        // Check skills section
        if (sections.skills) {
            // Skills should be clearly formatted, not in tables or graphics
            const tableIndicators = /(\s{3,}|\t{2,})/;
            const graphicIndicators = /[│┃┆┇┊┋║▌▐▀▄■□●○◆◇★☆♦♢]/;

            results.skills = !tableIndicators.test(sections.skills) && !graphicIndicators.test(sections.skills);
        }

        return results;
    }

    /**
     * Calculate overall ATS compatibility score
     * @param {Array<Object>} formatIssues - Detected formatting issues
     * @param {Object} sectionParsingResults - Section parsing results
     * @returns {number} - Overall ATS compatibility score (0-100)
     */
    function calculateATSScore(formatIssues, sectionParsingResults) {
        // Start with a perfect score
        let score = 100;

        // Deduct points for formatting issues
        formatIssues.forEach(issue => {
            switch (issue.impact) {
                case 'High':
                    score -= 15;
                    break;
                case 'Medium':
                    score -= 10;
                    break;
                case 'Low':
                    score -= 5;
                    break;
            }
        });

        // Deduct points for section parsing issues
        if (!sectionParsingResults.contactInfo) {
            score -= 15;
        }

        if (!sectionParsingResults.education) {
            score -= 10;
        }

        if (!sectionParsingResults.experience) {
            score -= 15;
        }

        if (!sectionParsingResults.skills) {
            score -= 10;
        }

        // Ensure score is within 0-100 range
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Analyze keywords in the resume against a job description
     * @param {string} resumeText - The resume text
     * @param {Object} jobDescription - The job description
     * @returns {Object} - Keyword analysis results
     */
    function analyzeKeywords(resumeText, jobDescription) {
        // Extract job keywords
        const jobKeywords = extractJobKeywords(jobDescription);

        // Check which keywords are found in the resume
        const foundKeywords = [];
        const missingKeywords = [];

        jobKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

            if (regex.test(resumeText)) {
                // Count occurrences and find location
                const matches = resumeText.match(new RegExp(regex, 'gi')) || [];
                const frequency = matches.length;

                // Determine location (which section)
                let location = '';
                const sections = ['summary', 'experience', 'education', 'skills', 'projects'];

                for (const section of sections) {
                    if (resumeText.includes(section) && regex.test(resumeText.split(section)[1])) {
                        location += (location ? ', ' : '') + section.charAt(0).toUpperCase() + section.slice(1);
                    }
                }

                foundKeywords.push({
                    keyword,
                    frequency,
                    location: location || 'Unknown'
                });
            } else {
                missingKeywords.push(keyword);
            }
        });

        return {
            jobKeywords,
            foundKeywords,
            missingKeywords
        };
    }

    /**
     * Extract keywords from a job description
     * @param {Object} jobDescription - The job description
     * @returns {Array<string>} - Extracted keywords
     */
    function extractJobKeywords(jobDescription) {
        const keywords = [];

        // If job description has required skills, use them
        if (jobDescription.requiredSkills) {
            keywords.push(...jobDescription.requiredSkills);

            // Add preferred skills if available
            if (jobDescription.preferredSkills) {
                jobDescription.preferredSkills.forEach(skill => {
                    if (!keywords.includes(skill)) {
                        keywords.push(skill);
                    }
                });
            }

            return keywords;
        }

        // Otherwise, extract keywords from the description text
        const description = jobDescription.description || '';

        // Technical skills
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
            if (regex.test(description) && !keywords.includes(skill)) {
                keywords.push(skill);
            }
        });

        // Role-specific keywords
        const roleKeywords = [
            'Frontend', 'Backend', 'Full Stack', 'DevOps', 'UI/UX',
            'Mobile', 'Web', 'Cloud', 'Database', 'Security',
            'Architecture', 'Design', 'Development', 'Testing',
            'Leadership', 'Management', 'Collaboration', 'Communication'
        ];

        roleKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(description) && !keywords.includes(keyword)) {
                keywords.push(keyword);
            }
        });

        return keywords;
    }

    /**
     * Generate recommendations for improving ATS compatibility
     * @param {Array<Object>} formatIssues - Detected formatting issues
     * @param {Object} sectionParsingResults - Section parsing results
     * @param {Object} keywordAnalysis - Keyword analysis results
     * @returns {Array<string>} - Improvement recommendations
     */
    function generateRecommendations(formatIssues, sectionParsingResults, keywordAnalysis) {
        const recommendations = [];

        // Add recommendations based on formatting issues
        formatIssues.forEach(issue => {
            recommendations.push(issue.recommendation);
        });

        // Add recommendations based on section parsing results
        if (!sectionParsingResults.contactInfo) {
            recommendations.push('Ensure contact information is clearly formatted at the top of your resume');
        }

        if (!sectionParsingResults.education) {
            recommendations.push('Format education section with clear institution names, degrees, and dates');
        }

        if (!sectionParsingResults.experience) {
            recommendations.push('Format experience section with clear job titles, company names, and dates');
        }

        if (!sectionParsingResults.skills) {
            recommendations.push('List skills in a simple format without tables, graphics, or columns');
        }

        // Add recommendations based on keyword analysis
        if (keywordAnalysis.missingKeywords && keywordAnalysis.missingKeywords.length > 0) {
            recommendations.push(`Include important keywords from the job description: ${keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}`);
        }

        // Add general ATS recommendations
        const generalRecommendations = [
            'Use a clean, simple resume design without graphics or complex formatting',
            'Stick to standard section headings (Summary, Experience, Education, Skills)',
            'Use a standard, easy-to-read font like Arial, Calibri, or Times New Roman',
            'Save your resume as a .docx or .pdf file (check job posting for preferred format)',
            'Avoid using headers, footers, or page numbers',
            'Use standard bullet points (•) instead of custom symbols',
            'Spell out acronyms at least once before using them throughout your resume'
        ];

        // Add general recommendations that aren't already included
        generalRecommendations.forEach(rec => {
            if (!recommendations.some(existing => existing.toLowerCase().includes(rec.toLowerCase().substring(0, 20)))) {
                recommendations.push(rec);
            }
        });

        // Return unique recommendations (no duplicates)
        return [...new Set(recommendations)];
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
        checkATSCompatibility,
        checkFormatIssues,
        analyzeSectionParsing,
        analyzeKeywords
    };
})();