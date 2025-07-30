/**
 * Cloud Certification Roadmap - Certification Database
 * 
 * This module provides access to the certification database and query functions.
 * It contains comprehensive information about cloud certifications from major providers.
 */

// Certification Database Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.CertificationDatabase = (function() {
    // Private variables
    let certifications = {};
    let initialized = false;
    
    // Certification categories
    const categories = {
        FOUNDATIONAL: 'foundational',
        ASSOCIATE: 'associate',
        PROFESSIONAL: 'professional',
        SPECIALTY: 'specialty'
    };
    
    // Cloud providers
    const providers = {
        AWS: 'aws',
        AZURE: 'azure',
        GCP: 'gcp',
        MULTICLOUD: 'multicloud'
    };
    
    // Private functions
    function loadCertificationData() {
        // This would typically load from a JSON file or API
        // For now, we'll define the data structure inline
        
        certifications = {
            // AWS Certifications
            aws: {
                foundational: [
                    {
                        id: "aws-cloud-practitioner",
                        name: "AWS Certified Cloud Practitioner",
                        shortName: "Cloud Practitioner",
                        examCode: "CLF-C01",
                        level: "Foundational",
                        description: "Validates overall understanding of the AWS Cloud, independent of specific technical roles.",
                        examDetails: {
                            duration: 90,
                            questionCount: 65,
                            passingScore: 70,
                            format: "Multiple choice, multiple answer",
                            price: 100,
                            languages: ["English", "Japanese", "Korean", "Simplified Chinese"]
                        },
                        topics: [
                            { name: "Cloud Concepts", weight: 26, subtopics: ["AWS Cloud value proposition", "AWS Cloud economics", "Cloud architecture design principles"] },
                            { name: "Security and Compliance", weight: 25, subtopics: ["AWS shared responsibility model", "Security and compliance concepts", "AWS access management"] },
                            { name: "Technology", weight: 33, subtopics: ["AWS services deployment and operation", "AWS global infrastructure", "AWS core services"] },
                            { name: "Billing and Pricing", weight: 16, subtopics: ["AWS pricing models", "Account structures", "Billing and pricing tools"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "6 months of exposure to the AWS Cloud",
                        validity: 3,
                        recertification: "Recertification exam or higher-level certification",
                        relatedCertifications: ["aws-solutions-architect-associate", "aws-developer-associate", "aws-sysops-administrator-associate"],
                        jobRoles: ["Cloud Practitioner", "Sales", "Management", "Finance", "Entry-level IT"],
                        difficulty: 2,
                        preparationTimeHours: {
                            beginner: 80,
                            intermediate: 40,
                            advanced: 20
                        },
                        officialLink: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
                        resources: [
                            {
                                type: "official",
                                name: "AWS Cloud Practitioner Essentials",
                                provider: "AWS Training",
                                cost: "free",
                                url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/"
                            },
                            {
                                type: "practice",
                                name: "AWS Cloud Practitioner Practice Exams",
                                provider: "AWS",
                                cost: "paid",
                                url: "https://aws.amazon.com/certification/certification-prep/"
                            }
                        ],
                        studyGuide: {
                            phase1: {
                                name: "Foundation (Weeks 1-4)",
                                topics: ["Cloud concepts", "AWS global infrastructure", "Core services overview"],
                                resources: ["AWS Cloud Practitioner Essentials", "AWS Whitepapers"]
                            },
                            phase2: {
                                name: "Deep Dive (Weeks 5-8)",
                                topics: ["Security and compliance", "Billing and pricing", "Support plans"],
                                resources: ["AWS Documentation", "Practice exams"]
                            },
                            phase3: {
                                name: "Exam Prep (Weeks 9-12)",
                                topics: ["Practice tests", "Review weak areas", "Exam strategies"],
                                resources: ["Official practice exam", "Community forums"]
                            }
                        }
                    }
                ],
                associate: [
                    {
                        id: "aws-solutions-architect-associate",
                        name: "AWS Certified Solutions Architect - Associate",
                        shortName: "Solutions Architect Associate",
                        examCode: "SAA-C03",
                        level: "Associate",
                        description: "Validates ability to design and implement distributed systems on AWS.",
                        examDetails: {
                            duration: 130,
                            questionCount: 65,
                            passingScore: 72,
                            format: "Multiple choice, multiple answer",
                            price: 150,
                            languages: ["English", "Japanese", "Korean", "Simplified Chinese"]
                        },
                        topics: [
                            { name: "Design Resilient Architectures", weight: 30, subtopics: ["High availability", "Decoupling mechanisms", "Multi-tier architectures"] },
                            { name: "Design High-Performing Architectures", weight: 28, subtopics: ["Storage solutions", "Caching", "Elasticity and scalability"] },
                            { name: "Design Secure Applications and Architectures", weight: 24, subtopics: ["Secure access", "Encryption", "Network security"] },
                            { name: "Design Cost-Optimized Architectures", weight: 18, subtopics: ["Cost-effective resources", "Storage cost optimization", "EC2 cost optimization"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "1+ year of hands-on experience with AWS",
                        validity: 3,
                        recertification: "Recertification exam or higher-level certification",
                        relatedCertifications: ["aws-cloud-practitioner", "aws-solutions-architect-professional"],
                        jobRoles: ["Solutions Architect", "Cloud Architect", "DevOps Engineer"],
                        difficulty: 3,
                        preparationTimeHours: {
                            beginner: 120,
                            intermediate: 80,
                            advanced: 40
                        },
                        officialLink: "https://aws.amazon.com/certification/certified-solutions-architect-associate/"
                    },
                    {
                        id: "aws-developer-associate",
                        name: "AWS Certified Developer - Associate",
                        shortName: "Developer Associate",
                        examCode: "DVA-C02",
                        level: "Associate",
                        description: "Validates technical expertise in developing and maintaining applications on AWS.",
                        examDetails: {
                            duration: 130,
                            questionCount: 65,
                            passingScore: 72,
                            format: "Multiple choice, multiple answer",
                            price: 150,
                            languages: ["English", "Japanese", "Korean", "Simplified Chinese"]
                        },
                        topics: [
                            { name: "Development with AWS Services", weight: 32, subtopics: ["Serverless applications", "AWS SDKs", "API Gateway"] },
                            { name: "Security", weight: 26, subtopics: ["Authentication", "Authorization", "Encryption"] },
                            { name: "Deployment", weight: 24, subtopics: ["CI/CD", "Deployment strategies", "Serverless applications"] },
                            { name: "Troubleshooting and Optimization", weight: 18, subtopics: ["Debugging", "Performance optimization", "Monitoring"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "1+ year of hands-on experience developing applications on AWS",
                        validity: 3,
                        recertification: "Recertification exam or higher-level certification",
                        relatedCertifications: ["aws-cloud-practitioner", "aws-devops-engineer-professional"],
                        jobRoles: ["Developer", "DevOps Engineer", "Software Engineer"],
                        difficulty: 3,
                        preparationTimeHours: {
                            beginner: 120,
                            intermediate: 80,
                            advanced: 40
                        },
                        officialLink: "https://aws.amazon.com/certification/certified-developer-associate/"
                    },
                    {
                        id: "aws-sysops-administrator-associate",
                        name: "AWS Certified SysOps Administrator - Associate",
                        shortName: "SysOps Administrator",
                        examCode: "SOA-C02",
                        level: "Associate",
                        description: "Validates technical expertise in deployment, management, and operations on AWS.",
                        examDetails: {
                            duration: 180,
                            questionCount: 65,
                            passingScore: 72,
                            format: "Multiple choice, multiple answer, and exam labs",
                            price: 150,
                            languages: ["English", "Japanese", "Korean", "Simplified Chinese"]
                        },
                        topics: [
                            { name: "Monitoring and Reporting", weight: 20, subtopics: ["CloudWatch", "Logging", "Alerting"] },
                            { name: "Deployment and Provisioning", weight: 18, subtopics: ["Infrastructure as Code", "Automation", "Resource provisioning"] },
                            { name: "High Availability", weight: 16, subtopics: ["Scaling", "Load balancing", "Multi-AZ deployments"] },
                            { name: "Storage and Data Management", weight: 16, subtopics: ["Backup strategies", "Storage types", "Data lifecycle"] },
                            { name: "Security and Compliance", weight: 16, subtopics: ["Identity management", "Access controls", "Encryption"] },
                            { name: "Networking", weight: 14, subtopics: ["VPC", "Connectivity", "Network security"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "1+ year of hands-on experience with AWS operations",
                        validity: 3,
                        recertification: "Recertification exam or higher-level certification",
                        relatedCertifications: ["aws-cloud-practitioner", "aws-devops-engineer-professional"],
                        jobRoles: ["SysOps Administrator", "Systems Administrator", "Cloud Operations Engineer"],
                        difficulty: 3,
                        preparationTimeHours: {
                            beginner: 120,
                            intermediate: 80,
                            advanced: 40
                        },
                        officialLink: "https://aws.amazon.com/certification/certified-sysops-admin-associate/"
                    }
                ],
                professional: [
                    {
                        id: "aws-solutions-architect-professional",
                        name: "AWS Certified Solutions Architect - Professional",
                        shortName: "Solutions Architect Pro",
                        examCode: "SAP-C02",
                        level: "Professional",
                        description: "Validates advanced technical skills and experience in designing distributed applications and systems on AWS.",
                        examDetails: {
                            duration: 180,
                            questionCount: 75,
                            passingScore: 75,
                            format: "Multiple choice, multiple answer",
                            price: 300,
                            languages: ["English", "Japanese", "Korean", "Simplified Chinese"]
                        },
                        topics: [
                            { name: "Design for Organizational Complexity", weight: 26, subtopics: ["Multi-account architecture", "Cross-account access", "Organizations"] },
                            { name: "Design for New Solutions", weight: 29, subtopics: ["Complex architectures", "Migration strategies", "Hybrid architectures"] },
                            { name: "Migration Planning", weight: 15, subtopics: ["Application migration", "Data migration", "Network migration"] },
                            { name: "Cost Control", weight: 10, subtopics: ["Cost optimization", "Resource optimization", "Billing analysis"] },
                            { name: "Continuous Improvement", weight: 20, subtopics: ["Operational excellence", "Performance optimization", "Reliability improvement"] }
                        ],
                        prerequisites: ["aws-solutions-architect-associate"],
                        recommendedExperience: "2+ years of hands-on experience designing and deploying cloud architecture on AWS",
                        validity: 3,
                        recertification: "Recertification exam",
                        relatedCertifications: ["aws-devops-engineer-professional"],
                        jobRoles: ["Senior Solutions Architect", "Principal Cloud Architect", "Enterprise Architect"],
                        difficulty: 4,
                        preparationTimeHours: {
                            beginner: 200,
                            intermediate: 120,
                            advanced: 80
                        },
                        officialLink: "https://aws.amazon.com/certification/certified-solutions-architect-professional/"
                    },
                    {
                        id: "aws-devops-engineer-professional",
                        name: "AWS Certified DevOps Engineer - Professional",
                        shortName: "DevOps Engineer Pro",
                        examCode: "DOP-C02",
                        level: "Professional",
                        description: "Validates technical expertise in provisioning, operating, and managing distributed application systems on AWS.",
                        examDetails: {
                            duration: 180,
                            questionCount: 75,
                            passingScore: 75,
                            format: "Multiple choice, multiple answer",
                            price: 300,
                            languages: ["English", "Japanese", "Korean", "Simplified Chinese"]
                        },
                        topics: [
                            { name: "SDLC Automation", weight: 22, subtopics: ["CI/CD pipelines", "Testing", "Deployment strategies"] },
                            { name: "Configuration Management and IaC", weight: 19, subtopics: ["Infrastructure as Code", "Configuration management tools", "Resource templating"] },
                            { name: "Resilient Cloud Solutions", weight: 16, subtopics: ["High availability", "Fault tolerance", "Disaster recovery"] },
                            { name: "Monitoring and Logging", weight: 15, subtopics: ["Metrics collection", "Log analysis", "Alerting"] },
                            { name: "Security and Compliance", weight: 14, subtopics: ["Identity and access management", "Data protection", "Compliance validation"] },
                            { name: "Incident and Event Response", weight: 14, subtopics: ["Event management", "Automated remediation", "Troubleshooting"] }
                        ],
                        prerequisites: ["aws-developer-associate", "aws-sysops-administrator-associate"],
                        recommendedExperience: "2+ years of experience provisioning, operating, and managing AWS environments",
                        validity: 3,
                        recertification: "Recertification exam",
                        relatedCertifications: ["aws-solutions-architect-professional"],
                        jobRoles: ["DevOps Engineer", "SRE", "Platform Engineer", "Cloud Automation Engineer"],
                        difficulty: 4,
                        preparationTimeHours: {
                            beginner: 200,
                            intermediate: 120,
                            advanced: 80
                        },
                        officialLink: "https://aws.amazon.com/certification/certified-devops-engineer-professional/"
                    }
                ],
                specialty: [
                    {
                        id: "aws-security-specialty",
                        name: "AWS Certified Security - Specialty",
                        shortName: "Security Specialty",
                        examCode: "SCS-C01",
                        level: "Specialty",
                        description: "Validates technical expertise in security and implementing security controls within the AWS environment.",
                        examDetails: {
                            duration: 170,
                            questionCount: 65,
                            passingScore: 75,
                            format: "Multiple choice, multiple answer",
                            price: 300,
                            languages: ["English", "Japanese", "Korean", "Simplified Chinese"]
                        },
                        topics: [
                            { name: "Incident Response", weight: 12, subtopics: ["Security event management", "Forensics", "Remediation"] },
                            { name: "Logging and Monitoring", weight: 20, subtopics: ["Detection mechanisms", "Log analysis", "Security monitoring"] },
                            { name: "Infrastructure Security", weight: 26, subtopics: ["Network security", "Edge security", "Host security"] },
                            { name: "Identity and Access Management", weight: 20, subtopics: ["Authentication", "Authorization", "Access policies"] },
                            { name: "Data Protection", weight: 22, subtopics: ["Encryption", "Key management", "Data classification"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "2+ years of hands-on experience securing AWS workloads",
                        validity: 3,
                        recertification: "Recertification exam",
                        relatedCertifications: ["aws-solutions-architect-professional", "aws-devops-engineer-professional"],
                        jobRoles: ["Security Engineer", "Security Architect", "Security Analyst", "Security Consultant"],
                        difficulty: 4,
                        preparationTimeHours: {
                            beginner: 180,
                            intermediate: 120,
                            advanced: 80
                        },
                        officialLink: "https://aws.amazon.com/certification/certified-security-specialty/"
                    }
                ]
            },
            
            // Azure Certifications
            azure: {
                foundational: [
                    {
                        id: "azure-fundamentals",
                        name: "Microsoft Certified: Azure Fundamentals",
                        shortName: "Azure Fundamentals",
                        examCode: "AZ-900",
                        level: "Foundational",
                        description: "Validates foundational knowledge of cloud concepts and Azure services, workloads, security, privacy, pricing, and support.",
                        examDetails: {
                            duration: 60,
                            questionCount: 40,
                            passingScore: 70,
                            format: "Multiple choice, multiple answer",
                            price: 99,
                            languages: ["English", "Japanese", "Chinese", "Korean", "German", "French", "Spanish", "Portuguese", "Russian", "Italian"]
                        },
                        topics: [
                            { name: "Cloud Concepts", weight: 20, subtopics: ["Cloud computing benefits", "Cloud service types", "Cloud deployment models"] },
                            { name: "Azure Core Services", weight: 30, subtopics: ["Compute", "Networking", "Storage", "Databases"] },
                            { name: "Security, Privacy, Compliance, and Trust", weight: 25, subtopics: ["Shared responsibility model", "Identity services", "Governance methodologies"] },
                            { name: "Azure Pricing and Support", weight: 25, subtopics: ["Subscriptions", "Cost management", "SLAs", "Service lifecycle"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "No experience required, but general IT knowledge is helpful",
                        validity: 0, // Does not expire
                        recertification: "None required",
                        relatedCertifications: ["azure-administrator", "azure-developer", "azure-ai-fundamentals", "azure-data-fundamentals"],
                        jobRoles: ["IT Professionals", "Business Analysts", "Sales", "Students", "Non-technical roles"],
                        difficulty: 1,
                        preparationTimeHours: {
                            beginner: 40,
                            intermediate: 20,
                            advanced: 10
                        },
                        officialLink: "https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/"
                    }
                ],
                associate: [
                    {
                        id: "azure-administrator",
                        name: "Microsoft Certified: Azure Administrator Associate",
                        shortName: "Azure Administrator",
                        examCode: "AZ-104",
                        level: "Associate",
                        description: "Validates the skills and knowledge to implement, manage, and monitor an organization's Microsoft Azure environment.",
                        examDetails: {
                            duration: 120,
                            questionCount: 55,
                            passingScore: 70,
                            format: "Multiple choice, case studies, labs",
                            price: 165,
                            languages: ["English", "Japanese", "Chinese", "Korean", "German", "French", "Spanish", "Portuguese", "Russian", "Italian"]
                        },
                        topics: [
                            { name: "Manage Azure Identities and Governance", weight: 20, subtopics: ["Azure AD", "RBAC", "Subscriptions", "Governance"] },
                            { name: "Implement and Manage Storage", weight: 15, subtopics: ["Storage accounts", "Blob storage", "File storage", "Storage security"] },
                            { name: "Deploy and Manage Azure Compute Resources", weight: 20, subtopics: ["VMs", "App Services", "Containers", "Azure Kubernetes Service"] },
                            { name: "Configure and Manage Virtual Networking", weight: 25, subtopics: ["VNets", "IP addressing", "Routing", "Load balancing"] },
                            { name: "Monitor and Back Up Azure Resources", weight: 20, subtopics: ["Azure Monitor", "Azure Backup", "Recovery", "Log Analytics"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "6+ months of hands-on experience administering Azure",
                        validity: 1,
                        recertification: "Renewal assessment",
                        relatedCertifications: ["azure-fundamentals", "azure-security-engineer", "azure-network-engineer"],
                        jobRoles: ["Azure Administrator", "Cloud Administrator", "System Administrator", "Infrastructure Engineer"],
                        difficulty: 3,
                        preparationTimeHours: {
                            beginner: 120,
                            intermediate: 80,
                            advanced: 40
                        },
                        officialLink: "https://docs.microsoft.com/en-us/learn/certifications/azure-administrator/"
                    },
                    {
                        id: "azure-developer",
                        name: "Microsoft Certified: Azure Developer Associate",
                        shortName: "Azure Developer",
                        examCode: "AZ-204",
                        level: "Associate",
                        description: "Validates the skills and knowledge to design, build, test, and maintain cloud applications and services on Microsoft Azure.",
                        examDetails: {
                            duration: 120,
                            questionCount: 55,
                            passingScore: 70,
                            format: "Multiple choice, case studies, labs",
                            price: 165,
                            languages: ["English", "Japanese", "Chinese", "Korean", "German", "French", "Spanish", "Portuguese", "Russian", "Italian"]
                        },
                        topics: [
                            { name: "Develop Azure Compute Solutions", weight: 25, subtopics: ["App Service", "Azure Functions", "Containers", "Azure Kubernetes Service"] },
                            { name: "Develop for Azure Storage", weight: 15, subtopics: ["Blob storage", "Cosmos DB", "Table storage", "Storage security"] },
                            { name: "Implement Azure Security", weight: 20, subtopics: ["Authentication", "Authorization", "Managed identities", "Key Vault"] },
                            { name: "Monitor, Troubleshoot, and Optimize Azure Solutions", weight: 15, subtopics: ["Application Insights", "Log Analytics", "Performance tuning"] },
                            { name: "Connect to and Consume Azure Services and Third-party Services", weight: 25, subtopics: ["API Management", "Event-based solutions", "Message-based solutions"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "1-2 years of professional development experience and experience with Azure",
                        validity: 1,
                        recertification: "Renewal assessment",
                        relatedCertifications: ["azure-fundamentals", "azure-solutions-architect"],
                        jobRoles: ["Cloud Developer", "Software Engineer", "DevOps Engineer", "Full Stack Developer"],
                        difficulty: 3,
                        preparationTimeHours: {
                            beginner: 120,
                            intermediate: 80,
                            advanced: 40
                        },
                        officialLink: "https://docs.microsoft.com/en-us/learn/certifications/azure-developer/"
                    }
                ],
                expert: [
                    {
                        id: "azure-solutions-architect",
                        name: "Microsoft Certified: Azure Solutions Architect Expert",
                        shortName: "Azure Solutions Architect",
                        examCode: "AZ-305",
                        level: "Expert",
                        description: "Validates expertise in designing cloud and hybrid solutions that run on Microsoft Azure, including compute, network, storage, monitoring, and security.",
                        examDetails: {
                            duration: 120,
                            questionCount: 60,
                            passingScore: 70,
                            format: "Multiple choice, case studies",
                            price: 165,
                            languages: ["English", "Japanese", "Chinese", "Korean", "German", "French", "Spanish", "Portuguese", "Russian", "Italian"]
                        },
                        topics: [
                            { name: "Design Identity, Governance, and Monitoring Solutions", weight: 25, subtopics: ["Authentication", "Authorization", "Governance", "Monitoring"] },
                            { name: "Design Data Storage Solutions", weight: 25, subtopics: ["Storage accounts", "Data integration", "Database solutions", "Data protection"] },
                            { name: "Design Business Continuity Solutions", weight: 15, subtopics: ["High availability", "Disaster recovery", "Backup strategies", "Data replication"] },
                            { name: "Design Infrastructure Solutions", weight: 35, subtopics: ["Compute solutions", "Network solutions", "Migration strategies", "Application architectures"] }
                        ],
                        prerequisites: ["azure-administrator"],
                        recommendedExperience: "Subject matter expertise in IT operations, including networking, virtualization, identity, security, business continuity, disaster recovery, data platforms, and governance",
                        validity: 1,
                        recertification: "Renewal assessment",
                        relatedCertifications: ["azure-administrator", "azure-security-engineer", "azure-network-engineer"],
                        jobRoles: ["Solutions Architect", "Cloud Architect", "Enterprise Architect", "Senior Technical Consultant"],
                        difficulty: 4,
                        preparationTimeHours: {
                            beginner: 180,
                            intermediate: 120,
                            advanced: 80
                        },
                        officialLink: "https://docs.microsoft.com/en-us/learn/certifications/azure-solutions-architect/"
                    }
                ]
            },
            
            // GCP Certifications
            gcp: {
                foundational: [
                    {
                        id: "gcp-cloud-digital-leader",
                        name: "Google Cloud Digital Leader",
                        shortName: "Cloud Digital Leader",
                        examCode: "Digital Leader",
                        level: "Foundational",
                        description: "Validates ability to articulate the capabilities of Google Cloud core products and services and how they benefit organizations.",
                        examDetails: {
                            duration: 90,
                            questionCount: 50,
                            passingScore: 70,
                            format: "Multiple choice, multiple select",
                            price: 99,
                            languages: ["English", "Japanese"]
                        },
                        topics: [
                            { name: "Digital Transformation with Google Cloud", weight: 25, subtopics: ["Cloud computing concepts", "Business transformation", "Innovation"] },
                            { name: "Innovative Google Cloud Solutions", weight: 25, subtopics: ["Application modernization", "Data solutions", "Infrastructure modernization"] },
                            { name: "Google Cloud Security and Operations", weight: 25, subtopics: ["Security model", "Resource management", "Support options"] },
                            { name: "Google Cloud Value and Adoption", weight: 25, subtopics: ["Business value", "Adoption frameworks", "Cloud economics"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "No experience required, but general IT knowledge is helpful",
                        validity: 2,
                        recertification: "Retake exam",
                        relatedCertifications: ["gcp-cloud-engineer", "gcp-cloud-architect"],
                        jobRoles: ["Business Leaders", "Technical Managers", "Sales", "Analysts", "Non-technical roles"],
                        difficulty: 1,
                        preparationTimeHours: {
                            beginner: 40,
                            intermediate: 20,
                            advanced: 10
                        },
                        officialLink: "https://cloud.google.com/certification/cloud-digital-leader"
                    }
                ],
                associate: [
                    {
                        id: "gcp-cloud-engineer",
                        name: "Google Cloud Associate Cloud Engineer",
                        shortName: "Associate Cloud Engineer",
                        examCode: "Associate Cloud Engineer",
                        level: "Associate",
                        description: "Validates the ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.",
                        examDetails: {
                            duration: 120,
                            questionCount: 50,
                            passingScore: 70,
                            format: "Multiple choice, multiple select",
                            price: 125,
                            languages: ["English", "Japanese"]
                        },
                        topics: [
                            { name: "Setting up a cloud solution environment", weight: 20, subtopics: ["Cloud projects", "Billing", "APIs", "Cloud SDK"] },
                            { name: "Planning and configuring a cloud solution", weight: 20, subtopics: ["Compute resources", "Data storage", "Network resources"] },
                            { name: "Deploying and implementing a cloud solution", weight: 20, subtopics: ["Deployment", "Cloud Run", "Kubernetes Engine", "App Engine"] },
                            { name: "Ensuring successful operation of a cloud solution", weight: 20, subtopics: ["Monitoring", "Logging", "Service management"] },
                            { name: "Configuring access and security", weight: 20, subtopics: ["IAM", "Service accounts", "Audit logs", "Data protection"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "6+ months of hands-on experience with Google Cloud",
                        validity: 2,
                        recertification: "Retake exam",
                        relatedCertifications: ["gcp-cloud-digital-leader", "gcp-cloud-architect", "gcp-cloud-developer"],
                        jobRoles: ["Cloud Engineer", "Cloud Administrator", "DevOps Engineer", "Cloud Operations"],
                        difficulty: 3,
                        preparationTimeHours: {
                            beginner: 120,
                            intermediate: 80,
                            advanced: 40
                        },
                        officialLink: "https://cloud.google.com/certification/cloud-engineer"
                    }
                ],
                professional: [
                    {
                        id: "gcp-cloud-architect",
                        name: "Google Cloud Professional Cloud Architect",
                        shortName: "Professional Cloud Architect",
                        examCode: "Professional Cloud Architect",
                        level: "Professional",
                        description: "Validates the ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions to drive business objectives.",
                        examDetails: {
                            duration: 120,
                            questionCount: 50,
                            passingScore: 70,
                            format: "Multiple choice, multiple select, case studies",
                            price: 200,
                            languages: ["English", "Japanese"]
                        },
                        topics: [
                            { name: "Designing and planning a cloud solution architecture", weight: 25, subtopics: ["Business requirements", "Technical requirements", "Constraints"] },
                            { name: "Managing and provisioning solution infrastructure", weight: 25, subtopics: ["Resource management", "Deployment", "Configuration management"] },
                            { name: "Designing for security and compliance", weight: 15, subtopics: ["Identity and access", "Data security", "Regulatory compliance"] },
                            { name: "Analyzing and optimizing technical and business processes", weight: 15, subtopics: ["Performance analysis", "Cost optimization", "Process improvement"] },
                            { name: "Managing implementation", weight: 10, subtopics: ["Solution deployment", "Testing", "Integration"] },
                            { name: "Ensuring solution and operations reliability", weight: 10, subtopics: ["Monitoring", "Incident response", "Business continuity"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "3+ years of industry experience including 1+ years designing and managing solutions using Google Cloud",
                        validity: 2,
                        recertification: "Retake exam",
                        relatedCertifications: ["gcp-cloud-engineer", "gcp-cloud-developer", "gcp-data-engineer"],
                        jobRoles: ["Cloud Architect", "Solutions Architect", "Enterprise Architect", "Technical Lead"],
                        difficulty: 4,
                        preparationTimeHours: {
                            beginner: 180,
                            intermediate: 120,
                            advanced: 80
                        },
                        officialLink: "https://cloud.google.com/certification/cloud-architect"
                    },
                    {
                        id: "gcp-cloud-developer",
                        name: "Google Cloud Professional Cloud Developer",
                        shortName: "Professional Cloud Developer",
                        examCode: "Professional Cloud Developer",
                        level: "Professional",
                        description: "Validates the ability to build scalable and highly available applications using Google Cloud technologies.",
                        examDetails: {
                            duration: 120,
                            questionCount: 50,
                            passingScore: 70,
                            format: "Multiple choice, multiple select",
                            price: 200,
                            languages: ["English", "Japanese"]
                        },
                        topics: [
                            { name: "Designing highly scalable, available, and reliable cloud-native applications", weight: 25, subtopics: ["Microservices", "Serverless", "Event-driven architecture"] },
                            { name: "Building and testing applications", weight: 25, subtopics: ["Code development", "Testing strategies", "CI/CD pipelines"] },
                            { name: "Deploying applications", weight: 20, subtopics: ["Deployment strategies", "Infrastructure as Code", "Service management"] },
                            { name: "Integrating Google Cloud services", weight: 20, subtopics: ["APIs", "Data processing", "Cloud services integration"] },
                            { name: "Managing application performance monitoring", weight: 10, subtopics: ["Debugging", "Performance tuning", "Logging and monitoring"] }
                        ],
                        prerequisites: [],
                        recommendedExperience: "3+ years of industry experience including 1+ years designing and managing applications using Google Cloud",
                        validity: 2,
                        recertification: "Retake exam",
                        relatedCertifications: ["gcp-cloud-engineer", "gcp-cloud-architect", "gcp-devops-engineer"],
                        jobRoles: ["Cloud Developer", "Software Engineer", "DevOps Engineer", "Full Stack Developer"],
                        difficulty: 4,
                        preparationTimeHours: {
                            beginner: 180,
                            intermediate: 120,
                            advanced: 80
                        },
                        officialLink: "https://cloud.google.com/certification/cloud-developer"
                    }
                ]
            }
        };
        
        initialized = true;
    }
    
    // Public API
    return {
        /**
         * Initialize the certification database
         * @returns {Promise} A promise that resolves when initialization is complete
         */
        initDatabase: function() {
            return new Promise((resolve, reject) => {
                try {
                    loadCertificationData();
                    resolve();
                } catch (error) {
                    console.error('Error initializing certification database:', error);
                    reject(error);
                }
            });
        },
        
        /**
         * Get all certifications
         * @returns {Object} All certification data
         */
        getAllCertifications: function() {
            if (!initialized) {
                loadCertificationData();
            }
            
            return certifications;
        },
        
        /**
         * Get certifications by provider
         * @param {String} provider - The cloud provider (aws, azure, gcp)
         * @returns {Object} Certifications for the specified provider
         */
        getCertificationsByProvider: function(provider) {
            if (!initialized) {
                loadCertificationData();
            }
            
            return certifications[provider.toLowerCase()] || {};
        },
        
        /**
         * Get certification by ID
         * @param {String} certId - The certification ID
         * @returns {Object|null} The certification object or null if not found
         */
        getCertificationById: function(certId) {
            if (!initialized) {
                loadCertificationData();
            }
            
            // Search through all providers and levels
            for (const provider in certifications) {
                for (const level in certifications[provider]) {
                    const cert = certifications[provider][level].find(c => c.id === certId);
                    if (cert) {
                        return cert;
                    }
                }
            }
            
            return null;
        },
        
        /**
         * Get certifications by level
         * @param {String} level - The certification level (foundational, associate, professional, specialty)
         * @param {String} [provider] - Optional provider filter
         * @returns {Array} Array of certifications at the specified level
         */
        getCertificationsByLevel: function(level, provider) {
            if (!initialized) {
                loadCertificationData();
            }
            
            const results = [];
            
            if (provider) {
                // Filter by provider and level
                const providerCerts = certifications[provider.toLowerCase()];
                if (providerCerts && providerCerts[level.toLowerCase()]) {
                    return [...providerCerts[level.toLowerCase()]];
                }
            } else {
                // Get all certifications at the specified level across providers
                for (const provider in certifications) {
                    const providerCerts = certifications[provider];
                    if (providerCerts[level.toLowerCase()]) {
                        results.push(...providerCerts[level.toLowerCase()]);
                    }
                }
            }
            
            return results;
        },
        
        /**
         * Search certifications by keyword
         * @param {String} keyword - The keyword to search for
         * @returns {Array} Array of matching certifications
         */
        searchCertifications: function(keyword) {
            if (!initialized) {
                loadCertificationData();
            }
            
            if (!keyword || keyword.trim() === '') {
                return [];
            }
            
            const results = [];
            const lowerKeyword = keyword.toLowerCase();
            
            // Search through all providers and levels
            for (const provider in certifications) {
                for (const level in certifications[provider]) {
                    certifications[provider][level].forEach(cert => {
                        // Search in name, description, and topics
                        if (
                            cert.name.toLowerCase().includes(lowerKeyword) ||
                            cert.shortName.toLowerCase().includes(lowerKeyword) ||
                            cert.description.toLowerCase().includes(lowerKeyword) ||
                            cert.examCode.toLowerCase().includes(lowerKeyword) ||
                            cert.jobRoles.some(role => role.toLowerCase().includes(lowerKeyword)) ||
                            cert.topics.some(topic => 
                                topic.name.toLowerCase().includes(lowerKeyword) ||
                                topic.subtopics.some(subtopic => subtopic.toLowerCase().includes(lowerKeyword))
                            )
                        ) {
                            results.push(cert);
                        }
                    });
                }
            }
            
            return results;
        },
        
        /**
         * Get prerequisites for a certification
         * @param {String} certId - The certification ID
         * @returns {Array} Array of prerequisite certification objects
         */
        getPrerequisites: function(certId) {
            if (!initialized) {
                loadCertificationData();
            }
            
            const cert = this.getCertificationById(certId);
            if (!cert || !cert.prerequisites || cert.prerequisites.length === 0) {
                return [];
            }
            
            return cert.prerequisites.map(prereqId => this.getCertificationById(prereqId)).filter(Boolean);
        },
        
        /**
         * Get related certifications
         * @param {String} certId - The certification ID
         * @returns {Array} Array of related certification objects
         */
        getRelatedCertifications: function(certId) {
            if (!initialized) {
                loadCertificationData();
            }
            
            const cert = this.getCertificationById(certId);
            if (!cert || !cert.relatedCertifications || cert.relatedCertifications.length === 0) {
                return [];
            }
            
            return cert.relatedCertifications.map(relatedId => this.getCertificationById(relatedId)).filter(Boolean);
        },
        
        /**
         * Compare certifications
         * @param {Array} certIds - Array of certification IDs to compare
         * @returns {Object} Comparison data
         */
        compareCertifications: function(certIds) {
            if (!initialized) {
                loadCertificationData();
            }
            
            if (!certIds || !Array.isArray(certIds) || certIds.length === 0) {
                return null;
            }
            
            const certs = certIds.map(id => this.getCertificationById(id)).filter(Boolean);
            if (certs.length === 0) {
                return null;
            }
            
            // Create comparison object
            const comparison = {
                certifications: certs,
                comparisonPoints: {
                    level: certs.map(c => c.level),
                    examDuration: certs.map(c => c.examDetails.duration),
                    questionCount: certs.map(c => c.examDetails.questionCount),
                    passingScore: certs.map(c => c.examDetails.passingScore),
                    price: certs.map(c => c.examDetails.price),
                    validity: certs.map(c => c.validity),
                    difficulty: certs.map(c => c.difficulty),
                    preparationTime: certs.map(c => c.preparationTimeHours)
                }
            };
            
            return comparison;
        },
        
        /**
         * Get certification categories
         * @returns {Object} Certification categories
         */
        getCategories: function() {
            return { ...categories };
        },
        
        /**
         * Get cloud providers
         * @returns {Object} Cloud providers
         */
        getProviders: function() {
            return { ...providers };
        }
    };
})();