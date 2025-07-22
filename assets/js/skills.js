/**
 * Skills data and rendering functionality
 * Manages the display of technical skills with visual representations
 */

// Skills data structure
const skillsData = {
    devops: {
        title: "DevOps & Cloud",
        icon: "☁️",
        skills: [
            { name: "AWS", level: 85, recent: false },
            { name: "Kubernetes", level: 80, recent: false },
            { name: "Docker", level: 88, recent: false },
            { name: "Terraform", level: 75, recent: true },
            { name: "Jenkins", level: 82, recent: false },
            { name: "GitHub Actions", level: 78, recent: true },
            { name: "Ansible", level: 70, recent: true },
            { name: "CloudFormation", level: 75, recent: false }
        ]
    },
    qa: {
        title: "QA & Testing",
        icon: "🧪",
        skills: [
            { name: "Selenium", level: 80, recent: false },
            { name: "JUnit", level: 75, recent: false },
            { name: "TestNG", level: 78, recent: false },
            { name: "Postman", level: 85, recent: false },
            { name: "SonarQube", level: 72, recent: true },
            { name: "JMeter", level: 70, recent: true },
            { name: "Cucumber", level: 68, recent: true },
            { name: "Test Automation", level: 82, recent: false }
        ]
    },
    tools: {
        title: "Tools & Technologies",
        icon: "🛠️",
        skills: [
            { name: "Git & GitHub", level: 90, recent: false },
            { name: "Python", level: 80, recent: false },
            { name: "Bash Scripting", level: 75, recent: false },
            { name: "Linux", level: 85, recent: false },
            { name: "Prometheus", level: 72, recent: true },
            { name: "Grafana", level: 70, recent: true },
            { name: "ELK Stack", level: 68, recent: true },
            { name: "REST APIs", level: 80, recent: false }
        ]
    },
    soft: {
        title: "Soft Skills",
        icon: "🤝",
        skills: [
            { name: "Problem Solving", level: 92, recent: false },
            { name: "Team Collaboration", level: 88, recent: false },
            { name: "Communication", level: 85, recent: false },
            { name: "Project Management", level: 78, recent: true },
            { name: "Mentoring", level: 75, recent: true },
            { name: "Agile/Scrum", level: 80, recent: false },
            { name: "Code Review", level: 85, recent: false },
            { name: "Technical Writing", level: 70, recent: true }
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
 * Render all skill categories
 */
function renderSkills(container) {
    container.innerHTML = '';
    
    Object.entries(skillsData).forEach(([categoryKey, category]) => {
        const categoryElement = createSkillCategory(categoryKey, category);
        container.appendChild(categoryElement);
    });
}

/**
 * Create a skill category element
 */
function createSkillCategory(categoryKey, category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skills__category';
    categoryDiv.setAttribute('data-category', categoryKey);
    
    categoryDiv.innerHTML = `
        <div class="skills__category-header">
            <span class="skills__category-icon" aria-hidden="true">${category.icon}</span>
            <h3 class="skills__category-title">${category.title}</h3>
        </div>
        <div class="skills__list">
            ${category.skills.map(skill => createSkillItem(skill)).join('')}
        </div>
    `;
    
    return categoryDiv;
}

/**
 * Create individual skill item HTML
 */
function createSkillItem(skill) {
    const recentBadge = skill.recent ? '<span class="skill__badge skill__badge--recent" aria-label="Recently learned">New</span>' : '';
    
    return `
        <div class="skill__item" data-skill="${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
            <div class="skill__header">
                <span class="skill__name">${skill.name}</span>
                ${recentBadge}
                <span class="skill__level-text" aria-label="Skill level">${skill.level}%</span>
            </div>
            <div class="skill__progress" role="progressbar" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100" aria-label="${skill.name} skill level: ${skill.level}%">
                <div class="skill__progress-bar" style="--skill-level: ${skill.level}%"></div>
            </div>
        </div>
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