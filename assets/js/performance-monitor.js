/**
 * Performance Monitoring and Optimization
 * Tracks Core Web Vitals and provides performance insights
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.thresholds = {
            LCP: 2500,  // Good: < 2.5s
            FID: 100,   // Good: < 100ms
            CLS: 0.1    // Good: < 0.1
        };
        
        this.init();
    }
    
    init() {
        this.observeWebVitals();
        this.monitorResourceLoading();
        this.trackUserInteractions();
        this.setupPerformanceReporting();
    }
    
    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // First Contentful Paint (FCP)
        this.observeFCP();
        
        // Time to Interactive (TTI)
        this.observeTTI();
    }
    
    observeLCP() {
        if (!('PerformanceObserver' in window)) return;
        
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.metrics.LCP = Math.round(lastEntry.startTime);
            this.reportMetric('LCP', this.metrics.LCP);
            
            // Check if LCP is good
            if (this.metrics.LCP > this.thresholds.LCP) {
                this.logPerformanceIssue('LCP', this.metrics.LCP, 'slow');
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
    
    observeFID() {
        if (!('PerformanceObserver' in window)) return;
        
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                const fid = Math.round(entry.processingStart - entry.startTime);
                this.metrics.FID = fid;
                this.reportMetric('FID', fid);
                
                if (fid > this.thresholds.FID) {
                    this.logPerformanceIssue('FID', fid, 'slow');
                }
            });
        }).observe({ entryTypes: ['first-input'] });
    }
    
    observeCLS() {
        if (!('PerformanceObserver' in window)) return;
        
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
                    
                    if (sessionValue &&
                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                        entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                    } else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                    }
                    
                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        this.metrics.CLS = Math.round(clsValue * 1000) / 1000;
                        this.reportMetric('CLS', this.metrics.CLS);
                        
                        if (this.metrics.CLS > this.thresholds.CLS) {
                            this.logPerformanceIssue('CLS', this.metrics.CLS, 'layout-shift');
                        }
                    }
                }
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    observeFCP() {
        if (!('PerformanceObserver' in window)) return;
        
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.FCP = Math.round(entry.startTime);
                    this.reportMetric('FCP', this.metrics.FCP);
                }
            });
        }).observe({ entryTypes: ['paint'] });
    }
    
    observeTTI() {
        // Simplified TTI calculation
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navTiming = performance.getEntriesByType('navigation')[0];
                const tti = navTiming.domContentLoadedEventEnd;
                this.metrics.TTI = Math.round(tti);
                this.reportMetric('TTI', this.metrics.TTI);
            }, 0);
        });
    }
    
    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            // Analyze resource loading
            const analysis = this.analyzeResources(resources);
            this.metrics.resourceAnalysis = analysis;
            
            // Report slow resources
            analysis.slowResources.forEach(resource => {
                this.logPerformanceIssue('slow-resource', resource.duration, resource.name);
            });
            
            // Report large resources
            analysis.largeResources.forEach(resource => {
                this.logPerformanceIssue('large-resource', resource.transferSize, resource.name);
            });
        });
    }
    
    analyzeResources(resources) {
        const analysis = {
            totalResources: resources.length,
            slowResources: [],
            largeResources: [],
            resourceTypes: {},
            totalTransferSize: 0
        };
        
        resources.forEach(resource => {
            // Count by type
            const type = this.getResourceType(resource.name);
            analysis.resourceTypes[type] = (analysis.resourceTypes[type] || 0) + 1;
            
            // Track transfer size
            if (resource.transferSize) {
                analysis.totalTransferSize += resource.transferSize;
            }
            
            // Identify slow resources (> 1s)
            if (resource.duration > 1000) {
                analysis.slowResources.push({
                    name: resource.name,
                    duration: Math.round(resource.duration)
                });
            }
            
            // Identify large resources (> 500KB)
            if (resource.transferSize > 500000) {
                analysis.largeResources.push({
                    name: resource.name,
                    transferSize: Math.round(resource.transferSize / 1024)
                });
            }
        });
        
        return analysis;
    }
    
    getResourceType(url) {
        if (url.includes('.css')) return 'CSS';
        if (url.includes('.js')) return 'JavaScript';
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'Image';
        if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'Font';
        return 'Other';
    }
    
    trackUserInteractions() {
        // Track time to first interaction
        let firstInteraction = null;
        
        const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart'];
        
        const recordFirstInteraction = (event) => {
            if (!firstInteraction) {
                firstInteraction = performance.now();
                this.metrics.timeToFirstInteraction = Math.round(firstInteraction);
                this.reportMetric('TTFI', this.metrics.timeToFirstInteraction);
                
                // Remove listeners after first interaction
                interactionEvents.forEach(eventType => {
                    document.removeEventListener(eventType, recordFirstInteraction, true);
                });
            }
        };
        
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, recordFirstInteraction, true);
        });
    }
    
    setupPerformanceReporting() {
        // Report performance data when page is about to unload
        window.addEventListener('beforeunload', () => {
            this.sendPerformanceReport();
        });
        
        // Also report after 30 seconds for long-lived pages
        setTimeout(() => {
            this.sendPerformanceReport();
        }, 30000);
    }
    
    reportMetric(name, value) {
        console.log(`Performance Metric - ${name}: ${value}${this.getUnit(name)}`);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                name: name,
                value: Math.round(value),
                event_category: 'Performance'
            });
        }
        
        // Custom event for other tracking
        window.dispatchEvent(new CustomEvent('performanceMetric', {
            detail: { name, value }
        }));
    }
    
    getUnit(metricName) {
        switch (metricName) {
            case 'LCP':
            case 'FCP':
            case 'FID':
            case 'TTI':
            case 'TTFI':
                return 'ms';
            case 'CLS':
                return '';
            default:
                return '';
        }
    }
    
    logPerformanceIssue(type, value, details) {
        const issue = {
            type,
            value,
            details,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.warn('Performance Issue:', issue);
        
        // Store issues for reporting
        if (!this.performanceIssues) {
            this.performanceIssues = [];
        }
        this.performanceIssues.push(issue);
    }
    
    sendPerformanceReport() {
        const report = {
            metrics: this.metrics,
            issues: this.performanceIssues || [],
            page: {
                url: window.location.href,
                title: document.title,
                timestamp: Date.now()
            },
            browser: {
                userAgent: navigator.userAgent,
                connection: navigator.connection ? {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink
                } : null
            }
        };
        
        // Send via beacon API if available
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(report)], {
                type: 'application/json'
            });
            navigator.sendBeacon('/api/performance', blob);
        }
        
        // Fallback: log to console
        console.log('Performance Report:', report);
    }
    
    // Public API for manual performance tracking
    mark(name) {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(name);
        }
    }
    
    measure(name, startMark, endMark) {
        if ('performance' in window && 'measure' in performance) {
            performance.measure(name, startMark, endMark);
            
            const measure = performance.getEntriesByName(name, 'measure')[0];
            if (measure) {
                this.reportMetric(name, measure.duration);
            }
        }
    }
    
    // Get current performance summary
    getSummary() {
        return {
            metrics: this.metrics,
            issues: this.performanceIssues || [],
            score: this.calculatePerformanceScore()
        };
    }
    
    calculatePerformanceScore() {
        let score = 100;
        
        // Deduct points for poor metrics
        if (this.metrics.LCP > this.thresholds.LCP) {
            score -= 20;
        }
        if (this.metrics.FID > this.thresholds.FID) {
            score -= 20;
        }
        if (this.metrics.CLS > this.thresholds.CLS) {
            score -= 20;
        }
        
        // Deduct points for issues
        if (this.performanceIssues) {
            score -= Math.min(this.performanceIssues.length * 5, 40);
        }
        
        return Math.max(score, 0);
    }
}

// Performance Budget Checker
class PerformanceBudget {
    constructor() {
        this.budgets = {
            totalSize: 2000000,    // 2MB total
            imageSize: 1000000,    // 1MB images
            jsSize: 500000,        // 500KB JavaScript
            cssSize: 200000,       // 200KB CSS
            fontSize: 300000,      // 300KB fonts
            requestCount: 50       // 50 requests max
        };
        
        this.checkBudget();
    }
    
    checkBudget() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const analysis = this.analyzeResourceBudget(resources);
            
            Object.keys(this.budgets).forEach(budget => {
                if (analysis[budget] > this.budgets[budget]) {
                    console.warn(`Performance Budget Exceeded: ${budget}`, {
                        actual: analysis[budget],
                        budget: this.budgets[budget],
                        overage: analysis[budget] - this.budgets[budget]
                    });
                }
            });
        });
    }
    
    analyzeResourceBudget(resources) {
        const analysis = {
            totalSize: 0,
            imageSize: 0,
            jsSize: 0,
            cssSize: 0,
            fontSize: 0,
            requestCount: resources.length
        };
        
        resources.forEach(resource => {
            const size = resource.transferSize || 0;
            analysis.totalSize += size;
            
            if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
                analysis.imageSize += size;
            } else if (resource.name.includes('.js')) {
                analysis.jsSize += size;
            } else if (resource.name.includes('.css')) {
                analysis.cssSize += size;
            } else if (resource.name.match(/\.(woff|woff2|ttf|eot)$/i)) {
                analysis.fontSize += size;
            }
        });
        
        return analysis;
    }
}

// Initialize performance monitoring
let performanceMonitor;
let performanceBudget;

document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor = new PerformanceMonitor();
    performanceBudget = new PerformanceBudget();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceMonitor, PerformanceBudget };
}