/**
 * Skills data and rendering functionality
 * Manages the display of technical skills with visual representations
 */

// Skills data structure - Cloud themed categories
const skillsData = {
    cloud: {
        title: "Cloud & AWS",
        icon: "☁️",
        color: "#667eea",
        skills: [
            { name: "AWS", level: 85 },
            { name: "EC2", level: 82 },
            { name: "Lambda", level: 80 },
            { name: "S3", level: 88 },
            { name: "ECS/EKS", level: 78 },
            { name: "CloudFormation", level: 75 },
            { name: "API Gateway", level: 80 },
            { name: "DynamoDB", level: 76 },
            { name: "CloudFront", level: 74 },
            { name: "IAM", level: 82 },
            { name: "Amazon Bedrock", level: 72 }
        ]
    },
    devops: {
        title: "DevOps & IaC",
        icon: "🚀",
        color: "#764ba2",
        skills: [
            { name: "Docker", level: 88 },
            { name: "Kubernetes", level: 80 },
            { name: "Terraform", level: 75 },
            { name: "Jenkins", level: 82 },
            { name: "GitHub Actions", level: 78 },
            { name: "Ansible", level: 70 },
            { name: "CI/CD Pipelines", level: 85 },
            { name: "Prometheus", level: 72 },
            { name: "Grafana", level: 70 }
        ]
    },
    languages: {
        title: "Languages & Tools",
        icon: "💻",
        color: "#f093fb",
        skills: [
            { name: "Python", level: 80 },
            { name: "Bash", level: 75 },
            { name: "Git", level: 90 },
            { name: "Linux", level: 85 },
            { name: "REST APIs", level: 80 },
            { name: "HTML/CSS/JS", level: 78 }
        ]
    },
    testing: {
        title: "QA & Testing",
        icon: "🧪",
        color: "#f5576c",
        skills: [
            { name: "Selenium", level: 80 },
            { name: "Cypress", level: 75 },
            { name: "Playwright", level: 72 },
            { name: "Postman", level: 85 },
            { name: "TestNG", level: 78 },
            { name: "Maven", level: 74 }
        ]
    }
};

/**
 * Initialize skills section
 */
function initSkills() {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;

    renderSkills(skillsContainer);
    initSkillAnimations();
}

/**
 * Render all skill categories as cloud-themed cards
 */
function renderSkills(container) {
    container.innerHTML = '';
    
    Object.entries(skillsData).forEach(([categoryKey, category]) => {
        const categoryElement = createSkillCategory(categoryKey, category);
        container.appendChild(categoryElement);
    });
}

/**
 * Create a skill category element - cloud card style
 */
function createSkillCategory(categoryKey, category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skills__category glass-card';
    categoryDiv.setAttribute('data-category', categoryKey);
    categoryDiv.style.setProperty('--category-color', category.color);
    
    categoryDiv.innerHTML = `
        <div class="skills__category-header">
            <span class="skills__category-icon" aria-hidden="true">${category.icon}</span>
            <h3 class="skills__category-title">${category.title}</h3>
        </div>
        <div class="skills__cloud">
            ${category.skills.map(skill => createSkillTag(skill, category.color)).join('')}
        </div>
    `;
    
    return categoryDiv;
}

/**
 * Create individual skill tag - cloud bubble style
 */
function createSkillTag(skill, color) {
    // Size based on level: higher level = larger tag
    const sizeClass = skill.level >= 85 ? 'skill-tag--lg' : skill.level >= 75 ? 'skill-tag--md' : 'skill-tag--sm';
    
    return `
        <span class="skill-tag ${sizeClass}" style="--tag-color: ${color}" title="${skill.name} — ${skill.level}%">
            ${skill.name}
        </span>
    `;
}

/**
 * Initialize skill animations using Intersection Observer
 */
function initSkillAnimations() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without Intersection Observer
        animateAllSkills();
        return;
    }

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillCategory(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all skill categories
    document.querySelectorAll('.skills__category').forEach(category => {
        observer.observe(category);
    });
}

/**
 * Animate skills in a category
 */
function animateSkillCategory(categoryElement) {
    const skillItems = categoryElement.querySelectorAll('.skill__item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('skill__item--animated');
            
            const progressBar = item.querySelector('.skill__progress-bar');
            if (progressBar) {
                progressBar.classList.add('skill__progress-bar--animated');
            }
        }, index * 100); // Stagger animation by 100ms
    });
}

/**
 * Animate all skills (fallback)
 */
function animateAllSkills() {
    document.querySelectorAll('.skills__category').forEach(category => {
        animateSkillCategory(category);
    });
}

/**
 * Get skills by category
 */
function getSkillsByCategory(category) {
    return skillsData[category] || null;
}

/**
 * Get all skills as flat array
 */
function getAllSkills() {
    const allSkills = [];
    Object.values(skillsData).forEach(category => {
        category.skills.forEach(skill => {
            allSkills.push({
                ...skill,
                category: category.title
            });
        });
    });
    return allSkills;
}

/**
 * Get recent skills
 */
function getRecentSkills() {
    return getAllSkills().filter(skill => skill.recent);
}

/**
 * Get top skills by level
 */
function getTopSkills(limit = 10) {
    return getAllSkills()
        .sort((a, b) => b.level - a.level)
        .slice(0, limit);
}

// Initialize skills when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSkills();
});

// Export functions for external use
window.SkillsModule = {
    initSkills,
    getSkillsByCategory,
    getAllSkills,
    getRecentSkills,
    getTopSkills,
    skillsData
};