/**
 * Complete AWS Certifications Database
 * 
 * This file contains comprehensive details for all current AWS certifications
 * including exam details, topics, prerequisites, and study resources.
 */

window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.AWSCertifications = {
    
    // All current AWS certifications organized by level
    foundational: {
        "aws-cloud-practitioner": {
            id: "aws-cloud-practitioner",
            name: "AWS Certified Cloud Practitioner",
            examCode: "CLF-C02",
            level: "Foundational",
            price: 100,
            duration: 90,
            questions: 65,
            passingScore: 70,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese", "Traditional Chinese", "Bahasa Indonesia", "Spanish", "French", "German", "Italian", "Portuguese"],
            description: "Validates overall understanding of the AWS Cloud, independent of specific technical roles.",
            domains: [
                { name: "Cloud Concepts", weight: "24%" },
                { name: "Security and Compliance", weight: "30%" },
                { name: "Cloud Technology and Services", weight: "34%" },
                { name: "Billing, Pricing, and Support", weight: "12%" }
            ],
            prerequisites: "None",
            experience: "6 months of exposure to AWS Cloud",
            validity: "3 years",
            jobRoles: ["Sales", "Legal", "Marketing", "Business analysts", "Project managers", "AWS Academy students", "Other IT-related professionals"],
            nextSteps: ["Solutions Architect Associate", "Developer Associate", "SysOps Administrator Associate"],
            officialLink: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
        }
    },

    associate: {
        "aws-solutions-architect-associate": {
            id: "aws-solutions-architect-associate",
            name: "AWS Certified Solutions Architect - Associate",
            examCode: "SAA-C03",
            level: "Associate", 
            price: 150,
            duration: 130,
            questions: 65,
            passingScore: 72,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates ability to design and implement distributed systems on AWS.",
            domains: [
                { name: "Design Resilient Architectures", weight: "30%" },
                { name: "Design High-Performing Architectures", weight: "28%" },
                { name: "Design Secure Applications and Architectures", weight: "24%" },
                { name: "Design Cost-Optimized Architectures", weight: "18%" }
            ],
            prerequisites: "None (Cloud Practitioner recommended)",
            experience: "1+ year hands-on experience with AWS",
            validity: "3 years",
            jobRoles: ["Solutions Architect", "Solution Design Engineer"],
            nextSteps: ["Solutions Architect Professional", "Specialty certifications"],
            officialLink: "https://aws.amazon.com/certification/certified-solutions-architect-associate/"
        },

        "aws-developer-associate": {
            id: "aws-developer-associate", 
            name: "AWS Certified Developer - Associate",
            examCode: "DVA-C02",
            level: "Associate",
            price: 150,
            duration: 130,
            questions: 65,
            passingScore: 72,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates technical expertise in developing and maintaining applications on AWS.",
            domains: [
                { name: "Development with AWS Services", weight: "32%" },
                { name: "Security", weight: "26%" },
                { name: "Deployment", weight: "24%" },
                { name: "Troubleshooting and Optimization", weight: "18%" }
            ],
            prerequisites: "None (Cloud Practitioner recommended)",
            experience: "1+ year hands-on experience developing applications on AWS",
            validity: "3 years",
            jobRoles: ["Developer", "DevOps Engineer"],
            nextSteps: ["DevOps Engineer Professional", "Specialty certifications"],
            officialLink: "https://aws.amazon.com/certification/certified-developer-associate/"
        },

        "aws-sysops-administrator-associate": {
            id: "aws-sysops-administrator-associate",
            name: "AWS Certified SysOps Administrator - Associate", 
            examCode: "SOA-C02",
            level: "Associate",
            price: 150,
            duration: 180,
            questions: 65,
            passingScore: 72,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates technical expertise in deployment, management, and operations on AWS.",
            domains: [
                { name: "Monitoring, Logging, and Remediation", weight: "20%" },
                { name: "Reliability and Business Continuity", weight: "16%" },
                { name: "Deployment, Provisioning, and Automation", weight: "18%" },
                { name: "Security and Compliance", weight: "16%" },
                { name: "Networking and Content Delivery", weight: "18%" },
                { name: "Cost and Performance Optimization", weight: "12%" }
            ],
            prerequisites: "None (Cloud Practitioner recommended)",
            experience: "1+ year hands-on experience with AWS operations",
            validity: "3 years",
            jobRoles: ["SysOps Administrator", "System Administrator", "DevOps Engineer"],
            nextSteps: ["DevOps Engineer Professional", "Specialty certifications"],
            officialLink: "https://aws.amazon.com/certification/certified-sysops-admin-associate/",
            examLabs: true,
            labInfo: "Includes hands-on lab exercises in addition to multiple choice questions"
        }
    },

    professional: {
        "aws-solutions-architect-professional": {
            id: "aws-solutions-architect-professional",
            name: "AWS Certified Solutions Architect - Professional",
            examCode: "SAP-C02", 
            level: "Professional",
            price: 300,
            duration: 180,
            questions: 75,
            passingScore: 75,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates advanced technical skills and experience in designing distributed applications and systems on AWS.",
            domains: [
                { name: "Design Solutions for Organizational Complexity", weight: "26%" },
                { name: "Design for New Solutions", weight: "29%" },
                { name: "Migration Planning", weight: "15%" },
                { name: "Cost Control", weight: "10%" },
                { name: "Continuous Improvement for Existing Solutions", weight: "20%" }
            ],
            prerequisites: "Solutions Architect Associate (recommended)",
            experience: "2+ years hands-on experience designing and deploying cloud architecture on AWS",
            validity: "3 years",
            jobRoles: ["Solutions Architect", "Solution Design Engineer"],
            nextSteps: ["Specialty certifications"],
            officialLink: "https://aws.amazon.com/certification/certified-solutions-architect-professional/"
        },

        "aws-devops-engineer-professional": {
            id: "aws-devops-engineer-professional",
            name: "AWS Certified DevOps Engineer - Professional",
            examCode: "DOP-C02",
            level: "Professional", 
            price: 300,
            duration: 180,
            questions: 75,
            passingScore: 75,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates technical expertise in provisioning, operating, and managing distributed application systems on AWS.",
            domains: [
                { name: "SDLC Automation", weight: "22%" },
                { name: "Configuration Management and IaC", weight: "17%" },
                { name: "Resilient Cloud Solutions", weight: "15%" },
                { name: "Monitoring and Logging", weight: "15%" },
                { name: "Incident and Event Response", weight: "14%" },
                { name: "Security and Compliance", weight: "17%" }
            ],
            prerequisites: "Developer Associate or SysOps Administrator Associate (recommended)",
            experience: "2+ years experience provisioning, operating, and managing AWS environments",
            validity: "3 years",
            jobRoles: ["DevOps Engineer", "DevOps Architect", "Operations Engineer", "Site Reliability Engineer"],
            nextSteps: ["Specialty certifications"],
            officialLink: "https://aws.amazon.com/certification/certified-devops-engineer-professional/"
        }
    },

    specialty: {
        "aws-advanced-networking-specialty": {
            id: "aws-advanced-networking-specialty",
            name: "AWS Certified Advanced Networking - Specialty",
            examCode: "ANS-C01",
            level: "Specialty",
            price: 300,
            duration: 170,
            questions: 65,
            passingScore: 75,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates advanced technical skills and experience in designing and implementing AWS and hybrid IT network architectures at scale.",
            domains: [
                { name: "Network Design", weight: "30%" },
                { name: "Network Implementation", weight: "26%" },
                { name: "Network Management and Operation", weight: "20%" },
                { name: "Network Security, Compliance, and Governance", weight: "24%" }
            ],
            prerequisites: "Professional-level certification or Associate-level certification + networking experience",
            experience: "5+ years hands-on experience architecting and implementing network solutions",
            validity: "3 years",
            jobRoles: ["Network Engineer", "Network Architect", "Infrastructure Architect"],
            officialLink: "https://aws.amazon.com/certification/certified-advanced-networking-specialty/"
        },

        "aws-security-specialty": {
            id: "aws-security-specialty",
            name: "AWS Certified Security - Specialty", 
            examCode: "SCS-C02",
            level: "Specialty",
            price: 300,
            duration: 170,
            questions: 65,
            passingScore: 75,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates expertise in creating and implementing security solutions in the AWS Cloud.",
            domains: [
                { name: "Threat Detection and Incident Response", weight: "14%" },
                { name: "Security Logging and Monitoring", weight: "18%" },
                { name: "Infrastructure Security", weight: "20%" },
                { name: "Identity and Access Management", weight: "22%" },
                { name: "Data Protection", weight: "26%" }
            ],
            prerequisites: "Associate-level certification + security experience",
            experience: "2+ years hands-on experience securing AWS workloads",
            validity: "3 years",
            jobRoles: ["Security Engineer", "Security Architect", "Security Analyst"],
            officialLink: "https://aws.amazon.com/certification/certified-security-specialty/"
        },

        "aws-machine-learning-specialty": {
            id: "aws-machine-learning-specialty",
            name: "AWS Certified Machine Learning - Specialty",
            examCode: "MLS-C01", 
            level: "Specialty",
            price: 300,
            duration: 180,
            questions: 65,
            passingScore: 75,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates expertise in building, training, tuning, and deploying machine learning models on AWS.",
            domains: [
                { name: "Data Engineering", weight: "20%" },
                { name: "Exploratory Data Analysis", weight: "24%" },
                { name: "Modeling", weight: "36%" },
                { name: "Machine Learning Implementation and Operations", weight: "20%" }
            ],
            prerequisites: "Associate-level certification + ML/data science experience",
            experience: "1-2 years developing, architecting, or running ML/deep learning workloads on AWS",
            validity: "3 years",
            jobRoles: ["Machine Learning Engineer", "Data Scientist", "Data Engineer"],
            officialLink: "https://aws.amazon.com/certification/certified-machine-learning-specialty/"
        },

        "aws-database-specialty": {
            id: "aws-database-specialty",
            name: "AWS Certified Database - Specialty",
            examCode: "DBS-C01",
            level: "Specialty",
            price: 300,
            duration: 180,
            questions: 65,
            passingScore: 75,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates expertise in recommending, designing, and maintaining optimal AWS database solutions.",
            domains: [
                { name: "Workload-Specific Database Design", weight: "26%" },
                { name: "Deployment and Migration", weight: "20%" },
                { name: "Management and Operations", weight: "18%" },
                { name: "Monitoring and Troubleshooting", weight: "18%" },
                { name: "Database Security", weight: "18%" }
            ],
            prerequisites: "Associate-level certification + database experience",
            experience: "2+ years hands-on experience with on-premises and AWS Cloud-based relational and NoSQL databases",
            validity: "3 years",
            jobRoles: ["Database Engineer", "Database Architect", "Database Administrator"],
            officialLink: "https://aws.amazon.com/certification/certified-database-specialty/"
        },

        "aws-data-analytics-specialty": {
            id: "aws-data-analytics-specialty",
            name: "AWS Certified Data Analytics - Specialty",
            examCode: "DAS-C01",
            level: "Specialty",
            price: 300,
            duration: 180,
            questions: 65,
            passingScore: 75,
            languages: ["English", "Japanese", "Korean", "Simplified Chinese"],
            description: "Validates expertise in designing and implementing AWS data analytics solutions.",
            domains: [
                { name: "Collection", weight: "18%" },
                { name: "Storage and Data Management", weight: "22%" },
                { name: "Processing", weight: "24%" },
                { name: "Analysis and Visualization", weight: "18%" },
                { name: "Security", weight: "18%" }
            ],
            prerequisites: "Associate-level certification + data analytics experience",
            experience: "5+ years experience with common data analytics technologies",
            validity: "3 years",
            jobRoles: ["Data Analyst", "Data Engineer", "Data Architect", "Business Intelligence Developer"],
            officialLink: "https://aws.amazon.com/certification/certified-data-analytics-specialty/"
        },

        "aws-sap-on-aws-specialty": {
            id: "aws-sap-on-aws-specialty", 
            name: "AWS Certified SAP on AWS - Specialty",
            examCode: "PAS-C01",
            level: "Specialty",
            price: 300,
            duration: 170,
            questions: 65,
            passingScore: 75,
            languages: ["English"],
            description: "Validates expertise in designing, implementing, migrating, and operating SAP workloads on AWS.",
            domains: [
                { name: "Design SAP on AWS for New Implementations", weight: "28%" },
                { name: "Design SAP on AWS for Migration", weight: "25%" },
                { name: "Deploy and Provision SAP on AWS", weight: "19%" },
                { name: "Operate and Maintain SAP on AWS", weight: "28%" }
            ],
            prerequisites: "Associate-level certification + SAP experience",
            experience: "2+ years hands-on experience running SAP workloads and 1+ year hands-on experience with AWS",
            validity: "3 years",
            jobRoles: ["SAP Architect", "SAP Engineer", "DevOps Engineer working with SAP"],
            officialLink: "https://aws.amazon.com/certification/certified-sap-on-aws-specialty/"
        }
    },

    // Exam preparation resources and study paths
    studyPaths: {
        "cloud-architect": {
            name: "Cloud Architect Path",
            description: "Design and implement scalable, secure cloud architectures",
            sequence: [
                "aws-cloud-practitioner",
                "aws-solutions-architect-associate", 
                "aws-solutions-architect-professional",
                "aws-security-specialty"
            ],
            totalTime: "12-18 months",
            totalCost: "$850"
        },
        "devops-engineer": {
            name: "DevOps Engineer Path",
            description: "Automate and streamline development and operations",
            sequence: [
                "aws-cloud-practitioner",
                "aws-developer-associate",
                "aws-sysops-administrator-associate", 
                "aws-devops-engineer-professional"
            ],
            totalTime: "12-15 months",
            totalCost: "$700"
        },
        "security-specialist": {
            name: "Security Specialist Path", 
            description: "Secure AWS environments and implement best practices",
            sequence: [
                "aws-cloud-practitioner",
                "aws-solutions-architect-associate",
                "aws-security-specialty"
            ],
            totalTime: "9-12 months",
            totalCost: "$550"
        }
    }
};