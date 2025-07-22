/**
 * Smart Resume Match Feature
 * 
 * This script handles the functionality for the Smart Resume Match feature,
 * including file upload, resume analysis, job matching, resume tailoring,
 * and ATS compatibility checking.
 */

// Main namespace for Resume Match functionality
const ResumeMatch = {
    // State management
    state: {
        currentStep: 'upload',
        resume: null,
        analysisResults: null,
        jobMatches: null,
        tailoringResults: null,
        atsResults: null
    },

    // Initialize the application
    init: function() {
        this.setupEventListeners();
        this.setupDropzone();
        this.initializeStorage();
    },
    
    // Initialize storage system
    initializeStorage: function() {
        if (window.ResumeStorageModule) {
            window.ResumeStorageModule.initStorage()
                .then(() => {
                    console.log('Resume storage initialized');
                    // Check for existing resume data
                    return window.ResumeStorageModule.getResumeData();
                })
                .then(resumeData => {
                    if (resumeData) {
                        console.log('Found existing resume data:', resumeData.name);
                        // Optionally restore previous session
                        // this.restorePreviousSession(resumeData);
                    }
                })
                .catch(error => {
                    console.error('Error initializing storage:', error);
                });
        }
    },

    // Set up event listeners
    setupEventListeners: function() {
        // File input change event
        const fileInput = document.getElementById('resume-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
        }

        // Workflow step navigation
        const workflowSteps = document.querySelectorAll('.resume-workflow__step');
        workflowSteps.forEach(step => {
            step.addEventListener('click', () => {
                const stepName = step.dataset.step;
                if (this.canNavigateToStep(stepName)) {
                    this.navigateToStep(stepName);
                }
            });
        });
    },

    // Set up drag and drop functionality
    setupDropzone: function() {
        const dropzone = document.getElementById('resume-dropzone');
        if (!dropzone) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight dropzone when dragging over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.add('active');
            }, false);
        });

        // Remove highlight when dragging leaves dropzone
        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.remove('active');
            }, false);
        });

        // Handle dropped files
        dropzone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        }, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    },
    
    // Handle file upload
    handleFileUpload: function(file) {
        // Reset error message
        const errorElement = document.getElementById('resume-upload-error');
        errorElement.style.display = 'none';
        errorElement.textContent = '';

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(file.type) && 
            !(fileExtension === 'pdf' || fileExtension === 'docx' || fileExtension === 'txt')) {
            this.showError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            this.showError('File size exceeds 5MB limit. Please upload a smaller file.');
            return;
        }

        // Show progress bar
        const progressContainer = document.getElementById('resume-upload-progress');
        const progressBar = document.getElementById('resume-progress-bar');
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Simulate file upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.processResume(file);
                }, 500);
            }
        }, 200);
    },

    // Process the uploaded resume
    processResume: function(file) {
        // Store the resume file
        this.state.resume = {
            file: file,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadDate: new Date()
        };

        // Check if we have the parser module available
        if (window.ResumeParserModule) {
            this.parseResumeWithModule(file);
        } else {
            // Fallback to basic file reading
            this.readResumeFile(file);
        }
    },
    
    // Parse resume using the ResumeParserModule
    parseResumeWithModule: function(file) {
        try {
            // Parse the resume file
            window.ResumeParserModule.parseResume(file)
                .then(resumeText => {
                    // Store the extracted text
                    this.state.resume.content = resumeText;
                    
                    // Process the resume text
                    this.processResumeText(resumeText);
                    
                    // Navigate to analysis step
                    this.navigateToStep('analysis');
                })
                .catch(error => {
                    console.error('Error parsing resume:', error);
                    this.showError(`Error parsing resume: ${error.message}`);
                    
                    // Fallback to basic file reading
                    this.readResumeFile(file);
                });
        } catch (error) {
            console.error('Error using ResumeParserModule:', error);
            
            // Fallback to basic file reading
            this.readResumeFile(file);
        }
    },
    
    // Basic file reading as fallback
    readResumeFile: function(file) {
        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
            // Store the content
            this.state.resume.content = e.target.result;
            
            // Simulate processing delay
            setTimeout(() => {
                // Generate mock analysis results
                this.generateMockResults();
                
                // Navigate to analysis step
                this.navigateToStep('analysis');
            }, 1500);
        };
        
        reader.onerror = () => {
            this.showError('Error reading file. Please try again.');
        };
        
        // Read the file based on its type
        if (file.type === 'application/pdf') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    },
    
    // Process the extracted resume text
    processResumeText: function(resumeText) {
        try {
            // Analyze the resume if analyzer module is available
            if (window.ResumeAnalyzerModule) {
                this.state.analysisResults = window.ResumeAnalyzerModule.analyzeResume(resumeText);
            }
            
            // Generate job matches if matcher module is available
            if (window.JobMatcherModule) {
                this.state.jobMatches = window.JobMatcherModule.matchJobsForResume(resumeText);
                
                // Generate tailoring recommendations for the top job match
                if (this.state.jobMatches && this.state.jobMatches.jobMatches && 
                    this.state.jobMatches.jobMatches.length > 0) {
                    const topJobMatch = this.state.jobMatches.jobMatches[0];
                    
                    if (window.ResumeTailorModule) {
                        this.state.tailoringResults = window.ResumeTailorModule.tailorResume(resumeText, topJobMatch);
                    }
                    
                    // Generate ATS compatibility analysis
                    if (window.ATSCheckerModule) {
                        this.state.atsResults = window.ATSCheckerModule.checkATSCompatibility(resumeText, topJobMatch);
                    }
                }
            }
            
            // If any module is not available, fall back to mock data
            if (!this.state.analysisResults || !this.state.jobMatches || 
                !this.state.tailoringResults || !this.state.atsResults) {
                this.generateMockResults();
            }
            
            // Save resume data to local storage
            this.saveResumeToStorage();
        } catch (error) {
            console.error('Error processing resume text:', error);
            
            // Fall back to mock data
            this.generateMockResults();
        }
    },
    
    // Generate mock results for demonstration purposes
    generateMockResults: function() {
        // Mock analysis results
        this.state.analysisResults = {
            completionScore: 85,
            sectionScores: {
                contactInfo: 100,
                summary: 90,
                education: 95,
                experience: 80,
                skills: 75
            },
            keywordAnalysis: {
                extractedKeywords: [
                    { keyword: 'JavaScript', relevance: 95, frequency: 8 },
                    { keyword: 'React', relevance: 90, frequency: 6 },
                    { keyword: 'Node.js', relevance: 85, frequency: 5 },
                    { keyword: 'Full Stack', relevance: 80, frequency: 3 },
                    { keyword: 'API', relevance: 75, frequency: 4 }
                ],
                missingKeywords: ['TypeScript', 'AWS', 'Docker']
            },
            readabilityScore: 78,
            issuesDetected: [
                {
                    type: 'content',
                    severity: 'medium',
                    description: 'Experience section could use more quantifiable achievements',
                    location: 'Experience section',
                    recommendation: 'Add metrics and specific outcomes to your achievements'
                },
                {
                    type: 'formatting',
                    severity: 'low',
                    description: 'Inconsistent date formatting',
                    location: 'Throughout document',
                    recommendation: 'Use consistent date format (e.g., MM/YYYY) throughout'
                }
            ],
            strengths: [
                'Strong technical skills section',
                'Clear contact information',
                'Well-structured education section'
            ],
            improvementAreas: [
                'Add more quantifiable achievements',
                'Include more industry-specific keywords',
                'Expand on project descriptions'
            ]
        };

        // Mock job matches
        this.state.jobMatches = {
            jobMatches: [
                {
                    jobTitle: 'Senior Frontend Developer',
                    matchScore: 92,
                    industry: 'Technology',
                    experienceLevel: 'Senior',
                    keySkillMatches: ['JavaScript', 'React', 'HTML/CSS', 'UI/UX'],
                    missingSkills: ['TypeScript', 'Angular'],
                    description: 'Lead frontend development for web applications using React and modern JavaScript.'
                },
                {
                    jobTitle: 'Full Stack Developer',
                    matchScore: 88,
                    industry: 'Technology',
                    experienceLevel: 'Mid-Senior',
                    keySkillMatches: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                    missingSkills: ['GraphQL', 'AWS'],
                    description: 'Develop and maintain full stack web applications using JavaScript technologies.'
                },
                {
                    jobTitle: 'JavaScript Engineer',
                    matchScore: 85,
                    industry: 'Software',
                    experienceLevel: 'Mid-level',
                    keySkillMatches: ['JavaScript', 'ES6+', 'Web APIs'],
                    missingSkills: ['Vue.js', 'Testing'],
                    description: 'Build and optimize JavaScript applications with focus on performance and user experience.'
                }
            ],
            topIndustries: [
                { name: 'Technology', relevance: 95 },
                { name: 'Software', relevance: 90 },
                { name: 'E-commerce', relevance: 75 }
            ],
            recommendedRoles: [
                'UI Developer',
                'Frontend Architect',
                'Web Application Developer'
            ]
        };

        // Mock tailoring recommendations
        this.state.tailoringResults = {
            jobDescription: {
                title: 'Senior Frontend Developer',
                company: 'Tech Innovations Inc.',
                description: 'We are looking for a Senior Frontend Developer with strong React experience to join our team...',
                extractedRequirements: [
                    {
                        category: 'technical',
                        items: ['React', 'JavaScript', 'TypeScript', 'CSS3', 'HTML5', 'Redux']
                    },
                    {
                        category: 'soft',
                        items: ['Communication', 'Team leadership', 'Problem-solving']
                    },
                    {
                        category: 'experience',
                        items: ['5+ years frontend development', '3+ years React']
                    }
                ]
            },
            gapAnalysis: {
                matchedSkills: ['React', 'JavaScript', 'HTML5', 'CSS3'],
                missingSkills: ['TypeScript', 'Redux'],
                overqualifiedAreas: []
            },
            recommendations: [
                {
                    section: 'Summary',
                    currentContent: 'Experienced frontend developer with a passion for creating user-friendly interfaces.',
                    suggestedContent: 'Senior Frontend Developer with 5+ years of experience specializing in React applications and creating user-friendly interfaces.',
                    explanation: 'Align your summary with the job title and highlight your React experience.'
                },
                {
                    section: 'Skills',
                    currentContent: 'JavaScript, React, HTML, CSS, Node.js, MongoDB',
                    suggestedContent: 'React, JavaScript, HTML5, CSS3, Redux, TypeScript, Responsive Design',
                    explanation: 'Prioritize the skills mentioned in the job description and add missing skills if you have them.'
                }
            ],
            keywordsToAdd: ['TypeScript', 'Redux', 'Component Architecture'],
            keywordsToEmphasize: ['React', 'JavaScript', 'Frontend Development'],
            contentToHighlight: ['user interface', 'responsive design', 'performance optimization']
        };     
   // Mock ATS results
        this.state.atsResults = {
            overallScore: 82,
            formatIssues: [
                {
                    type: 'Formatting',
                    description: 'Complex formatting may not parse correctly in ATS',
                    impact: 'Information might be lost or misplaced',
                    recommendation: 'Simplify formatting and use standard headings'
                },
                {
                    type: 'Tables',
                    description: 'Tables detected in skills section',
                    impact: 'ATS may not correctly parse tabular data',
                    recommendation: 'Replace tables with bullet points or simple lists'
                }
            ],
            keywordAnalysis: {
                jobKeywords: ['React', 'JavaScript', 'TypeScript', 'Frontend', 'UI/UX'],
                foundKeywords: [
                    { keyword: 'React', frequency: 6, location: 'Skills, Experience' },
                    { keyword: 'JavaScript', frequency: 8, location: 'Skills, Experience, Projects' },
                    { keyword: 'Frontend', frequency: 4, location: 'Summary, Experience' }
                ],
                missingKeywords: ['TypeScript', 'UI/UX']
            },
            sectionParsingResults: {
                contactInfo: true,
                education: true,
                experience: true,
                skills: false
            },
            improvementRecommendations: [
                'Use standard section headings (e.g., "Experience" instead of "Professional History")',
                'Remove tables, graphics, and complex formatting',
                'Ensure contact information is at the top of the resume',
                'Use standard bullet points for listing items',
                'Include more keywords from the job description'
            ]
        };
    },

    // Display error message
    showError: function(message) {
        const errorElement = document.getElementById('resume-upload-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide progress bar
        const progressContainer = document.getElementById('resume-upload-progress');
        progressContainer.style.display = 'none';
    },

    // Check if navigation to a step is allowed
    canNavigateToStep: function(stepName) {
        // Can always navigate to upload step
        if (stepName === 'upload') return true;
        
        // For other steps, need to have a resume uploaded
        return this.state.resume !== null;
    },

    // Navigate to a specific step
    navigateToStep: function(stepName) {
        // Update current step
        this.state.currentStep = stepName;
        
        // Update workflow UI
        const steps = document.querySelectorAll('.resume-workflow__step');
        steps.forEach(step => {
            if (step.dataset.step === stepName) {
                step.classList.add('resume-workflow__step--active');
            } else {
                step.classList.remove('resume-workflow__step--active');
            }
            
            // Mark previous steps as completed
            const stepOrder = ['upload', 'analysis', 'job-match', 'tailoring', 'ats'];
            const currentIndex = stepOrder.indexOf(stepName);
            const stepIndex = stepOrder.indexOf(step.dataset.step);
            
            if (stepIndex < currentIndex) {
                step.classList.add('resume-workflow__step--completed');
            } else {
                step.classList.remove('resume-workflow__step--completed');
            }
        });
        
        // Show/hide appropriate sections
        const sections = document.querySelectorAll('.resume-section');
        sections.forEach(section => {
            section.hidden = true;
        });
        
        // Show current section
        const currentSection = document.getElementById(`${stepName}-section`);
        if (currentSection) {
            currentSection.hidden = false;
            
            // Render content for the current step
            this.renderStepContent(stepName);
        }
    },

    // Render content for the current step
    renderStepContent: function(stepName) {
        switch (stepName) {
            case 'analysis':
                this.renderAnalysisResults();
                break;
            case 'job-match':
                this.renderJobMatches();
                break;
            case 'tailoring':
                this.renderTailoringResults();
                break;
            case 'ats':
                this.renderATSResults();
                break;
        }
    },

    // Render analysis results
    renderAnalysisResults: function() {
        const container = document.querySelector('.resume-analysis__content');
        if (!container || !this.state.analysisResults) return;
        
        const results = this.state.analysisResults;
        
        // Create HTML content for analysis results
        const html = `
            <div class="resume-analysis__overview">
                <div class="resume-analysis__score-container">
                    <div class="resume-analysis__score">
                        <div class="resume-analysis__score-circle" style="--score: ${results.completionScore}%">
                            <span class="resume-analysis__score-number">${results.completionScore}</span>
                        </div>
                        <div class="resume-analysis__score-label">Overall Score</div>
                    </div>
                </div>
                
                <div class="resume-analysis__summary">
                    <h3 class="resume-analysis__summary-title">Resume Analysis Summary</h3>
                    <p class="resume-analysis__summary-text">
                        Your resume has been analyzed for content quality, structure, and effectiveness.
                        Below are the scores for each section and recommendations for improvement.
                    </p>
                    
                    <div class="resume-analysis__section-scores">
                        <div class="resume-analysis__section-score">
                            <div class="resume-analysis__section-label">Contact Info</div>
                            <div class="resume-analysis__section-bar">
                                <div class="resume-analysis__section-progress" style="width: ${results.sectionScores.contactInfo}%"></div>
                            </div>
                            <div class="resume-analysis__section-value">${results.sectionScores.contactInfo}%</div>
                        </div>
                        <div class="resume-analysis__section-score">
                            <div class="resume-analysis__section-label">Summary</div>
                            <div class="resume-analysis__section-bar">
                                <div class="resume-analysis__section-progress" style="width: ${results.sectionScores.summary}%"></div>
                            </div>
                            <div class="resume-analysis__section-value">${results.sectionScores.summary}%</div>
                        </div>
                        <div class="resume-analysis__section-score">
                            <div class="resume-analysis__section-label">Education</div>
                            <div class="resume-analysis__section-bar">
                                <div class="resume-analysis__section-progress" style="width: ${results.sectionScores.education}%"></div>
                            </div>
                            <div class="resume-analysis__section-value">${results.sectionScores.education}%</div>
                        </div>
                        <div class="resume-analysis__section-score">
                            <div class="resume-analysis__section-label">Experience</div>
                            <div class="resume-analysis__section-bar">
                                <div class="resume-analysis__section-progress" style="width: ${results.sectionScores.experience}%"></div>
                            </div>
                            <div class="resume-analysis__section-value">${results.sectionScores.experience}%</div>
                        </div>
                        <div class="resume-analysis__section-score">
                            <div class="resume-analysis__section-label">Skills</div>
                            <div class="resume-analysis__section-bar">
                                <div class="resume-analysis__section-progress" style="width: ${results.sectionScores.skills}%"></div>
                            </div>
                            <div class="resume-analysis__section-value">${results.sectionScores.skills}%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="resume-analysis__details">
                <div class="resume-analysis__keywords">
                    <h3 class="resume-analysis__details-title">Keyword Analysis</h3>
                    <div class="resume-analysis__keywords-found">
                        <h4 class="resume-analysis__details-subtitle">Top Keywords Found</h4>
                        <ul class="resume-analysis__keywords-list">
                            ${results.keywordAnalysis.extractedKeywords.map(keyword => `
                                <li class="resume-analysis__keyword">
                                    <span class="resume-analysis__keyword-text">${keyword.keyword}</span>
                                    <div class="resume-analysis__keyword-bar">
                                        <div class="resume-analysis__keyword-progress" style="width: ${keyword.relevance}%"></div>
                                    </div>
                                    <span class="resume-analysis__keyword-value">${keyword.relevance}%</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="resume-analysis__keywords-missing">
                        <h4 class="resume-analysis__details-subtitle">Suggested Keywords to Add</h4>
                        <div class="resume-analysis__keywords-tags">
                            ${results.keywordAnalysis.missingKeywords.map(keyword => `
                                <span class="resume-analysis__keyword-tag">${keyword}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="resume-analysis__readability">
                    <h3 class="resume-analysis__details-title">Readability</h3>
                    <div class="resume-analysis__readability-score">
                        <div class="resume-analysis__readability-circle" style="--score: ${results.readabilityScore}%">
                            <span class="resume-analysis__readability-number">${results.readabilityScore}</span>
                        </div>
                        <div class="resume-analysis__readability-label">Readability Score</div>
                    </div>
                    <p class="resume-analysis__readability-description">
                        ${getReadabilityDescription(results.readabilityScore)}
                    </p>
                </div>
                
                <div class="resume-analysis__issues">
                    <h3 class="resume-analysis__details-title">Issues Detected</h3>
                    <div class="resume-analysis__issues-list">
                        ${results.issuesDetected.map(issue => `
                            <div class="resume-analysis__issue resume-analysis__issue--${issue.severity}">
                                <div class="resume-analysis__issue-header">
                                    <span class="resume-analysis__issue-type">${issue.type}</span>
                                    <span class="resume-analysis__issue-severity">${issue.severity}</span>
                                </div>
                                <div class="resume-analysis__issue-description">${issue.description}</div>
                                <div class="resume-analysis__issue-location">Location: ${issue.location}</div>
                                <div class="resume-analysis__issue-recommendation">Recommendation: ${issue.recommendation}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="resume-analysis__strengths-improvements">
                    <div class="resume-analysis__strengths">
                        <h3 class="resume-analysis__details-title">Resume Strengths</h3>
                        <ul class="resume-analysis__list">
                            ${results.strengths.map(strength => `
                                <li class="resume-analysis__list-item">${strength}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="resume-analysis__improvements">
                        <h3 class="resume-analysis__details-title">Areas for Improvement</h3>
                        <ul class="resume-analysis__list">
                            ${results.improvementAreas.map(area => `
                                <li class="resume-analysis__list-item">${area}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="resume-analysis__actions">
                    <button class="resume-analysis__action-button" onclick="ResumeMatch.navigateToStep('job-match')">
                        View Job Matches
                    </button>
                </div>
            </div>
        `;
        
        // Insert the HTML content
        container.innerHTML = html;
        
        // Add animation class
        container.classList.add('fade-in');
        
        // Helper function to get readability description
        function getReadabilityDescription(score) {
            if (score >= 90) {
                return 'Excellent readability. Your resume is clear, concise, and easy to understand.';
            } else if (score >= 80) {
                return 'Good readability. Your resume is generally clear and easy to follow.';
            } else if (score >= 70) {
                return 'Acceptable readability. Consider simplifying some sentences for better clarity.';
            } else if (score >= 60) {
                return 'Fair readability. Your resume could benefit from clearer and more concise language.';
            } else {
                return 'Poor readability. Consider revising your resume with simpler language and shorter sentences.';
            }
        }
    },

    // Render job match results
    renderJobMatches: function() {
        const container = document.querySelector('.job-match__content');
        if (!container || !this.state.jobMatches) return;
        
        const matches = this.state.jobMatches;
        
        // Create HTML content for job matches
        const html = `
            <div class="job-match__overview">
                <div class="job-match__top-industries">
                    <h3 class="job-match__section-title">Top Industries for Your Profile</h3>
                    <div class="job-match__industries-list">
                        ${matches.topIndustries.map(industry => `
                            <div class="job-match__industry">
                                <div class="job-match__industry-name">${industry.name}</div>
                                <div class="job-match__industry-bar">
                                    <div class="job-match__industry-progress" style="width: ${industry.relevance}%"></div>
                                </div>
                                <div class="job-match__industry-value">${industry.relevance}%</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="job-match__recommended-roles">
                    <h3 class="job-match__section-title">Recommended Job Titles</h3>
                    <div class="job-match__roles-tags">
                        ${matches.recommendedRoles.map(role => `
                            <span class="job-match__role-tag">${role}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="job-match__results">
                <h3 class="job-match__section-title">Top Job Matches</h3>
                <div class="job-match__cards">
                    ${matches.jobMatches.map(job => `
                        <div class="job-match__card">
                            <div class="job-match__card-header">
                                <h4 class="job-match__job-title">${job.jobTitle}</h4>
                                <div class="job-match__match-score">
                                    <div class="job-match__match-circle" style="--score: ${job.matchScore}%">
                                        <span class="job-match__match-number">${job.matchScore}%</span>
                                    </div>
                                    <span class="job-match__match-label">Match</span>
                                </div>
                            </div>
                            <div class="job-match__card-body">
                                <div class="job-match__job-info">
                                    <div class="job-match__job-industry">
                                        <span class="job-match__info-label">Industry:</span>
                                        <span class="job-match__info-value">${job.industry}</span>
                                    </div>
                                    <div class="job-match__job-level">
                                        <span class="job-match__info-label">Level:</span>
                                        <span class="job-match__info-value">${job.experienceLevel}</span>
                                    </div>
                                </div>
                                <div class="job-match__job-description">${job.description}</div>
                                <div class="job-match__skills">
                                    <div class="job-match__matched-skills">
                                        <h5 class="job-match__skills-title">Matched Skills</h5>
                                        <div class="job-match__skills-tags">
                                            ${job.keySkillMatches.map(skill => `
                                                <span class="job-match__skill-tag job-match__skill-tag--matched">${skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                    <div class="job-match__missing-skills">
                                        <h5 class="job-match__skills-title">Skills to Develop</h5>
                                        <div class="job-match__skills-tags">
                                            ${job.missingSkills.map(skill => `
                                                <span class="job-match__skill-tag job-match__skill-tag--missing">${skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="job-match__card-footer">
                                <button class="job-match__tailor-button" onclick="ResumeMatch.tailorForJob('${job.jobTitle}')">
                                    Tailor Resume for This Job
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="job-match__actions">
                <button class="job-match__action-button" onclick="ResumeMatch.navigateToStep('tailoring')">
                    Resume Tailoring
                </button>
            </div>
        `;
        
        // Insert the HTML content
        container.innerHTML = html;
        
        // Add animation class
        container.classList.add('fade-in');
    },
    
    // Tailor resume for a specific job
    tailorForJob: function(jobTitle) {
        // Find the job in the job matches
        const job = this.state.jobMatches.jobMatches.find(j => j.jobTitle === jobTitle);
        
        if (job && window.ResumeTailorModule && this.state.resume && this.state.resume.content) {
            // Generate tailoring recommendations for this job
            this.state.tailoringResults = window.ResumeTailorModule.tailorResume(this.state.resume.content, job);
            
            // Generate ATS compatibility analysis for this job
            if (window.ATSCheckerModule) {
                this.state.atsResults = window.ATSCheckerModule.checkATSCompatibility(this.state.resume.content, job);
            }
            
            // Navigate to the tailoring step
            this.navigateToStep('tailoring');
        } else {
            // Navigate to the tailoring step with existing data
            this.navigateToStep('tailoring');
        }
    },

    // Render tailoring results
    renderTailoringResults: function() {
        const container = document.querySelector('.resume-tailoring__content');
        if (!container || !this.state.tailoringResults) return;
        
        const results = this.state.tailoringResults;
        
        // Create HTML content for tailoring results
        const html = `
            <div class="resume-tailoring__job-description">
                <h3 class="resume-tailoring__section-title">Job Description</h3>
                <div class="resume-tailoring__job-header">
                    <div class="resume-tailoring__job-title">${results.jobDescription.title}</div>
                    <div class="resume-tailoring__job-company">${results.jobDescription.company}</div>
                </div>
                <div class="resume-tailoring__job-text">${results.jobDescription.description}</div>
                
                <div class="resume-tailoring__requirements">
                    <h4 class="resume-tailoring__requirements-title">Key Requirements</h4>
                    <div class="resume-tailoring__requirements-categories">
                        ${results.jobDescription.extractedRequirements.map(category => `
                            <div class="resume-tailoring__requirement-category">
                                <h5 class="resume-tailoring__category-title">${category.category.charAt(0).toUpperCase() + category.category.slice(1)}</h5>
                                <ul class="resume-tailoring__requirements-list">
                                    ${category.items.map(item => `
                                        <li class="resume-tailoring__requirement-item">${item}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="resume-tailoring__gap-analysis">
                <h3 class="resume-tailoring__section-title">Skills Gap Analysis</h3>
                <div class="resume-tailoring__skills-comparison">
                    <div class="resume-tailoring__matched-skills">
                        <h4 class="resume-tailoring__skills-title">Matched Skills</h4>
                        <div class="resume-tailoring__skills-tags">
                            ${results.gapAnalysis.matchedSkills.map(skill => `
                                <span class="resume-tailoring__skill-tag resume-tailoring__skill-tag--matched">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="resume-tailoring__missing-skills">
                        <h4 class="resume-tailoring__skills-title">Missing Skills</h4>
                        <div class="resume-tailoring__skills-tags">
                            ${results.gapAnalysis.missingSkills.map(skill => `
                                <span class="resume-tailoring__skill-tag resume-tailoring__skill-tag--missing">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="resume-tailoring__recommendations">
                <h3 class="resume-tailoring__section-title">Tailoring Recommendations</h3>
                <div class="resume-tailoring__recommendations-list">
                    ${results.recommendations.map(recommendation => `
                        <div class="resume-tailoring__recommendation">
                            <div class="resume-tailoring__recommendation-header">
                                <h4 class="resume-tailoring__recommendation-section">${recommendation.section}</h4>
                            </div>
                            <div class="resume-tailoring__recommendation-content">
                                <div class="resume-tailoring__current">
                                    <h5 class="resume-tailoring__content-title">Current Content</h5>
                                    <div class="resume-tailoring__content-text">${recommendation.currentContent}</div>
                                </div>
                                <div class="resume-tailoring__suggested">
                                    <h5 class="resume-tailoring__content-title">Suggested Content</h5>
                                    <div class="resume-tailoring__content-text">${recommendation.suggestedContent}</div>
                                </div>
                                <div class="resume-tailoring__explanation">
                                    <h5 class="resume-tailoring__explanation-title">Why Make This Change</h5>
                                    <div class="resume-tailoring__explanation-text">${recommendation.explanation}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="resume-tailoring__keyword-guidance">
                <h3 class="resume-tailoring__section-title">Keyword Optimization</h3>
                <div class="resume-tailoring__keywords-container">
                    <div class="resume-tailoring__keywords-add">
                        <h4 class="resume-tailoring__keywords-title">Keywords to Add</h4>
                        <div class="resume-tailoring__keywords-tags">
                            ${results.keywordsToAdd.map(keyword => `
                                <span class="resume-tailoring__keyword-tag resume-tailoring__keyword-tag--add">${keyword}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="resume-tailoring__keywords-emphasize">
                        <h4 class="resume-tailoring__keywords-title">Keywords to Emphasize</h4>
                        <div class="resume-tailoring__keywords-tags">
                            ${results.keywordsToEmphasize.map(keyword => `
                                <span class="resume-tailoring__keyword-tag resume-tailoring__keyword-tag--emphasize">${keyword}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="resume-tailoring__actions">
                <button class="resume-tailoring__action-button" onclick="ResumeMatch.navigateToStep('ats')">
                    Check ATS Compatibility
                </button>
                <button class="resume-tailoring__download-button">
                    Download Tailored Resume
                </button>
            </div>
        `;
        
        // Insert the HTML content
        container.innerHTML = html;
        
        // Add animation class
        container.classList.add('fade-in');
    },

    // Render ATS compatibility results
    renderATSResults: function() {
        const container = document.querySelector('.ats-compatibility__content');
        if (!container || !this.state.atsResults) return;
        
        const results = this.state.atsResults;
        
        // Create HTML content for ATS compatibility results
        const html = `
            <div class="ats-compatibility__overview">
                <div class="ats-compatibility__score-container">
                    <div class="ats-compatibility__score">
                        <div class="ats-compatibility__score-circle" style="--score: ${results.overallScore}%">
                            <span class="ats-compatibility__score-number">${results.overallScore}</span>
                        </div>
                        <div class="ats-compatibility__score-label">ATS Score</div>
                    </div>
                </div>
                
                <div class="ats-compatibility__summary">
                    <h3 class="ats-compatibility__summary-title">ATS Compatibility Summary</h3>
                    <p class="ats-compatibility__summary-text">
                        Your resume has been analyzed for compatibility with Applicant Tracking Systems (ATS).
                        ${getATSScoreDescription(results.overallScore)}
                    </p>
                </div>
            </div>
            
            <div class="ats-compatibility__section-parsing">
                <h3 class="ats-compatibility__section-title">Section Parsing Results</h3>
                <p class="ats-compatibility__section-description">
                    How well ATS systems will recognize and parse each section of your resume:
                </p>
                <div class="ats-compatibility__parsing-results">
                    <div class="ats-compatibility__parsing-item ${results.sectionParsingResults.contactInfo ? 'ats-compatibility__parsing-item--success' : 'ats-compatibility__parsing-item--error'}">
                        <div class="ats-compatibility__parsing-icon">
                            ${results.sectionParsingResults.contactInfo ? '✓' : '✗'}
                        </div>
                        <div class="ats-compatibility__parsing-text">Contact Information</div>
                    </div>
                    <div class="ats-compatibility__parsing-item ${results.sectionParsingResults.education ? 'ats-compatibility__parsing-item--success' : 'ats-compatibility__parsing-item--error'}">
                        <div class="ats-compatibility__parsing-icon">
                            ${results.sectionParsingResults.education ? '✓' : '✗'}
                        </div>
                        <div class="ats-compatibility__parsing-text">Education</div>
                    </div>
                    <div class="ats-compatibility__parsing-item ${results.sectionParsingResults.experience ? 'ats-compatibility__parsing-item--success' : 'ats-compatibility__parsing-item--error'}">
                        <div class="ats-compatibility__parsing-icon">
                            ${results.sectionParsingResults.experience ? '✓' : '✗'}
                        </div>
                        <div class="ats-compatibility__parsing-text">Experience</div>
                    </div>
                    <div class="ats-compatibility__parsing-item ${results.sectionParsingResults.skills ? 'ats-compatibility__parsing-item--success' : 'ats-compatibility__parsing-item--error'}">
                        <div class="ats-compatibility__parsing-icon">
                            ${results.sectionParsingResults.skills ? '✓' : '✗'}
                        </div>
                        <div class="ats-compatibility__parsing-text">Skills</div>
                    </div>
                </div>
            </div>
            
            <div class="ats-compatibility__format-issues">
                <h3 class="ats-compatibility__section-title">Format Issues Detected</h3>
                <div class="ats-compatibility__issues-list">
                    ${results.formatIssues.map(issue => `
                        <div class="ats-compatibility__issue">
                            <div class="ats-compatibility__issue-header">
                                <span class="ats-compatibility__issue-type">${issue.type}</span>
                                <span class="ats-compatibility__issue-impact">Impact: ${issue.impact}</span>
                            </div>
                            <div class="ats-compatibility__issue-description">${issue.description}</div>
                            <div class="ats-compatibility__issue-recommendation">${issue.recommendation}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="ats-compatibility__keywords">
                <h3 class="ats-compatibility__section-title">Keyword Analysis</h3>
                <div class="ats-compatibility__keywords-container">
                    <div class="ats-compatibility__keywords-found">
                        <h4 class="ats-compatibility__keywords-title">Keywords Found</h4>
                        <div class="ats-compatibility__keywords-table">
                            <div class="ats-compatibility__keywords-header">
                                <div class="ats-compatibility__keyword-cell">Keyword</div>
                                <div class="ats-compatibility__keyword-cell">Frequency</div>
                                <div class="ats-compatibility__keyword-cell">Location</div>
                            </div>
                            ${results.keywordAnalysis.foundKeywords.map(keyword => `
                                <div class="ats-compatibility__keywords-row">
                                    <div class="ats-compatibility__keyword-cell">${keyword.keyword}</div>
                                    <div class="ats-compatibility__keyword-cell">${keyword.frequency}</div>
                                    <div class="ats-compatibility__keyword-cell">${keyword.location}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="ats-compatibility__keywords-missing">
                        <h4 class="ats-compatibility__keywords-title">Missing Keywords</h4>
                        <div class="ats-compatibility__keywords-tags">
                            ${results.keywordAnalysis.missingKeywords.map(keyword => `
                                <span class="ats-compatibility__keyword-tag">${keyword}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="ats-compatibility__recommendations">
                <h3 class="ats-compatibility__section-title">Improvement Recommendations</h3>
                <ul class="ats-compatibility__recommendations-list">
                    ${results.improvementRecommendations.map(recommendation => `
                        <li class="ats-compatibility__recommendation-item">${recommendation}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="ats-compatibility__actions">
                <button class="ats-compatibility__action-button" onclick="ResumeMatch.navigateToStep('upload')">
                    Upload New Resume
                </button>
                <button class="ats-compatibility__download-button">
                    Download ATS-Optimized Resume
                </button>
            </div>
        `;
        
        // Insert the HTML content
        container.innerHTML = html;
        
        // Add animation class
        container.classList.add('fade-in');
        
        // Helper function to get ATS score description
        function getATSScoreDescription(score) {
            if (score >= 90) {
                return 'Your resume is highly compatible with ATS systems and should pass through automated screenings successfully.';
            } else if (score >= 80) {
                return 'Your resume is generally compatible with ATS systems, but there are a few improvements that could be made.';
            } else if (score >= 70) {
                return 'Your resume may have some issues with ATS compatibility. Consider addressing the recommendations below.';
            } else if (score >= 60) {
                return 'Your resume has several ATS compatibility issues that could prevent it from passing automated screenings.';
            } else {
                return 'Your resume has significant ATS compatibility issues. We strongly recommend addressing the recommendations below.';
            }
        }
    }
};

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    ResumeMatch.init();
});  
  // Save resume data to local storage
    saveResumeToStorage: function() {
        if (window.ResumeStorageModule && this.state.resume) {
            // Create a storage object with resume data
            const resumeData = {
                file: this.state.resume.file,
                name: this.state.resume.name,
                type: this.state.resume.type,
                size: this.state.resume.size,
                uploadDate: this.state.resume.uploadDate,
                content: this.state.resume.content
            };
            
            // Add analysis results if available
            if (this.state.analysisResults) {
                resumeData.analysisResults = this.state.analysisResults;
            }
            
            // Add job matches if available
            if (this.state.jobMatches) {
                resumeData.jobMatches = this.state.jobMatches;
            }
            
            // Add tailoring results if available
            if (this.state.tailoringResults) {
                resumeData.tailoringResults = this.state.tailoringResults;
            }
            
            // Add ATS results if available
            if (this.state.atsResults) {
                resumeData.atsResults = this.state.atsResults;
            }
            
            // Save to local storage
            window.ResumeStorageModule.saveResume(resumeData)
                .then(() => {
                    console.log('Resume data saved to local storage');
                })
                .catch(error => {
                    console.error('Error saving resume data:', error);
                });
        }
    },
    
    // Restore previous session from local storage
    restorePreviousSession: function(resumeData) {
        if (!resumeData) return;
        
        // Restore resume data
        this.state.resume = {
            name: resumeData.name,
            type: resumeData.type,
            size: resumeData.size,
            uploadDate: new Date(resumeData.uploadDate),
            content: resumeData.content
        };
        
        // Restore analysis results
        if (resumeData.analysisResults) {
            this.state.analysisResults = resumeData.analysisResults;
        }
        
        // Restore job matches
        if (resumeData.jobMatches) {
            this.state.jobMatches = resumeData.jobMatches;
        }
        
        // Restore tailoring results
        if (resumeData.tailoringResults) {
            this.state.tailoringResults = resumeData.tailoringResults;
        }
        
        // Restore ATS results
        if (resumeData.atsResults) {
            this.state.atsResults = resumeData.atsResults;
        }
        
        // Navigate to analysis step
        this.navigateToStep('analysis');
    },