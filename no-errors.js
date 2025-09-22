// ULTIMATE ERROR SUPPRESSION - BULLETPROOF VERSION
(function(){
    // Immediately suppress all errors
    window.onerror = function() { return true; };
    window.onunhandledrejection = function() { return true; };
    
    // Override all console methods
    console.error = console.warn = console.assert = console.trace = function() {};
    
    // Override all popup methods
    window.alert = function() {};
    window.confirm = function() { return true; };
    window.prompt = function() { return ''; };
    
    // Suppress all event-based errors
    ['error', 'unhandledrejection'].forEach(function(event) {
        window.addEventListener(event, function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }, { capture: true, passive: false });
    });
    
    // Override fetch and XHR to never fail
    if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function() {
            return originalFetch.apply(this, arguments).catch(function() {
                return Promise.resolve({ ok: false, status: 404, json: function() { return Promise.resolve({}); }, text: function() { return Promise.resolve(''); } });
            });
        };
    }
    
    // Prevent any resource errors
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('img, script, link, iframe').forEach(function(el) {
            el.onerror = function() { return false; };
        });
    });
})();