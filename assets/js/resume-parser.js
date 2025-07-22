/**
 * Resume Parser Module
 * 
 * This module handles the parsing of different resume file formats (PDF, DOCX, TXT)
 * and extracts text content for further analysis.
 */

window.ResumeParserModule = (function() {
    'use strict';

    /**
     * Parse a resume file and extract its text content
     * @param {File} file - The resume file to parse
     * @returns {Promise<string>} - Promise resolving to the extracted text
     */
    async function parseResume(file) {
        try {
            const fileType = determineFileType(file);
            
            switch (fileType) {
                case 'pdf':
                    return await parsePDF(file);
                case 'docx':
                    return await parseDOCX(file);
                case 'txt':
                    return await parseTXT(file);
                default:
                    throw new Error('Unsupported file format');
            }
        } catch (error) {
            console.error('Error parsing resume:', error);
            throw new Error(`Failed to parse resume: ${error.message}`);
        }
    }

    /**
     * Determine the file type based on extension and MIME type
     * @param {File} file - The file to check
     * @returns {string} - The file type (pdf, docx, txt)
     */
    function determineFileType(file) {
        // Check by MIME type first
        if (file.type === 'application/pdf') {
            return 'pdf';
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return 'docx';
        } else if (file.type === 'text/plain') {
            return 'txt';
        }
        
        // Fallback to extension check
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.pdf')) {
            return 'pdf';
        } else if (fileName.endsWith('.docx')) {
            return 'docx';
        } else if (fileName.endsWith('.txt')) {
            return 'txt';
        }
        
        throw new Error('Unsupported file format');
    }

    /**
     * Parse a PDF file using PDF.js
     * @param {File} file - The PDF file to parse
     * @returns {Promise<string>} - Promise resolving to the extracted text
     */
    async function parsePDF(file) {
        try {
            // Check if PDF.js is loaded
            if (typeof pdfjsLib === 'undefined') {
                // Load PDF.js dynamically if not already loaded
                await loadPDFJS();
            }
            
            // Read the file as ArrayBuffer
            const arrayBuffer = await readFileAsArrayBuffer(file);
            
            // Load the PDF document
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            
            // Extract text from each page
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\\n\\n';
            }
            
            return fullText.trim();
        } catch (error) {
            console.error('Error parsing PDF:', error);
            throw new Error('Failed to parse PDF file');
        }
    }

    /**
     * Parse a DOCX file using mammoth.js
     * @param {File} file - The DOCX file to parse
     * @returns {Promise<string>} - Promise resolving to the extracted text
     */
    async function parseDOCX(file) {
        try {
            // Check if mammoth.js is loaded
            if (typeof mammoth === 'undefined') {
                // Load mammoth.js dynamically if not already loaded
                await loadMammoth();
            }
            
            // Read the file as ArrayBuffer
            const arrayBuffer = await readFileAsArrayBuffer(file);
            
            // Extract text from the DOCX file
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        } catch (error) {
            console.error('Error parsing DOCX:', error);
            throw new Error('Failed to parse DOCX file');
        }
    }

    /**
     * Parse a TXT file
     * @param {File} file - The TXT file to parse
     * @returns {Promise<string>} - Promise resolving to the extracted text
     */
    async function parseTXT(file) {
        try {
            // Read the file as text
            return await readFileAsText(file);
        } catch (error) {
            console.error('Error parsing TXT:', error);
            throw new Error('Failed to parse TXT file');
        }
    }

    /**
     * Read a file as ArrayBuffer
     * @param {File} file - The file to read
     * @returns {Promise<ArrayBuffer>} - Promise resolving to the file content as ArrayBuffer
     */
    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            
            reader.onerror = function(error) {
                reject(error);
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Read a file as text
     * @param {File} file - The file to read
     * @returns {Promise<string>} - Promise resolving to the file content as text
     */
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            
            reader.onerror = function(error) {
                reject(error);
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Load PDF.js library dynamically
     * @returns {Promise<void>} - Promise resolving when the library is loaded
     */
    function loadPDFJS() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof pdfjsLib !== 'undefined') {
                resolve();
                return;
            }
            
            // Create script elements for PDF.js
            const pdfjsScript = document.createElement('script');
            pdfjsScript.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js';
            pdfjsScript.onload = resolve;
            pdfjsScript.onerror = () => reject(new Error('Failed to load PDF.js'));
            
            // Append scripts to document
            document.head.appendChild(pdfjsScript);
        });
    }

    /**
     * Load mammoth.js library dynamically
     * @returns {Promise<void>} - Promise resolving when the library is loaded
     */
    function loadMammoth() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof mammoth !== 'undefined') {
                resolve();
                return;
            }
            
            // Create script element for mammoth.js
            const mammothScript = document.createElement('script');
            mammothScript.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.5.1/mammoth.browser.min.js';
            mammothScript.onload = resolve;
            mammothScript.onerror = () => reject(new Error('Failed to load mammoth.js'));
            
            // Append script to document
            document.head.appendChild(mammothScript);
        });
    }

    /**
     * Extract sections from resume text
     * @param {string} text - The resume text content
     * @returns {Object} - Object containing extracted sections
     */
    function extractSections(text) {
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

    /**
     * Extract keywords from resume text
     * @param {string} text - The resume text content
     * @returns {Array<string>} - Array of extracted keywords
     */
    function extractKeywords(text) {
        // Common technical skills and keywords
        const technicalKeywords = [
            'javascript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'php', 'swift', 'kotlin',
            'html', 'css', 'sql', 'nosql', 'react', 'angular', 'vue', 'node', 'express',
            'django', 'flask', 'spring', 'asp\\.net', 'laravel', 'rails',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
            'rest', 'graphql', 'api', 'microservices', 'serverless',
            'mongodb', 'mysql', 'postgresql', 'oracle', 'sql server', 'redis',
            'machine learning', 'ai', 'data science', 'big data', 'analytics',
            'agile', 'scrum', 'kanban', 'jira', 'confluence'
        ];
        
        // Common soft skills
        const softKeywords = [
            'communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking',
            'time management', 'organization', 'adaptability', 'flexibility', 'creativity',
            'project management', 'collaboration', 'interpersonal', 'presentation',
            'negotiation', 'conflict resolution', 'decision making', 'mentoring', 'coaching'
        ];
        
        // Combine all keywords
        const allKeywords = [...technicalKeywords, ...softKeywords];
        
        // Extract keywords from text
        const foundKeywords = [];
        const lowerText = text.toLowerCase();
        
        for (const keyword of allKeywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(lowerText)) {
                foundKeywords.push(keyword);
            }
        }
        
        return foundKeywords;
    }

    // Public API
    return {
        parseResume,
        extractSections,
        extractKeywords
    };
})();