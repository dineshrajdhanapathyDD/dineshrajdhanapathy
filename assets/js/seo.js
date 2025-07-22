/**
 * SEO optimization and structured data functionality
 * Handles metadata, structured data, and SEO enhancements
 */

// SEO configuration
const seoConfig = {
  // Site information
  siteName: "Alex Johnson - Full Stack Developer",
  siteDescription: "Professional portfolio of Alex Johnson, showcasing full stack development projects and technical skills",
  siteUrl: "https://alexjohnson.github.io",
  author: "Alex Johnson",
  
  // Social media
  twitterHandle: "@alexjohnson_dev",
  socialImageUrl: "assets/images/social/social-share.jpg",
  
  // Structured data
  personData: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alex Johnson",
    jobTitle: "Full Stack Developer",
    email: "alex.johnson@example.com",
    telephone: "+1-555-123-4567",
    url: "https://alexjohnson.github.io",
    sameAs: [
      "https://linkedin.com/in/alexjohnson-dev",
      "https://github.com/alexjohnson-dev",
      "https://twitter.com/alexjohnson_dev"
    ],
    knowsAbout: [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Web Development",
      "Full Stack Development"
    ]
  }
};

/**
 * Initialize SEO optimizations
 */
function initSEO() {
  addCanonicalUrls();
  addStructuredData();
  enhanceMetaDescriptions();
  enhanceSocialMediaTags();
  addJsonLdData();
}

/**
 * Add canonical URLs to prevent duplicate content issues
 */
function addCanonicalUrls() {
  const currentPath = window.location.pathname;
  const canonicalUrl = seoConfig.siteUrl + currentPath;
  
  // Check if canonical link already exists
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;
}/**
 *
 Add structured data markup
 */
function addStructuredData() {
  // Add breadcrumb navigation if applicable
  addBreadcrumbData();
  
  // Add website structured data
  addWebsiteData();
  
  // Add person/professional data
  addPersonData();
}

/**
 * Add breadcrumb structured data
 */
function addBreadcrumbData() {
  const currentPath = window.location.pathname;
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": []
  };
  
  // Add home breadcrumb
  breadcrumbData.itemListElement.push({
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": seoConfig.siteUrl
  });
  
  // Add current page breadcrumb
  if (currentPath.includes('projects')) {
    breadcrumbData.itemListElement.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Projects",
      "item": seoConfig.siteUrl + "/projects.html"
    });
  } else if (currentPath.includes('contact')) {
    breadcrumbData.itemListElement.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Contact",
      "item": seoConfig.siteUrl + "/contact.html"
    });
  }
  
  if (breadcrumbData.itemListElement.length > 1) {
    addJsonLdScript('breadcrumb', breadcrumbData);
  }
}

/**
 * Add website structured data
 */
function addWebsiteData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoConfig.siteName,
    "description": seoConfig.siteDescription,
    "url": seoConfig.siteUrl,
    "author": {
      "@type": "Person",
      "name": seoConfig.author
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": seoConfig.siteUrl + "/projects.html?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  
  addJsonLdScript('website', websiteData);
}

/**
 * Add person structured data
 */
function addPersonData() {
  addJsonLdScript('person', seoConfig.personData);
}

/**
 * Enhance meta descriptions based on page content
 */
function enhanceMetaDescriptions() {
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  
  // Set page-specific descriptions if not already set
  if (!metaDescription.content) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('projects')) {
      metaDescription.content = "Explore my portfolio of web development projects, featuring modern JavaScript, React, Node.js, and full-stack applications.";
    } else if (currentPath.includes('contact')) {
      metaDescription.content = "Get in touch with Alex Johnson for web development opportunities, collaborations, or technical consulting services.";
    } else {
      metaDescription.content = seoConfig.siteDescription;
    }
  }
}/**
 * 
Enhance social media meta tags (Open Graph and Twitter Cards)
 */
function enhanceSocialMediaTags() {
  const currentPath = window.location.pathname;
  const currentUrl = seoConfig.siteUrl + currentPath;
  
  // Open Graph tags
  const ogTags = {
    'og:type': 'website',
    'og:site_name': seoConfig.siteName,
    'og:url': currentUrl,
    'og:image': seoConfig.siteUrl + '/' + seoConfig.socialImageUrl,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'Alex Johnson - Full Stack Developer Portfolio'
  };
  
  // Page-specific Open Graph data
  if (currentPath.includes('projects')) {
    ogTags['og:title'] = 'Projects - Alex Johnson';
    ogTags['og:description'] = 'Explore my portfolio of web development projects, featuring modern JavaScript, React, Node.js, and full-stack applications.';
  } else if (currentPath.includes('contact')) {
    ogTags['og:title'] = 'Contact - Alex Johnson';
    ogTags['og:description'] = 'Get in touch with Alex Johnson for web development opportunities, collaborations, or technical consulting services.';
  } else {
    ogTags['og:title'] = seoConfig.siteName;
    ogTags['og:description'] = seoConfig.siteDescription;
  }
  
  // Twitter Card tags
  const twitterTags = {
    'twitter:card': 'summary_large_image',
    'twitter:site': seoConfig.twitterHandle,
    'twitter:creator': seoConfig.twitterHandle,
    'twitter:title': ogTags['og:title'],
    'twitter:description': ogTags['og:description'],
    'twitter:image': ogTags['og:image'],
    'twitter:image:alt': ogTags['og:image:alt']
  };
  
  // Add or update Open Graph tags
  Object.entries(ogTags).forEach(([property, content]) => {
    addOrUpdateMetaTag('property', property, content);
  });
  
  // Add or update Twitter tags
  Object.entries(twitterTags).forEach(([name, content]) => {
    addOrUpdateMetaTag('name', name, content);
  });
}

/**
 * Add or update meta tag
 */
function addOrUpdateMetaTag(attribute, value, content) {
  let metaTag = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, value);
    document.head.appendChild(metaTag);
  }
  metaTag.content = content;
}

/**
 * Add JSON-LD structured data script
 */
function addJsonLdScript(id, data) {
  // Remove existing script if it exists
  const existingScript = document.getElementById(`jsonld-${id}`);
  if (existingScript) {
    existingScript.remove();
  }
  
  // Create new script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = `jsonld-${id}`;
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
}

/**
 * Add JSON-LD data for current page
 */
function addJsonLdData() {
  const currentPath = window.location.pathname;
  
  // Add portfolio/creative work data for projects page
  if (currentPath.includes('projects')) {
    addProjectsJsonLd();
  }
  
  // Add contact page data
  if (currentPath.includes('contact')) {
    addContactJsonLd();
  }
}

/**
 * Add projects page JSON-LD data
 */
function addProjectsJsonLd() {
  const portfolioData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Alex Johnson - Development Portfolio",
    "description": "A collection of web development projects showcasing full-stack development skills",
    "author": seoConfig.personData,
    "url": seoConfig.siteUrl + "/projects.html",
    "genre": "Web Development Portfolio"
  };
  
  addJsonLdScript('portfolio', portfolioData);
}

/**
 * Add contact page JSON-LD data
 */
function addContactJsonLd() {
  const contactData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Alex Johnson",
    "description": "Get in touch with Alex Johnson for web development opportunities",
    "url": seoConfig.siteUrl + "/contact.html",
    "mainEntity": seoConfig.personData
  };
  
  addJsonLdScript('contact', contactData);
}

// Initialize SEO when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSEO);
} else {
  initSEO();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSEO, seoConfig };
}