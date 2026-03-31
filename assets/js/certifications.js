/**
 * Certifications data and rendering
 * To add a new certification:
 * 1. Add an entry to the certificationsData array below
 * 2. Optionally drop an image into assets/images/certifications/
 */

const certificationsData = [
    {
        name: "AWS Certified Cloud Practitioner (CLF-C02)",
        issuer: "Amazon Web Services",
        icon: "☁️",
        date: "Oct 2025",
        image: "assets/images/certifications/aws-cloud-practitioner.png"
    },
    {
        name: "Getting Started with DevOps on AWS",
        issuer: "AWS Training & Certification",
        icon: "🚀",
        date: "Sep 2025",
        image: "assets/images/certifications/devops-on-aws.png"
    },
    {
        name: "Migration and Modernization on AWS",
        issuer: "BeSA Cloud Academy",
        icon: "🔄",
        date: "Oct 2025",
        image: "assets/images/certifications/besa-migration-aws.png"
    },
    {
        name: "Testflix 2025 — Participation",
        issuer: "The Test Tribe",
        icon: "🧪",
        date: "Oct 2025",
        image: "assets/images/certifications/testflix-2025.png"
    },
    {
        name: "Microsoft Azure Fundamentals (AZ-900)",
        issuer: "Microsoft",
        icon: "🔷",
        date: "2024",
        image: "assets/images/certifications/azure-fundamentals.png"
    },
    {
        name: "Kiro & AWS Generative AI Workshop",
        issuer: "AI for Bharat Initiative",
        icon: "🤖",
        date: "2025",
        image: "assets/images/certifications/kiro-aws-genai.png"
    }
];

function initCertifications() {
    const container = document.getElementById('certifications-grid');
    if (!container) return;

    if (certificationsData.length === 0) {
        container.innerHTML = '<p class="certifications__empty">Certifications coming soon.</p>';
        return;
    }

    // Create cards
    const cards = certificationsData.map(cert => `
        <div class="cert-card glass-card">
            <div class="cert-card__icon">${cert.icon}</div>
            <h4 class="cert-card__name">${cert.name}</h4>
            <p class="cert-card__issuer">${cert.issuer}</p>
            <span class="cert-card__date">${cert.date}</span>
        </div>
    `).join('');

    // Duplicate for seamless infinite scroll
    container.innerHTML = `
        <div class="cert-scroll">
            <div class="cert-scroll__track">
                ${cards}${cards}
            </div>
        </div>
    `;

    // Pause on hover
    const track = container.querySelector('.cert-scroll__track');
    if (track) {
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }
}

document.addEventListener('DOMContentLoaded', initCertifications);
