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
     * @returns {Array<Object>} - Array of extracted keyword objects with metadata
     */
    function extractKeywords(text) {
        // Common technical skills and keywords by category
        const technicalKeywords = {
            'programming_languages': [
                'javascript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'php', 'swift', 'kotlin',
                'typescript', 'go', 'rust', 'scala', 'perl', 'r', 'matlab', 'bash', 'powershell',
                'objective-c', 'dart', 'lua', 'groovy', 'haskell', 'clojure', 'elixir'
            ],
            'frontend': [
                'html', 'css', 'react', 'angular', 'vue', 'svelte', 'jquery', 'bootstrap',
                'tailwind', 'sass', 'less', 'webpack', 'babel', 'redux', 'next.js', 'gatsby',
                'material-ui', 'styled-components', 'responsive design', 'web accessibility',
                'progressive web apps', 'spa', 'ssr', 'web components'
            ],
            'backend': [
                'node', 'express', 'django', 'flask', 'spring', 'asp\\.net', 'laravel', 'rails',
                'fastapi', 'nest.js', 'graphql', 'rest', 'api', 'microservices', 'serverless',
                'websockets', 'oauth', 'jwt', 'authentication', 'authorization'
            ],
            'database': [
                'sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'oracle', 'sql server', 'redis',
                'dynamodb', 'cassandra', 'couchdb', 'firebase', 'elasticsearch', 'neo4j',
                'mariadb', 'sqlite', 'orm', 'database design', 'data modeling', 'indexing'
            ],
            'devops': [
                'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
                'terraform', 'ansible', 'puppet', 'chef', 'prometheus', 'grafana', 'elk stack',
                'nginx', 'apache', 'linux', 'unix', 'shell scripting', 'infrastructure as code',
                'load balancing', 'auto-scaling', 'monitoring', 'logging'
            ],
            'data_science': [
                'machine learning', 'ai', 'data science', 'big data', 'analytics',
                'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'data visualization',
                'statistical analysis', 'natural language processing', 'computer vision',
                'deep learning', 'neural networks', 'data mining', 'predictive modeling'
            ],
            'project_management': [
                'agile', 'scrum', 'kanban', 'jira', 'confluence', 'trello', 'asana',
                'project planning', 'sprint planning', 'backlog management', 'user stories',
                'product management', 'release management', 'stakeholder management'
            ],
            'mobile': [
                'android', 'ios', 'react native', 'flutter', 'xamarin', 'swift', 'kotlin',
                'mobile development', 'app development', 'responsive design', 'mobile ui',
                'push notifications', 'app store', 'play store', 'mobile testing'
            ],
            'testing': [
                'unit testing', 'integration testing', 'e2e testing', 'test automation',
                'jest', 'mocha', 'cypress', 'selenium', 'junit', 'pytest', 'tdd', 'bdd',
                'qa', 'quality assurance', 'test cases', 'test plans', 'regression testing'
            ],
            'security': [
                'cybersecurity', 'information security', 'penetration testing', 'security audits',
                'encryption', 'authentication', 'authorization', 'oauth', 'jwt', 'ssl/tls',
                'vulnerability assessment', 'security compliance', 'gdpr', 'hipaa', 'pci dss'
            ]
        };
        
        // Common soft skills by category
        const softKeywords = {
            'communication': [
                'communication', 'presentation', 'public speaking', 'technical writing',
                'documentation', 'interpersonal', 'active listening', 'clear communication',
                'stakeholder communication', 'client communication', 'reporting'
            ],
            'collaboration': [
                'teamwork', 'collaboration', 'team player', 'cross-functional', 'pair programming',
                'knowledge sharing', 'mentoring', 'coaching', 'conflict resolution',
                'relationship building', 'remote collaboration'
            ],
            'leadership': [
                'leadership', 'team management', 'people management', 'delegation',
                'decision making', 'strategic thinking', 'vision', 'motivation',
                'performance management', 'team building', 'influencing'
            ],
            'problem_solving': [
                'problem solving', 'critical thinking', 'analytical skills', 'troubleshooting',
                'debugging', 'root cause analysis', 'creative solutions', 'innovation',
                'logical thinking', 'systems thinking', 'design thinking'
            ],
            'work_management': [
                'time management', 'organization', 'prioritization', 'multitasking',
                'attention to detail', 'planning', 'goal setting', 'productivity',
                'self-management', 'resource management', 'deadline management'
            ],
            'adaptability': [
                'adaptability', 'flexibility', 'learning agility', 'continuous learning',
                'resilience', 'change management', 'open-mindedness', 'curiosity',
                'growth mindset', 'handling ambiguity', 'quick learner'
            ]
        };
        
        // Industry-specific keywords
        const industryKeywords = {
            'finance': [
                'financial services', 'banking', 'investment', 'trading', 'fintech',
                'risk management', 'compliance', 'regulatory', 'accounting', 'audit',
                'portfolio management', 'financial analysis', 'blockchain', 'cryptocurrency'
            ],
            'healthcare': [
                'healthcare', 'medical', 'clinical', 'patient care', 'health records',
                'hipaa', 'ehr', 'emr', 'telemedicine', 'healthcare analytics',
                'medical devices', 'pharmaceutical', 'biotechnology', 'health informatics'
            ],
            'ecommerce': [
                'ecommerce', 'retail', 'online shopping', 'payment processing', 'inventory management',
                'shopping cart', 'product catalog', 'order management', 'customer experience',
                'digital marketing', 'conversion optimization', 'merchandising'
            ],
            'education': [
                'education', 'e-learning', 'lms', 'instructional design', 'curriculum development',
                'educational technology', 'assessment', 'student management', 'academic',
                'training', 'teaching', 'course development', 'learning analytics'
            ],
            'manufacturing': [
                'manufacturing', 'supply chain', 'inventory', 'production', 'quality control',
                'logistics', 'procurement', 'erp', 'lean', 'six sigma', 'automation',
                'industrial', 'operations', 'warehouse management'
            ]
        };
        
        // Combine all keyword categories
        const allKeywordCategories = {
            ...technicalKeywords,
            ...softKeywords,
            ...industryKeywords
        };
        
        // Flatten all keywords for initial search
        const allKeywords = Object.values(allKeywordCategories).flat();
        
        // Extract keywords from text
        const foundKeywords = [];
        const lowerText = text.toLowerCase();
        
        // First pass: Find predefined keywords
        for (const keyword of allKeywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(lowerText)) {
                // Find the category for this keyword
                let category = '';
                let type = '';
                
                for (const [techCategory, keywords] of Object.entries(technicalKeywords)) {
                    if (keywords.includes(keyword)) {
                        category = techCategory;
                        type = 'technical';
                        break;
                    }
                }
                
                if (!category) {
                    for (const [softCategory, keywords] of Object.entries(softKeywords)) {
                        if (keywords.includes(keyword)) {
                            category = softCategory;
                            type = 'soft';
                            break;
                        }
                    }
                }
                
                if (!category) {
                    for (const [indCategory, keywords] of Object.entries(industryKeywords)) {
                        if (keywords.includes(keyword)) {
                            category = indCategory;
                            type = 'industry';
                            break;
                        }
                    }
                }
                
                // Count occurrences
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = text.match(regex) || [];
                const frequency = matches.length;
                
                // Calculate context score based on where the keyword appears
                let contextScore = 0;
                const sections = extractSections(text);
                
                // Keywords in skills section get highest score
                if (sections.skills && new RegExp(`\\b${keyword}\\b`, 'i').test(sections.skills)) {
                    contextScore += 3;
                }
                
                // Keywords in experience section get medium score
                if (sections.experience && new RegExp(`\\b${keyword}\\b`, 'i').test(sections.experience)) {
                    contextScore += 2;
                }
                
                // Keywords in summary get lower score
                if (sections.summary && new RegExp(`\\b${keyword}\\b`, 'i').test(sections.summary)) {
                    contextScore += 1;
                }
                
                foundKeywords.push({
                    keyword,
                    type,
                    category,
                    frequency,
                    contextScore,
                    // Calculate a relevance score based on frequency and context
                    relevance: Math.min((frequency * 10) + (contextScore * 15), 100)
                });
            }
        }
        
        // Second pass: Extract potential keywords not in our predefined lists
        // This uses a simple n-gram approach to find potential technical terms
        const sections = extractSections(text);
        const potentialKeywordSections = [sections.skills, sections.experience, sections.summary].filter(Boolean).join(' ');
        
        // Extract n-grams (1-3 words)
        const words = potentialKeywordSections.toLowerCase().split(/\s+/);
        const ngrams = [];
        
        // Generate 1-grams, 2-grams, and 3-grams
        for (let i = 0; i < words.length; i++) {
            // Skip common words and short words
            if (isCommonWord(words[i]) || words[i].length < 3) continue;
            
            // 1-gram
            ngrams.push(words[i]);
            
            // 2-gram
            if (i < words.length - 1 && !isCommonWord(words[i+1])) {
                ngrams.push(`${words[i]} ${words[i+1]}`);
            }
            
            // 3-gram
            if (i < words.length - 2 && !isCommonWord(words[i+1]) && !isCommonWord(words[i+2])) {
                ngrams.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
            }
        }
        
        // Filter and score n-grams
        for (const ngram of ngrams) {
            // Skip if already found in predefined keywords
            if (foundKeywords.some(k => k.keyword.toLowerCase() === ngram)) continue;
            
            // Count occurrences
            const regex = new RegExp(`\\b${escapeRegExp(ngram)}\\b`, 'gi');
            const matches = text.match(regex) || [];
            const frequency = matches.length;
            
            // Only consider terms that appear multiple times or in specific contexts
            if (frequency >= 2 || 
                (sections.skills && new RegExp(`\\b${escapeRegExp(ngram)}\\b`, 'i').test(sections.skills))) {
                
                // Calculate context score
                let contextScore = 0;
                
                // Terms in skills section get highest score
                if (sections.skills && new RegExp(`\\b${escapeRegExp(ngram)}\\b`, 'i').test(sections.skills)) {
                    contextScore += 3;
                }
                
                // Terms in experience section get medium score
                if (sections.experience && new RegExp(`\\b${escapeRegExp(ngram)}\\b`, 'i').test(sections.experience)) {
                    contextScore += 2;
                }
                
                // Terms in summary get lower score
                if (sections.summary && new RegExp(`\\b${escapeRegExp(ngram)}\\b`, 'i').test(sections.summary)) {
                    contextScore += 1;
                }
                
                // Determine likely type based on context
                let type = 'unknown';
                if (sections.skills && new RegExp(`\\b${escapeRegExp(ngram)}\\b`, 'i').test(sections.skills)) {
                    type = 'technical'; // Assume most skills section items are technical
                }
                
                foundKeywords.push({
                    keyword: ngram,
                    type,
                    category: 'other',
                    frequency,
                    contextScore,
                    // Lower base relevance for extracted terms
                    relevance: Math.min((frequency * 8) + (contextScore * 12), 90)
                });
            }
        }
        
        // Sort by relevance (descending)
        foundKeywords.sort((a, b) => b.relevance - a.relevance);
        
        // Find synonyms and related terms
        enrichKeywordsWithSynonyms(foundKeywords);
        
        return foundKeywords;
    }
    
    /**
     * Check if a word is a common English word that should be excluded from keyword extraction
     * @param {string} word - The word to check
     * @returns {boolean} - True if it's a common word to exclude
     */
    function isCommonWord(word) {
        const commonWords = [
            'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
            'his', 'her', 'they', 'from', 'she', 'will', 'one', 'all', 'would', 'there',
            'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make',
            'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
            'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
            'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
            'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
            'because', 'any', 'these', 'give', 'day', 'most', 'was', 'are', 'is', 'am',
            'been', 'being', 'were', 'did', 'has', 'had', 'do', 'does', 'doing', 'a', 'an'
        ];
        
        return commonWords.includes(word.toLowerCase());
    }
    
    /**
     * Escape special characters in a string for use in a regular expression
     * @param {string} string - The string to escape
     * @returns {string} - The escaped string
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * Enrich keywords with synonyms and related terms
     * @param {Array<Object>} keywords - The keywords to enrich
     */
    function enrichKeywordsWithSynonyms(keywords) {
        // Define synonym groups
        const synonymGroups = [
            // Programming languages
            ['javascript', 'js', 'ecmascript'],
            ['python', 'py'],
            ['java', 'jvm'],
            ['c++', 'cpp', 'cplusplus'],
            ['c#', 'csharp', '.net'],
            
            // Frontend
            ['react', 'reactjs', 'react.js'],
            ['angular', 'angularjs', 'angular.js'],
            ['vue', 'vuejs', 'vue.js'],
            
            // Backend
            ['node', 'nodejs', 'node.js'],
            ['express', 'expressjs', 'express.js'],
            
            // Cloud
            ['aws', 'amazon web services', 'amazon cloud'],
            ['azure', 'microsoft azure', 'microsoft cloud'],
            ['gcp', 'google cloud', 'google cloud platform'],
            
            // DevOps
            ['ci/cd', 'continuous integration', 'continuous deployment', 'continuous delivery'],
            ['docker', 'containerization', 'containers'],
            ['kubernetes', 'k8s', 'container orchestration'],
            
            // Data Science
            ['machine learning', 'ml', 'artificial intelligence', 'ai'],
            ['data science', 'data analytics', 'data analysis'],
            
            // Soft Skills
            ['communication', 'verbal skills', 'written communication'],
            ['leadership', 'team leadership', 'people management'],
            ['problem solving', 'troubleshooting', 'analytical thinking'],
            ['time management', 'prioritization', 'scheduling'],
            ['teamwork', 'collaboration', 'team player']
        ];
        
        // Process each keyword
        for (let i = 0; i < keywords.length; i++) {
            const keyword = keywords[i].keyword.toLowerCase();
            
            // Check if this keyword belongs to any synonym group
            for (const group of synonymGroups) {
                if (group.includes(keyword)) {
                    // Add related terms property with other terms from the same group
                    keywords[i].relatedTerms = group.filter(term => term !== keyword);
                    break;
                }
            }
        }
    }

    // Public API
    return {
        parseResume,
        extractSections,
        extractKeywords
    };
})();