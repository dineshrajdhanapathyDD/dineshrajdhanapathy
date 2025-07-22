/**
 * Projects data and management functionality
 * Handles project showcase, filtering, and search functionality
 */

// Project data structure
const projectsData = [
    {
        id: "aws-project-portfolio",
        title: "AWS Project Portfolio",
        description: "Comprehensive collection of AWS projects showcasing cloud architecture, serverless applications, and infrastructure automation.",
        longDescription: "Extensive portfolio of AWS projects demonstrating expertise in cloud architecture, serverless computing, infrastructure automation, and DevOps practices. Includes hands-on implementations of various AWS services and best practices for building scalable, secure, and cost-effective cloud solutions.",
        technologies: ["AWS", "CloudFormation", "Lambda", "S3", "EC2", "RDS", "IAM", "VPC"],
        githubUrl: "https://learn.nextwork.org/positive_purple_innocent_lemon/portfolio",
        liveUrl: "https://learn.nextwork.org/positive_purple_innocent_lemon/portfolio",
        imageUrl: "assets/images/projects/aws-icon.svg", // AWS icon
        featured: true,
        dateCreated: "2024-12-01",
        status: "completed",
        category: "cloud"
    },
    {
        id: "kodekloud-devops-projects",
        title: "KodeKloud DevOps Projects",
        description: "Collection of hands-on DevOps projects covering CI/CD pipelines, container orchestration, infrastructure as code, and automation.",
        longDescription: "Comprehensive series of DevOps projects from KodeKloud platform demonstrating practical implementation of CI/CD pipelines, Kubernetes orchestration, infrastructure automation, and monitoring solutions. Showcases real-world DevOps practices and tools for modern software delivery.",
        technologies: ["Jenkins", "Kubernetes", "Docker", "Ansible", "Terraform", "Git", "Linux"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/kodekloud_DevOps_project",
        liveUrl: null,
        imageUrl: "assets/images/projects/devops-tools-icon.svg", // DevOps tools icon
        featured: true,
        dateCreated: "2024-11-20",
        status: "completed",
        category: "devops"
    },
    {
        id: "aws-serverless-api",
        title: "Three-Tier Architecture Website with CloudFront",
        description: "Scalable serverless website architecture built with AWS CloudFront, S3, and API Gateway for high-performance, cost-effective content delivery.",
        longDescription: "Comprehensive three-tier architecture leveraging AWS CloudFront for global content delivery, S3 for static content hosting, and API Gateway for dynamic backend services. Includes secure routing, caching strategies, and optimized performance for global audiences.",
        technologies: ["AWS CloudFront", "S3", "API Gateway", "Lambda", "CloudFormation", "Route53"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/1%20NETWORKING%20AWS%20CONCEPT/4-Three-Tier%20Architecture%20Website%20Delivery%20with%20CloudFront",
        liveUrl: null,
        imageUrl: "assets/images/projects/lambda-icon.svg", // Lambda icon
        featured: true,
        dateCreated: "2024-11-15",
        status: "completed",
        category: "backend"
    },
    {
        id: "kubernetes-microservices",
        title: "Kubernetes Platform",
        description: "Comprehensive Kubernetes implementation with container orchestration, service discovery, and automated scaling for modern microservices applications.",
        longDescription: "Enterprise-grade Kubernetes platform featuring container orchestration, service discovery, load balancing, and auto-scaling. Includes deployment strategies, resource management, and monitoring solutions for containerized applications.",
        technologies: ["Kubernetes", "Docker", "Helm", "Prometheus", "Grafana", "EKS", "Microservices"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/7.%20KUBERNETES",
        liveUrl: null,
        imageUrl: "assets/images/projects/kubernetes-icon.svg", // Kubernetes icon
        featured: true,
        dateCreated: "2024-09-22",
        status: "completed",
        category: "devops"
    },
    {
        id: "security-concept",
        title: "AWS Security Concepts",
        description: "Comprehensive AWS security implementation covering IAM, encryption, network security, and compliance frameworks for enterprise-grade protection.",
        longDescription: "In-depth exploration of AWS security services and best practices including Identity and Access Management (IAM), encryption strategies, VPC security, and compliance frameworks. Features practical implementations of security controls, monitoring, and incident response procedures.",
        technologies: ["AWS IAM", "KMS", "Security Groups", "WAF", "Shield", "GuardDuty", "CloudTrail"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/4%20SECURITY%20AWS%20CONCEPT",
        liveUrl: null,
        imageUrl: "assets/images/projects/aws-secret-manager-icon.svg", // AWS Secret Manager icon
        featured: false,
        dateCreated: "2024-08-10",
        status: "completed",
        category: "security"
    },
    {
        id: "ci-cd-pipeline",
        title: "DevOps CI/CD Pipeline Series",
        description: "End-to-end CI/CD pipeline implementation with various DevOps tools for automated testing, building, and deployment of applications.",
        longDescription: "Comprehensive DevOps series covering continuous integration and continuous deployment pipelines. Features automated testing, building, and deployment workflows using industry-standard tools. Includes best practices for version control, code quality, and release management.",
        technologies: ["Jenkins", "GitHub Actions", "Docker", "Kubernetes", "AWS CodePipeline", "Terraform", "Ansible"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/3%20DEVOPS%20SERIES",
        liveUrl: null,
        imageUrl: "assets/images/projects/cicd-pipeline-icon.svg", // CI/CD pipeline icon
        featured: true,
        dateCreated: "2024-07-05",
        status: "completed",
        category: "devops"
    },
    {
        id: "cloud-networking",
        title: "AWS Networking Concepts",
        description: "Comprehensive guide to AWS networking services including VPC, subnets, routing, and connectivity options for secure and scalable cloud infrastructure.",
        longDescription: "In-depth exploration of AWS networking services and architectures. Covers VPC design, subnet strategies, routing tables, security groups, NACLs, and connectivity options like VPN and Direct Connect. Includes practical implementations for various network topologies and use cases.",
        technologies: ["AWS VPC", "Subnets", "Route Tables", "Security Groups", "NACLs", "Transit Gateway", "Direct Connect"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/1%20NETWORKING%20AWS%20CONCEPT",
        liveUrl: null,
        imageUrl: "assets/images/projects/vpc-icon.svg", // VPC icon
        featured: true,
        dateCreated: "2024-06-20",
        status: "completed",
        category: "cloud"
    },
    {
        id: "cloud-certification-roadmap",
        title: "Cloud Certification Roadmap",
        description: "Interactive tool for planning cloud certification paths based on skills assessment and career goals.",
        longDescription: "Comprehensive cloud certification planning tool that helps users create personalized certification roadmaps based on their current skills, experience, and career goals. Features skill assessment, career goal definition, interactive certification path visualization, learning resource recommendations, and structured study plan generation.",
        technologies: ["JavaScript", "HTML5", "CSS3", "LocalStorage", "D3.js", "Accessibility", "Responsive Design"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/portfolio/tree/main/certification-roadmap",
        liveUrl: "certification-roadmap.html",
        imageUrl: "assets/images/projects/cloud-certification-icon.svg", // Cloud certification icon
        featured: true,
        dateCreated: "2024-07-20",
        status: "completed",
        category: "tools"
    },
    {
        id: "aws-ai-ml",
        title: "AWS AI-ML RAG Implementation",
        description: "Implementation of Retrieval Augmented Generation (RAG) using AWS AI and ML services for intelligent document processing and question answering.",
        longDescription: "Advanced implementation of Retrieval Augmented Generation (RAG) architecture using AWS AI and ML services. Features document processing, semantic search, and natural language generation capabilities. Demonstrates practical applications for intelligent document analysis and question answering systems.",
        technologies: ["AWS Bedrock", "SageMaker", "Lambda", "S3", "OpenSearch", "LangChain", "Python"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/2%20AI-ML",
        liveUrl: null,
        imageUrl: "assets/images/projects/ai-icon.svg", // AI icon
        featured: true,
        dateCreated: "2024-10-30",
        status: "in-progress",
        category: "ai-ml"
    },
    {
        id: "docker-concepts",
        title: "Docker Containerization",
        description: "Comprehensive guide to Docker containerization including image building, container management, networking, and orchestration strategies.",
        longDescription: "In-depth exploration of Docker containerization technologies and best practices. Covers container fundamentals, image building strategies, multi-container applications, networking, volumes, and orchestration. Includes practical examples and deployment patterns for containerized applications.",
        technologies: ["Docker", "Docker Compose", "Container Registry", "Networking", "Volumes", "Multi-stage Builds", "Security"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/3%20DEVOPS%20SERIES/DOCKER",
        liveUrl: null,
        imageUrl: "assets/images/projects/docker-icon.svg", // Docker icon
        featured: false,
        dateCreated: "2024-05-15",
        status: "completed",
        category: "devops"
    },
    {
        id: "aws-basics",
        title: "AWS Fundamentals",
        description: "Comprehensive introduction to AWS core services and concepts for building cloud-native applications and infrastructure.",
        longDescription: "Foundational guide to AWS services and cloud concepts. Covers compute, storage, database, networking, and security services with practical examples and best practices. Provides a solid understanding of AWS infrastructure design, deployment, and management for various use cases.",
        technologies: ["EC2", "S3", "RDS", "DynamoDB", "IAM", "CloudFormation", "CloudWatch"],
        githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/5%20AWS%20BASIC",
        liveUrl: null,
        imageUrl: "assets/images/projects/aws-basic-ec2-s3-icon.svg", // AWS basic EC2 S3 icon
        featured: false,
        dateCreated: "2024-04-08",
        status: "completed",
        category: "cloud"
    }
];

// Technology categories for filtering
const technologyCategories = {
    frontend: ["React", "Vue.js", "JavaScript", "HTML5", "CSS3", "Chart.js", "D3.js"],
    backend: ["Node.js", "Python", "Express", "FastAPI", "PHP"],
    database: ["MongoDB", "PostgreSQL", "Redis", "Firebase"],
    cloud: ["AWS", "Docker", "Microservices"],
    tools: ["Git", "Webpack", "Jest", "Stripe", "JWT"]
};

/**
 * Initialize projects functionality
 */
function initProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const filterControls = document.getElementById('filter-controls');
    const searchInput = document.getElementById('project-search');
    const noResults = document.getElementById('no-results');

    if (!projectsContainer) return;

    // Render initial projects
    renderProjects(projectsData);

    // Initialize filter controls
    if (filterControls) {
        initFilterControls(filterControls);
    }

    // Initialize search functionality
    if (searchInput) {
        initSearchFunctionality(searchInput);
    }

    // Initialize project interactions
    initProjectInteractions();
}

/**
 * Render projects to the container
 */
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    const noResults = document.getElementById('no-results');

    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    container.innerHTML = projects.map(project => createProjectCard(project)).join('');

    // Add animation classes for entrance effect
    setTimeout(() => {
        container.querySelectorAll('.project-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('project-card--visible');
            }, index * 100);
        });
    }, 50);
}

/**
 * Create project card HTML
 */
function createProjectCard(project) {
    const statusBadge = project.status === 'in-progress'
        ? '<span class="project__badge project__badge--progress">In Progress</span>'
        : '';

    const featuredBadge = project.featured
        ? '<span class="project__badge project__badge--featured">Featured</span>'
        : '';

    // Determine which link buttons to show
    let projectLinks = '';

    // For AWS Project Portfolio and KodeKloud projects, show Portfolio button
    if (project.id === "aws-project-portfolio" || project.id === "kodekloud-devops-projects") {
        projectLinks = `
            <a href="${project.githubUrl}" class="project__link project__link--portfolio" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} portfolio">
                <span class="project__link-text">Portfolio</span>
                <span class="project__link-icon" aria-hidden="true">↗</span>
            </a>
        `;
    } else {
        // For other projects, show GitHub button and Live button if available
        const liveLink = project.liveUrl
            ? `<a href="${project.liveUrl}" class="project__link project__link--live" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} live demo">
                 <span class="project__link-text">Live Demo</span>
                 <span class="project__link-icon" aria-hidden="true">↗</span>
               </a>`
            : '';

        projectLinks = `
            <a href="${project.githubUrl}" class="project__link project__link--github" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} source code on GitHub">
                <span class="project__link-text">GitHub</span>
                <span class="project__link-icon" aria-hidden="true">↗</span>
            </a>
            ${liveLink}
        `;
    }

    return `
        <article class="project-card" data-project-id="${project.id}" data-category="${project.category}">
            <div class="project__image-container">
                <img 
                    src="${project.imageUrl}" 
                    alt="${project.title} screenshot" 
                    class="project__image"
                    loading="lazy"
                    onerror="this.src='assets/images/projects/placeholder.jpg'; this.onerror=null;"
                >
                <div class="project__badges">
                    ${featuredBadge}
                    ${statusBadge}
                </div>
                <div class="project__overlay">
                    <div class="project__overlay-content">
                        <p class="project__long-description">${project.longDescription}</p>
                    </div>
                </div>
            </div>
            
            <div class="project__content">
                <header class="project__header">
                    <h3 class="project__title">${project.title}</h3>
                    <time class="project__date" datetime="${project.dateCreated}">
                        ${formatDate(project.dateCreated)}
                    </time>
                </header>
                
                <p class="project__description">${project.description}</p>
                
                <div class="project__technologies">
                    ${project.technologies.map(tech =>
        `<span class="project__tech-tag" data-tech="${tech.toLowerCase()}">${tech}</span>`
    ).join('')}
                </div>
                
                <footer class="project__footer">
                    <div class="project__links">
                        ${projectLinks}
                    </div>
                </footer>
            </div>
        </article>
    `;
}

/**
 * Initialize filter controls
 */
function initFilterControls(container) {
    // Get all unique technologies
    const allTechnologies = [...new Set(projectsData.flatMap(project => project.technologies))].sort();

    // Create filter buttons with proper ARIA attributes
    const filterButtons = allTechnologies.map(tech =>
        `<button class="filter__btn" data-filter="${tech.toLowerCase()}" aria-pressed="false" type="button">${tech}</button>`
    ).join('');

    // Add category filters with proper ARIA attributes
    const categoryButtons = `
        <button class="filter__btn" data-filter="frontend" aria-pressed="false" type="button">Frontend</button>
        <button class="filter__btn" data-filter="backend" aria-pressed="false" type="button">Backend</button>
        <button class="filter__btn" data-filter="full-stack" aria-pressed="false" type="button">Full Stack</button>
    `;

    container.innerHTML = `
        <button class="filter__btn filter__btn--active" data-filter="all" aria-pressed="true" type="button">All</button>
        ${categoryButtons}
        <div class="filter__divider" role="separator" aria-hidden="true"></div>
        ${filterButtons}
    `;

    // Add event listeners
    container.addEventListener('click', handleFilterClick);

    // Add keyboard navigation for filter buttons
    container.addEventListener('keydown', function (event) {
        if (event.target.classList.contains('filter__btn')) {
            const buttons = Array.from(container.querySelectorAll('.filter__btn'));
            const currentIndex = buttons.indexOf(event.target);

            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                    buttons[prevIndex].focus();
                    break;

                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    const nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                    buttons[nextIndex].focus();
                    break;

                case 'Home':
                    event.preventDefault();
                    buttons[0].focus();
                    break;

                case 'End':
                    event.preventDefault();
                    buttons[buttons.length - 1].focus();
                    break;
            }
        }
    });
}

/**
 * Handle filter button clicks
 */
function handleFilterClick(event) {
    if (!event.target.classList.contains('filter__btn')) return;

    const filterValue = event.target.dataset.filter;
    const filterButtons = document.querySelectorAll('.filter__btn');

    // Update active state and ARIA attributes
    filterButtons.forEach(btn => {
        btn.classList.remove('filter__btn--active');
        btn.setAttribute('aria-pressed', 'false');
    });
    event.target.classList.add('filter__btn--active');
    event.target.setAttribute('aria-pressed', 'true');

    // Announce filter change to screen readers
    if (window.AccessibilityModule) {
        const filterText = filterValue === 'all' ? 'all projects' : `projects filtered by ${filterValue}`;
        window.AccessibilityModule.announceToScreenReader(`Now showing ${filterText}`);
    }

    // Dispatch custom event for search integration
    document.dispatchEvent(new CustomEvent('filterChanged', {
        detail: { filter: filterValue }
    }));

    // Filter projects
    const filteredProjects = filterProjects(filterValue);
    renderProjects(filteredProjects);
    updateResultsCount(filteredProjects.length, projectsData.length);

    // Clear search if filter is applied
    const searchInput = document.getElementById('project-search');
    if (searchInput && searchInput.value && filterValue !== 'all') {
        searchInput.value = '';
        updateSearchState(false);
    }
}

/**
 * Filter projects based on criteria
 */
function filterProjects(filterValue) {
    if (filterValue === 'all') {
        return projectsData;
    }

    return projectsData.filter(project => {
        // Check category
        if (project.category === filterValue) return true;

        // Check technologies
        return project.technologies.some(tech =>
            tech.toLowerCase() === filterValue.toLowerCase()
        );
    });
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality(searchInput) {
    let searchTimeout;
    let currentFilter = 'all';

    searchInput.addEventListener('input', function (event) {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchTerm = event.target.value.toLowerCase().trim();
            let results;

            if (searchTerm) {
                // Search within current filter if active
                const baseProjects = currentFilter === 'all' ? projectsData : filterProjects(currentFilter);
                results = searchProjects(searchTerm, baseProjects);
                updateSearchState(true, searchTerm);

                // Announce search results to screen readers
                if (window.AccessibilityModule) {
                    const resultText = results.length === 1 ? 'result' : 'results';
                    window.AccessibilityModule.announceToScreenReader(
                        `Search completed. Found ${results.length} ${resultText} for "${searchTerm}"`
                    );
                }
            } else {
                // No search term, show filtered results
                results = filterProjects(currentFilter);
                updateSearchState(false);

                // Announce that search was cleared
                if (window.AccessibilityModule) {
                    window.AccessibilityModule.announceToScreenReader('Search cleared. Showing all projects.');
                }
            }

            renderProjects(results);
            updateResultsCount(results.length, projectsData.length);
        }, 300);
    });

    // Add keyboard navigation for search
    searchInput.addEventListener('keydown', function (event) {
        // Escape to clear search
        if (event.key === 'Escape') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }

        // Enter to focus first result
        if (event.key === 'Enter') {
            event.preventDefault();
            const firstProject = document.querySelector('.project-card');
            if (firstProject) {
                const firstLink = firstProject.querySelector('a');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        }
    });

    // Clear search functionality
    const clearButton = createClearButton(searchInput);
    searchInput.parentNode.appendChild(clearButton);

    // Store current filter for combined filtering
    document.addEventListener('filterChanged', function (event) {
        currentFilter = event.detail.filter;

        // Re-apply search if there's a search term
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            const baseProjects = currentFilter === 'all' ? projectsData : filterProjects(currentFilter);
            const results = searchProjects(searchTerm, baseProjects);
            renderProjects(results);
            updateResultsCount(results.length, projectsData.length);
        }
    });
}

/**
 * Search projects by title, description, and technologies
 */
function searchProjects(searchTerm, baseProjects = projectsData) {
    if (!searchTerm) return baseProjects;

    return baseProjects.filter(project => {
        const searchableText = [
            project.title,
            project.description,
            project.longDescription,
            ...project.technologies
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm);
    });
}

/**
 * Create clear button for search input
 */
function createClearButton(searchInput) {
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'search__clear';
    clearButton.innerHTML = '×';
    clearButton.setAttribute('aria-label', 'Clear search');
    clearButton.style.display = 'none';

    clearButton.addEventListener('click', function () {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });

    // Show/hide clear button based on input value
    searchInput.addEventListener('input', function () {
        clearButton.style.display = searchInput.value ? 'block' : 'none';
    });

    return clearButton;
}

/**
 * Update search state visual indicators
 */
function updateSearchState(isSearching, searchTerm = '') {
    const searchInput = document.getElementById('project-search');
    const filterControls = document.getElementById('filter-controls');

    if (isSearching) {
        searchInput.classList.add('search__input--active');
        if (filterControls) {
            filterControls.classList.add('filter__controls--searching');
        }
    } else {
        searchInput.classList.remove('search__input--active');
        if (filterControls) {
            filterControls.classList.remove('filter__controls--searching');
        }
    }
}

/**
 * Update results count display
 */
function updateResultsCount(currentCount, totalCount) {
    let resultsCounter = document.getElementById('results-counter');

    if (!resultsCounter) {
        resultsCounter = document.createElement('div');
        resultsCounter.id = 'results-counter';
        resultsCounter.className = 'results-counter';

        const projectsSection = document.querySelector('.projects');
        if (projectsSection) {
            const container = projectsSection.querySelector('.container');
            container.insertBefore(resultsCounter, container.firstChild);
        }
    }

    if (currentCount === totalCount) {
        resultsCounter.style.display = 'none';
    } else {
        resultsCounter.style.display = 'block';
        resultsCounter.innerHTML = `
            <span class="results-counter__text">
                Showing ${currentCount} of ${totalCount} projects
            </span>
        `;
    }
}

/**
 * Initialize project interactions
 */
function initProjectInteractions() {
    document.addEventListener('click', function (event) {
        // Handle technology tag clicks
        if (event.target.classList.contains('project__tech-tag')) {
            const tech = event.target.dataset.tech;
            const filterBtn = document.querySelector(`[data-filter="${tech}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
        }
    });
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
}

/**
 * Get projects by category
 */
function getProjectsByCategory(category) {
    return projectsData.filter(project => project.category === category);
}

/**
 * Get featured projects
 */
function getFeaturedProjects() {
    return projectsData.filter(project => project.featured);
}

/**
 * Get recent projects
 */
function getRecentProjects(limit = 3) {
    return projectsData
        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
        .slice(0, limit);
}

/**
 * Get project by ID
 */
function getProjectById(id) {
    return projectsData.find(project => project.id === id);
}

/**
 * Get all unique technologies
 */
function getAllTechnologies() {
    return [...new Set(projectsData.flatMap(project => project.technologies))].sort();
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initProjects();
});

// Export functions for external use
window.ProjectsModule = {
    initProjects,
    renderProjects,
    filterProjects,
    searchProjects,
    getProjectsByCategory,
    getFeaturedProjects,
    getRecentProjects,
    getProjectById,
    getAllTechnologies,
    projectsData
};/*
*
 * Initialize URL-based filtering and search
 */
function initUrlFiltering() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const searchParam = urlParams.get('search');

    if (filterParam && filterParam !== 'all') {
        const filterBtn = document.querySelector(`[data-filter="${filterParam}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }

    if (searchParam) {
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.value = searchParam;
            searchInput.dispatchEvent(new Event('input'));
        }
    }
}

/**
 * Update URL with current filter and search state
 */
function updateUrl(filter = 'all', search = '') {
    const url = new URL(window.location);

    if (filter && filter !== 'all') {
        url.searchParams.set('filter', filter);
    } else {
        url.searchParams.delete('filter');
    }

    if (search) {
        url.searchParams.set('search', search);
    } else {
        url.searchParams.delete('search');
    }

    // Update URL without page reload
    window.history.replaceState({}, '', url);
}

/**
 * Add keyboard shortcuts for filtering
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (event) {
        // Only activate shortcuts when not typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl/Cmd + F to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            const searchInput = document.getElementById('project-search');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Number keys for quick filter selection
        if (event.key >= '1' && event.key <= '9') {
            const filterButtons = document.querySelectorAll('.filter__btn');
            const index = parseInt(event.key) - 1;
            if (filterButtons[index]) {
                filterButtons[index].click();
            }
        }

        // Escape to clear search and filters
        if (event.key === 'Escape') {
            const searchInput = document.getElementById('project-search');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            } else {
                const allButton = document.querySelector('[data-filter="all"]');
                if (allButton) {
                    allButton.click();
                }
            }
        }
    });
}

/**
 * Add analytics tracking for filtering and search
 */
function trackUserInteraction(type, value) {
    // This would integrate with analytics services like Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'portfolio_interaction', {
            'interaction_type': type,
            'interaction_value': value
        });
    }

    // Console log for development
    console.log(`User interaction: ${type} - ${value}`);
}

/**
 * Enhanced project interactions with analytics
 */
function initEnhancedProjectInteractions() {
    document.addEventListener('click', function (event) {
        // Handle technology tag clicks
        if (event.target.classList.contains('project__tech-tag')) {
            const tech = event.target.dataset.tech;
            const filterBtn = document.querySelector(`[data-filter="${tech}"]`);
            if (filterBtn) {
                filterBtn.click();
                trackUserInteraction('tech_tag_click', tech);
            }
        }

        // Handle project link clicks
        if (event.target.closest('.project__link')) {
            const link = event.target.closest('.project__link');
            const projectCard = link.closest('.project-card');
            const projectId = projectCard?.dataset.projectId;
            const linkType = link.classList.contains('project__link--github') ? 'github' : 'live';

            if (projectId) {
                trackUserInteraction('project_link_click', `${projectId}_${linkType}`);
            }
        }

        // Handle filter button clicks
        if (event.target.classList.contains('filter__btn')) {
            const filter = event.target.dataset.filter;
            trackUserInteraction('filter_click', filter);
            updateUrl(filter);
        }
    });

    // Track search interactions
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function (event) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = event.target.value.trim();
                if (searchTerm) {
                    trackUserInteraction('search', searchTerm);
                    updateUrl('all', searchTerm);
                } else {
                    updateUrl();
                }
            }, 1000); // Track after user stops typing for 1 second
        });
    }
}

/**
 * Initialize all enhanced functionality
 */
function initEnhancedProjects() {
    initProjects();
    initUrlFiltering();
    initKeyboardShortcuts();
    initEnhancedProjectInteractions();

    // Add helpful keyboard shortcuts info
    addKeyboardShortcutsInfo();
}

/**
 * Add keyboard shortcuts information
 */
function addKeyboardShortcutsInfo() {
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'keyboard-shortcuts-info';
    shortcutsInfo.innerHTML = `
        <button class="shortcuts-toggle" aria-label="Show keyboard shortcuts">
            <span class="shortcuts-icon">⌨️</span>
        </button>
        <div class="shortcuts-panel" style="display: none;">
            <h3>Keyboard Shortcuts</h3>
            <ul>
                <li><kbd>Ctrl/Cmd + F</kbd> - Focus search</li>
                <li><kbd>1-9</kbd> - Quick filter selection</li>
                <li><kbd>Escape</kbd> - Clear search/filters</li>
            </ul>
        </div>
    `;

    document.body.appendChild(shortcutsInfo);

    // Toggle shortcuts panel
    const toggle = shortcutsInfo.querySelector('.shortcuts-toggle');
    const panel = shortcutsInfo.querySelector('.shortcuts-panel');

    toggle.addEventListener('click', function () {
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        toggle.setAttribute('aria-expanded', !isVisible);
    });

    // Close panel when clicking outside
    document.addEventListener('click', function (event) {
        if (!shortcutsInfo.contains(event.target)) {
            panel.style.display = 'none';
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Update the initialization to use enhanced version
document.addEventListener('DOMContentLoaded', function () {
    initEnhancedProjects();
});

// Update exports
window.ProjectsModule = {
    ...window.ProjectsModule,
    initEnhancedProjects,
    updateUrl,
    trackUserInteraction
};