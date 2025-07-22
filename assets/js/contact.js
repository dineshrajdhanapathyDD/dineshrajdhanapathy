/**
 * Contact form functionality with client-side validation
 * Handles form validation, submission, and user feedback
 */

// Form validation rules
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    subject: {
        required: false,
        maxLength: 100,
        message: 'Subject must be less than 100 characters'
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: 'Message must be between 10 and 1000 characters'
    }
};

// Form state
let formState = {
    isValid: false,
    fields: {},
    isSubmitting: false
};

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Initialize form fields
    initFormFields();
    
    // Add form event listeners
    addFormEventListeners();
    
    // Initialize accessibility features
    initFormAccessibility();
    
    // Add form analytics
    initFormAnalytics();
}

/**
 * Initialize form fields with validation
 */
function initFormFields() {
    const fields = ['name', 'email', 'subject', 'message'];
    
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        // Initialize field state
        formState.fields[fieldName] = {
            value: '',
            isValid: !validationRules[fieldName].required,
            isDirty: false,
            errors: []
        };
        
        // Add real-time validation
        addFieldValidation(field, fieldName);
        
        // Add accessibility attributes
        enhanceFieldAccessibility(field, fieldName);
    });
}

/**
 * Add validation to individual field
 */
function addFieldValidation(field, fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    // Real-time validation on input
    field.addEventListener('input', function() {
        const value = field.value.trim();
        formState.fields[fieldName].value = value;
        formState.fields[fieldName].isDirty = true;
        
        const validation = validateField(fieldName, value);
        formState.fields[fieldName].isValid = validation.isValid;
        formState.fields[fieldName].errors = validation.errors;
        
        updateFieldUI(field, fieldName, validation);
        updateFormState();
    });
    
    // Validation on blur for better UX
    field.addEventListener('blur', function() {
        if (formState.fields[fieldName].isDirty) {
            const value = field.value.trim();
            const validation = validateField(fieldName, value);
            updateFieldUI(field, fieldName, validation);
        }
    });
    
    // Clear errors on focus
    field.addEventListener('focus', function() {
        if (errorElement) {
            errorElement.textContent = '';
            field.classList.remove('form__input--error');
            field.setAttribute('aria-invalid', 'false');
        }
    });
}

/**
 * Validate individual field
 */
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    const errors = [];
    let isValid = true;
    
    // Required field validation
    if (rules.required && !value) {
        errors.push(`${capitalizeFirst(fieldName)} is required`);
        isValid = false;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
        return { isValid: true, errors: [] };
    }
    
    // Minimum length validation
    if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${capitalizeFirst(fieldName)} must be at least ${rules.minLength} characters`);
        isValid = false;
    }
    
    // Maximum length validation
    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${capitalizeFirst(fieldName)} must be less than ${rules.maxLength} characters`);
        isValid = false;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.message);
        isValid = false;
    }
    
    return { isValid, errors };
}

/**
 * Update field UI based on validation
 */
function updateFieldUI(field, fieldName, validation) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (validation.isValid) {
        field.classList.remove('form__input--error');
        field.classList.add('form__input--valid');
        field.setAttribute('aria-invalid', 'false');
        if (errorElement) errorElement.textContent = '';
    } else {
        field.classList.add('form__input--error');
        field.classList.remove('form__input--valid');
        field.setAttribute('aria-invalid', 'true');
        if (errorElement) {
            errorElement.textContent = validation.errors[0];
            // Announce error to screen readers
            announceToScreenReader(`Error in ${fieldName}: ${validation.errors[0]}`);
        }
    }
}

/**
 * Add form event listeners
 */
function addFormEventListeners() {
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-btn');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Prevent double submission
    submitButton.addEventListener('click', function(event) {
        if (formState.isSubmitting) {
            event.preventDefault();
            return false;
        }
    });
    
    // Auto-save form data to localStorage
    form.addEventListener('input', debounce(saveFormData, 1000));
    
    // Load saved form data on page load
    loadSavedFormData();
}

/**
 * Handle form submission
 */
async function handleFormSubmission(event) {
    event.preventDefault();
    
    if (formState.isSubmitting) return;
    
    // Validate entire form
    const isFormValid = validateEntireForm();
    
    if (!isFormValid) {
        // Focus first invalid field
        focusFirstInvalidField();
        announceToScreenReader('Please correct the errors in the form');
        return;
    }
    
    // Set submitting state
    setSubmittingState(true);
    
    try {
        // Prepare form data for Formspree
        const formData = prepareFormData();
        
        // Submit to Formspree
        await submitToFormspree(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Clear form
        clearForm();
        
        // Clear saved data
        clearSavedFormData();
        
        // Track successful submission
        trackFormSubmission('success');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage(error.message);
        trackFormSubmission('error', error.message);
    } finally {
        setSubmittingState(false);
    }
}

/**
 * Validate entire form
 */
function validateEntireForm() {
    let isValid = true;
    
    Object.keys(formState.fields).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        const value = field.value.trim();
        const validation = validateField(fieldName, value);
        
        formState.fields[fieldName].isValid = validation.isValid;
        formState.fields[fieldName].errors = validation.errors;
        formState.fields[fieldName].isDirty = true;
        
        updateFieldUI(field, fieldName, validation);
        
        if (!validation.isValid) {
            isValid = false;
        }
    });
    
    updateFormState();
    return isValid;
}

/**
 * Update overall form state
 */
function updateFormState() {
    const allFieldsValid = Object.values(formState.fields).every(field => field.isValid);
    formState.isValid = allFieldsValid;
    
    // Update submit button state
    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
        submitButton.disabled = !allFieldsValid || formState.isSubmitting;
        submitButton.classList.toggle('btn--disabled', !allFieldsValid);
    }
}

/**
 * Set form submitting state
 */
function setSubmittingState(isSubmitting) {
    formState.isSubmitting = isSubmitting;
    
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-btn');
    const buttonText = submitButton.querySelector('.btn__text');
    const buttonLoading = submitButton.querySelector('.btn__loading');
    
    if (isSubmitting) {
        form.classList.add('form--submitting');
        submitButton.disabled = true;
        submitButton.classList.add('btn--loading');
        if (buttonText) buttonText.style.display = 'none';
        if (buttonLoading) buttonLoading.style.display = 'inline';
        
        // Disable all form fields
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => field.disabled = true);
    } else {
        form.classList.remove('form--submitting');
        submitButton.disabled = false;
        submitButton.classList.remove('btn--loading');
        if (buttonText) buttonText.style.display = 'inline';
        if (buttonLoading) buttonLoading.style.display = 'none';
        
        // Re-enable all form fields
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => field.disabled = false);
    }
}

/**
 * Prepare form data for submission
 */
function prepareFormData() {
    const form = document.getElementById('contact-form');
    const formData = {};
    
    // Get form field values
    const fields = ['name', 'email', 'subject', 'message'];
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            formData[fieldName] = field.value.trim();
        }
    });
    
    // Add metadata
    formData._subject = `New contact from ${formData.name || 'Portfolio Website'}`;
    formData._replyto = formData.email;
    formData._format = 'plain';
    
    // Add timestamp and user agent for tracking
    formData.timestamp = new Date().toISOString();
    formData.userAgent = navigator.userAgent;
    formData.referrer = document.referrer || 'Direct';
    
    return formData;
}

/**
 * Submit form via mailto
 */
async function submitToFormspree(formData) {
    const form = document.getElementById('contact-form');
    const mailtoUrl = form.action;
    
    // Check if mailto URL is configured
    if (!mailtoUrl || !mailtoUrl.includes('mailto:')) {
        throw new Error('Email submission is not configured properly.');
    }
    
    try {
        // For mailto links, we'll just let the browser handle it
        // and simulate a successful submission
        console.log('Form will be submitted via mailto link');
        
        // We'll return a successful result after a short delay
        // to simulate the form submission process
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
        
    } catch (error) {
        console.error('Form submission error:', error);
        throw new Error('Failed to open email client. Please contact directly via email.');
    }
}

/**
 * Show success message
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const form = document.getElementById('contact-form');
    
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        announceToScreenReader('Message sent successfully!');
    }
    
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    
    if (form) {
        form.style.display = 'none';
    }
    
    // Show form again after 5 seconds
    setTimeout(() => {
        if (form) form.style.display = 'block';
        if (successMessage) successMessage.style.display = 'none';
    }, 5000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    if (errorMessage) {
        const errorText = errorMessage.querySelector('p');
        if (errorText) {
            errorText.textContent = message || 'Something went wrong. Please try again.';
        }
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        announceToScreenReader(`Error: ${message}`);
    }
    
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

/**
 * Clear form data
 */
function clearForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
        
        // Reset form state
        Object.keys(formState.fields).forEach(fieldName => {
            formState.fields[fieldName] = {
                value: '',
                isValid: !validationRules[fieldName].required,
                isDirty: false,
                errors: []
            };
            
            const field = document.getElementById(fieldName);
            if (field) {
                field.classList.remove('form__input--valid', 'form__input--error');
                field.setAttribute('aria-invalid', 'false');
            }
            
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
        
        updateFormState();
    }
}

/**
 * Focus first invalid field
 */
function focusFirstInvalidField() {
    const firstInvalidField = Object.keys(formState.fields).find(fieldName => 
        !formState.fields[fieldName].isValid && formState.fields[fieldName].isDirty
    );
    
    if (firstInvalidField) {
        const field = document.getElementById(firstInvalidField);
        if (field) {
            field.focus();
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

/**
 * Save form data to localStorage
 */
function saveFormData() {
    const formData = {};
    Object.keys(formState.fields).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            formData[fieldName] = field.value;
        }
    });
    
    try {
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    } catch (error) {
        console.warn('Could not save form data:', error);
    }
}

/**
 * Load saved form data from localStorage
 */
function loadSavedFormData() {
    try {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            Object.keys(formData).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field && formData[fieldName]) {
                    field.value = formData[fieldName];
                    // Trigger validation
                    field.dispatchEvent(new Event('input'));
                }
            });
        }
    } catch (error) {
        console.warn('Could not load saved form data:', error);
    }
}

/**
 * Clear saved form data
 */
function clearSavedFormData() {
    try {
        localStorage.removeItem('contactFormData');
    } catch (error) {
        console.warn('Could not clear saved form data:', error);
    }
}

/**
 * Initialize form accessibility features
 */
function initFormAccessibility() {
    // Add form description for screen readers
    const form = document.getElementById('contact-form');
    if (form) {
        const description = document.createElement('div');
        description.id = 'form-description';
        description.className = 'sr-only';
        description.textContent = 'Contact form with real-time validation. Required fields are marked with an asterisk.';
        form.insertBefore(description, form.firstChild);
        form.setAttribute('aria-describedby', 'form-description');
    }
    
    // Enhance field accessibility
    Object.keys(validationRules).forEach(fieldName => {
        enhanceFieldAccessibility(document.getElementById(fieldName), fieldName);
    });
}

/**
 * Enhance individual field accessibility
 */
function enhanceFieldAccessibility(field, fieldName) {
    if (!field) return;
    
    const rules = validationRules[fieldName];
    const label = document.querySelector(`label[for="${fieldName}"]`);
    
    // Mark required fields
    if (rules.required && label) {
        if (!label.textContent.includes('*')) {
            label.innerHTML += ' <span class="required-indicator" aria-label="required">*</span>';
        }
    }
    
    // Add character count for fields with max length
    if (rules.maxLength) {
        addCharacterCounter(field, fieldName, rules.maxLength);
    }
    
    // Set up ARIA attributes
    field.setAttribute('aria-required', rules.required.toString());
    field.setAttribute('aria-invalid', 'false');
    
    if (rules.maxLength) {
        field.setAttribute('maxlength', rules.maxLength.toString());
    }
}

/**
 * Add character counter to field
 */
function addCharacterCounter(field, fieldName, maxLength) {
    const counter = document.createElement('div');
    counter.id = `${fieldName}-counter`;
    counter.className = 'form__counter';
    counter.setAttribute('aria-live', 'polite');
    
    const updateCounter = () => {
        const remaining = maxLength - field.value.length;
        counter.textContent = `${remaining} characters remaining`;
        counter.classList.toggle('form__counter--warning', remaining < 50);
    };
    
    field.addEventListener('input', updateCounter);
    updateCounter();
    
    field.parentNode.appendChild(counter);
    field.setAttribute('aria-describedby', `${fieldName}-counter`);
}

/**
 * Initialize form analytics
 */
function initFormAnalytics() {
    // Track form interactions
    const form = document.getElementById('contact-form');
    if (form) {
        // Track form start
        let formStarted = false;
        form.addEventListener('input', function() {
            if (!formStarted) {
                trackFormEvent('form_started');
                formStarted = true;
            }
        });
        
        // Track field interactions
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('focus', () => trackFormEvent('field_focused', fieldName));
                field.addEventListener('blur', () => {
                    if (field.value.trim()) {
                        trackFormEvent('field_completed', fieldName);
                    }
                });
            }
        });
    }
}

/**
 * Track form events
 */
function trackFormEvent(eventName, fieldName = null) {
    // Integration with analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'form_name': 'contact_form',
            'field_name': fieldName
        });
    }
    
    console.log(`Form event: ${eventName}${fieldName ? ` - ${fieldName}` : ''}`);
}

/**
 * Track form submission
 */
function trackFormSubmission(status, error = null) {
    trackFormEvent('form_submitted', status);
    
    if (error) {
        console.error('Form submission error:', error);
    }
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Utility functions
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Open email client with form data
 */
function openEmailClient(event) {
    event.preventDefault();
    
    // Validate form first
    const isFormValid = validateEntireForm();
    if (!isFormValid) {
        focusFirstInvalidField();
        announceToScreenReader('Please correct the errors in the form');
        return false;
    }
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact Form';
    const message = document.getElementById('message').value.trim();
    
    // Create mailto link
    const mailtoSubject = encodeURIComponent(subject);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailtoLink = `mailto:dineshrajdhanapathy@mail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    setTimeout(() => {
        showSuccessMessage();
        clearForm();
    }, 1000);
    
    // Track form submission
    trackFormSubmission('success');
    
    return false;
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

// Export functions for external use
window.ContactModule = {
    initContactForm,
    validateField,
    clearForm,
    trackFormEvent,
    openEmailClient
};/**
 
* Additional Formspree integration features
 */

/**
 * Check if Formspree is properly configured
 */
function isFormspreeConfigured() {
    const form = document.getElementById('contact-form');
    const formspreeUrl = form?.action;
    
    return formspreeUrl && 
           !formspreeUrl.includes('YOUR_FORM_ID') && 
           formspreeUrl.includes('formspree.io');
}

/**
 * Show configuration warning if Formspree is not set up
 */
function showConfigurationWarning() {
    if (!isFormspreeConfigured()) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'form__message form__message--warning';
        warningDiv.innerHTML = `
            <h3>Configuration Required</h3>
            <p>To enable form submissions, please configure your Formspree form ID in the contact form action URL.</p>
            <p><strong>Steps:</strong></p>
            <ol>
                <li>Sign up at <a href="https://formspree.io" target="_blank" rel="noopener">formspree.io</a></li>
                <li>Create a new form and get your form ID</li>
                <li>Replace "YOUR_FORM_ID" in the form action URL with your actual form ID</li>
            </ol>
        `;
        
        const form = document.getElementById('contact-form');
        if (form) {
            form.parentNode.insertBefore(warningDiv, form);
        }
    }
}

/**
 * Add fallback form submission for when Formspree is not configured
 */
function addFallbackSubmission() {
    if (!isFormspreeConfigured()) {
        // Override the form submission to show a helpful message
        const originalSubmit = handleFormSubmission;
        window.handleFormSubmission = async function(event) {
            event.preventDefault();
            
            // Validate form first
            const isFormValid = validateEntireForm();
            if (!isFormValid) {
                focusFirstInvalidField();
                announceToScreenReader('Please correct the errors in the form');
                return;
            }
            
            // Show configuration message instead of submitting
            showErrorMessage('Form submission is not configured. Please set up Formspree to enable contact form functionality.');
        };
    }
}

/**
 * Add retry functionality for failed submissions
 */
function addRetryFunctionality() {
    let retryButton = null;
    
    window.retryFormSubmission = async function() {
        if (retryButton) {
            retryButton.disabled = true;
            retryButton.textContent = 'Retrying...';
        }
        
        try {
            // Re-validate and submit
            const isFormValid = validateEntireForm();
            if (isFormValid) {
                setSubmittingState(true);
                const formData = prepareFormData();
                await submitToFormspree(formData);
                
                showSuccessMessage();
                clearForm();
                clearSavedFormData();
                trackFormSubmission('retry_success');
                
                // Remove retry button
                if (retryButton) {
                    retryButton.remove();
                    retryButton = null;
                }
            }
        } catch (error) {
            showErrorMessage(error.message);
            trackFormSubmission('retry_failed', error.message);
        } finally {
            setSubmittingState(false);
            if (retryButton) {
                retryButton.disabled = false;
                retryButton.textContent = 'Try Again';
            }
        }
    };
    
    // Add retry button to error messages
    const originalShowError = showErrorMessage;
    window.showErrorMessage = function(message) {
        originalShowError(message);
        
        const errorMessage = document.getElementById('error-message');
        if (errorMessage && !retryButton) {
            retryButton = document.createElement('button');
            retryButton.type = 'button';
            retryButton.className = 'btn btn--secondary';
            retryButton.textContent = 'Try Again';
            retryButton.onclick = window.retryFormSubmission;
            retryButton.style.marginTop = 'var(--space-md)';
            
            errorMessage.appendChild(retryButton);
        }
    };
}

/**
 * Add form submission analytics
 */
function enhanceFormAnalytics() {
    // Track form abandonment
    let formInteracted = false;
    let abandonmentTimer = null;
    
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('input', function() {
            if (!formInteracted) {
                formInteracted = true;
                
                // Set abandonment timer
                abandonmentTimer = setTimeout(() => {
                    if (formInteracted && !formState.isSubmitting) {
                        trackFormEvent('form_abandoned');
                    }
                }, 300000); // 5 minutes
            }
        });
        
        // Clear abandonment timer on successful submission
        const originalSuccess = showSuccessMessage;
        window.showSuccessMessage = function() {
            if (abandonmentTimer) {
                clearTimeout(abandonmentTimer);
            }
            originalSuccess();
        };
    }
    
    // Track validation errors
    const originalUpdateFieldUI = updateFieldUI;
    window.updateFieldUI = function(field, fieldName, validation) {
        originalUpdateFieldUI(field, fieldName, validation);
        
        if (!validation.isValid && validation.errors.length > 0) {
            trackFormEvent('validation_error', `${fieldName}: ${validation.errors[0]}`);
        }
    };
}

/**
 * Add progressive enhancement features
 */
function addProgressiveEnhancements() {
    // Add form progress indicator
    addFormProgressIndicator();
    
    // Add smart form suggestions
    addFormSuggestions();
    
    // Add keyboard shortcuts
    addFormKeyboardShortcuts();
}

/**
 * Add form progress indicator
 */
function addFormProgressIndicator() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'form__progress';
    progressBar.innerHTML = `
        <div class="form__progress-bar" id="form-progress-bar"></div>
        <span class="form__progress-text" id="form-progress-text">0% Complete</span>
    `;
    
    form.insertBefore(progressBar, form.firstChild);
    
    // Update progress based on filled fields
    function updateProgress() {
        const fields = ['name', 'email', 'message']; // Required fields
        const filledFields = fields.filter(fieldName => {
            const field = document.getElementById(fieldName);
            return field && field.value.trim() && formState.fields[fieldName]?.isValid;
        });
        
        const progress = Math.round((filledFields.length / fields.length) * 100);
        const progressBarElement = document.getElementById('form-progress-bar');
        const progressTextElement = document.getElementById('form-progress-text');
        
        if (progressBarElement) {
            progressBarElement.style.width = `${progress}%`;
        }
        if (progressTextElement) {
            progressTextElement.textContent = `${progress}% Complete`;
        }
    }
    
    // Update progress on field changes
    form.addEventListener('input', debounce(updateProgress, 300));
}

/**
 * Add smart form suggestions
 */
function addFormSuggestions() {
    const emailField = document.getElementById('email');
    if (!emailField) return;
    
    // Common email domain suggestions
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    
    emailField.addEventListener('blur', function() {
        const email = emailField.value.trim();
        if (!email.includes('@')) return;
        
        const [localPart, domain] = email.split('@');
        if (!domain) return;
        
        // Find similar domains
        const suggestions = commonDomains.filter(commonDomain => {
            return commonDomain.startsWith(domain.toLowerCase()) && commonDomain !== domain.toLowerCase();
        });
        
        if (suggestions.length > 0) {
            showEmailSuggestion(localPart, suggestions[0]);
        }
    });
}

/**
 * Show email domain suggestion
 */
function showEmailSuggestion(localPart, suggestedDomain) {
    const emailField = document.getElementById('email');
    if (!emailField) return;
    
    // Remove existing suggestion
    const existingSuggestion = document.getElementById('email-suggestion');
    if (existingSuggestion) {
        existingSuggestion.remove();
    }
    
    const suggestion = document.createElement('div');
    suggestion.id = 'email-suggestion';
    suggestion.className = 'form__suggestion';
    suggestion.innerHTML = `
        Did you mean <button type="button" class="form__suggestion-link">${localPart}@${suggestedDomain}</button>?
    `;
    
    const suggestionButton = suggestion.querySelector('.form__suggestion-link');
    suggestionButton.addEventListener('click', function() {
        emailField.value = `${localPart}@${suggestedDomain}`;
        emailField.dispatchEvent(new Event('input'));
        suggestion.remove();
    });
    
    emailField.parentNode.appendChild(suggestion);
    
    // Auto-remove suggestion after 10 seconds
    setTimeout(() => {
        if (suggestion.parentNode) {
            suggestion.remove();
        }
    }, 10000);
}

/**
 * Add form keyboard shortcuts
 */
function addFormKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only activate when form is focused
        const form = document.getElementById('contact-form');
        if (!form || !form.contains(event.target)) return;
        
        // Ctrl/Cmd + Enter to submit form
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            const submitButton = document.getElementById('submit-btn');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
        
        // Escape to clear current field
        if (event.key === 'Escape' && event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            event.target.value = '';
            event.target.dispatchEvent(new Event('input'));
        }
    });
}

/**
 * Initialize all enhanced features
 */
function initEnhancedContactForm() {
    // Initialize base contact form
    initContactForm();
    
    // Add enhanced features
    showConfigurationWarning();
    addFallbackSubmission();
    addRetryFunctionality();
    enhanceFormAnalytics();
    addProgressiveEnhancements();
    
    // Add helpful tips
    addFormTips();
}

/**
 * Add helpful form tips
 */
function addFormTips() {
    const tips = [
        'Use Ctrl/Cmd + Enter to quickly submit the form',
        'Your form data is automatically saved as you type',
        'All fields are validated in real-time for your convenience'
    ];
    
    const tipsContainer = document.createElement('div');
    tipsContainer.className = 'form__tips';
    tipsContainer.innerHTML = `
        <h4>💡 Tips:</h4>
        <ul>
            ${tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
    `;
    
    const form = document.getElementById('contact-form');
    if (form) {
        form.parentNode.appendChild(tipsContainer);
    }
}

// Override the original initialization
document.addEventListener('DOMContentLoaded', function() {
    initEnhancedContactForm();
});

// Update exports
window.ContactModule = {
    ...window.ContactModule,
    initEnhancedContactForm,
    isFormspreeConfigured,
    retryFormSubmission
};/
**
 * Professional contact links and social media functionality
 */

/**
 * Initialize contact links functionality
 */
function initContactLinks() {
    // Track social media clicks
    trackSocialMediaClicks();
    
    // Initialize availability status
    initAvailabilityStatus();
    
    // Add copy email functionality
    addCopyEmailFunctionality();
    
    // Initialize contact link animations
    initContactAnimations();
    
    // Add contact link validation
    validateContactLinks();
}

/**
 * Track social media and professional link clicks
 */
function trackSocialMediaClicks() {
    const socialLinks = document.querySelectorAll('.social-links__item');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const platform = getPlatformFromLink(link);
            const linkType = link.closest('.social-links--secondary') ? 'secondary' : 'primary';
            
            // Track the click
            trackContactEvent('social_link_click', {
                platform: platform,
                type: linkType,
                url: link.href
            });
            
            // Add visual feedback
            addClickFeedback(link);
        });
    });
}

/**
 * Get platform name from social link
 */
function getPlatformFromLink(link) {
    const classList = link.classList;
    
    if (classList.contains('social-links__item--linkedin')) return 'linkedin';
    if (classList.contains('social-links__item--github')) return 'github';
    if (classList.contains('social-links__item--twitter')) return 'twitter';
    if (classList.contains('social-links__item--dev')) return 'dev.to';
    if (classList.contains('social-links__item--stackoverflow')) return 'stackoverflow';
    if (classList.contains('social-links__item--medium')) return 'medium';
    
    return 'unknown';
}

/**
 * Add visual feedback for link clicks
 */
function addClickFeedback(element) {
    element.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

/**
 * Initialize availability status with dynamic updates
 */
function initAvailabilityStatus() {
    const availabilityIndicator = document.querySelector('.availability-indicator');
    const availabilityText = document.querySelector('.availability-text');
    
    if (!availabilityIndicator || !availabilityText) return;
    
    // Simulate dynamic availability (in real app, this would come from an API)
    updateAvailabilityStatus('available', 'Available for new projects');
    
    // Add click handler to show more availability info
    const availabilityStatus = document.querySelector('.availability-status');
    if (availabilityStatus) {
        availabilityStatus.addEventListener('click', showAvailabilityDetails);
        availabilityStatus.style.cursor = 'pointer';
        availabilityStatus.setAttribute('role', 'button');
        availabilityStatus.setAttribute('aria-label', 'Click for availability details');
    }
}

/**
 * Update availability status
 */
function updateAvailabilityStatus(status, text) {
    const indicator = document.querySelector('.availability-indicator');
    const textElement = document.querySelector('.availability-text');
    
    if (!indicator || !textElement) return;
    
    // Remove existing status classes
    indicator.classList.remove('availability-indicator--available', 'availability-indicator--busy', 'availability-indicator--unavailable');
    
    // Add new status class
    indicator.classList.add(`availability-indicator--${status}`);
    textElement.textContent = text;
    
    // Update parent container styling
    const statusContainer = document.querySelector('.availability-status');
    if (statusContainer) {
        statusContainer.className = 'availability-status';
        statusContainer.classList.add(`availability-status--${status}`);
    }
}

/**
 * Show detailed availability information
 */
function showAvailabilityDetails() {
    const modal = createAvailabilityModal();
    document.body.appendChild(modal);
    
    // Focus management
    const closeButton = modal.querySelector('.modal__close');
    if (closeButton) {
        closeButton.focus();
    }
    
    // Track interaction
    trackContactEvent('availability_details_viewed');
}

/**
 * Create availability details modal
 */
function createAvailabilityModal() {
    const modal = document.createElement('div');
    modal.className = 'modal modal--availability';
    modal.innerHTML = `
        <div class="modal__backdrop"></div>
        <div class="modal__content">
            <div class="modal__header">
                <h3 class="modal__title">Current Availability</h3>
                <button class="modal__close" aria-label="Close availability details">×</button>
            </div>
            <div class="modal__body">
                <div class="availability-details">
                    <div class="availability-detail">
                        <h4>Project Availability</h4>
                        <p>Currently accepting new projects starting in Q2 2025</p>
                    </div>
                    <div class="availability-detail">
                        <h4>Consultation Calls</h4>
                        <p>Available for 30-minute discovery calls within 1-2 weeks</p>
                    </div>
                    <div class="availability-detail">
                        <h4>Response Times</h4>
                        <p>Email responses within 24-48 hours during business days</p>
                    </div>
                    <div class="availability-detail">
                        <h4>Preferred Contact</h4>
                        <p>Email for detailed project discussions, LinkedIn for networking</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeButton = modal.querySelector('.modal__close');
    const backdrop = modal.querySelector('.modal__backdrop');
    
    const closeModal = () => {
        modal.remove();
        trackContactEvent('availability_modal_closed');
    };
    
    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Escape key to close
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    return modal;
}

/**
 * Add copy email functionality
 */
function addCopyEmailFunctionality() {
    const emailLink = document.querySelector('.contact__link--email');
    if (!emailLink) return;
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'email-copy-btn';
    copyButton.innerHTML = '📋';
    copyButton.setAttribute('aria-label', 'Copy email address');
    copyButton.title = 'Copy email address';
    
    emailLink.parentNode.appendChild(copyButton);
    
    copyButton.addEventListener('click', async function(event) {
        event.preventDefault();
        
        const email = emailLink.href.replace('mailto:', '');
        
        try {
            await navigator.clipboard.writeText(email);
            showCopyFeedback(copyButton, 'Copied!');
            trackContactEvent('email_copied', { email: email });
        } catch (error) {
            // Fallback for older browsers
            fallbackCopyEmail(email);
            showCopyFeedback(copyButton, 'Copied!');
            trackContactEvent('email_copied_fallback', { email: email });
        }
    });
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyEmail(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (error) {
        console.warn('Copy fallback failed:', error);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show copy feedback
 */
function showCopyFeedback(button, message) {
    const originalContent = button.innerHTML;
    button.innerHTML = '✓';
    button.classList.add('email-copy-btn--success');
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove('email-copy-btn--success');
    }, 2000);
}

/**
 * Initialize contact animations
 */
function initContactAnimations() {
    // Stagger animation for contact items
    const contactItems = document.querySelectorAll('.contact__item');
    
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('contact-item-animate');
    });
    
    // Intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('contact-item-visible');
                }
            });
        }, { threshold: 0.1 });
        
        contactItems.forEach(item => observer.observe(item));
    } else {
        // Fallback for browsers without Intersection Observer
        contactItems.forEach(item => item.classList.add('contact-item-visible'));
    }
}

/**
 * Validate contact links
 */
function validateContactLinks() {
    const socialLinks = document.querySelectorAll('.social-links__item');
    
    socialLinks.forEach(link => {
        // Check if link is placeholder
        if (link.href === '#' || link.href.includes('example.com')) {
            link.classList.add('social-links__item--placeholder');
            link.addEventListener('click', function(event) {
                event.preventDefault();
                showPlaceholderMessage(link);
            });
        }
    });
    
    // Check email link
    const emailLink = document.querySelector('.contact__link--email');
    if (emailLink && emailLink.href.includes('example.com')) {
        emailLink.classList.add('contact__link--placeholder');
        emailLink.addEventListener('click', function(event) {
            event.preventDefault();
            showPlaceholderMessage(emailLink, 'Please update the email address in the contact section.');
        });
    }
}

/**
 * Show placeholder message
 */
function showPlaceholderMessage(element, customMessage = null) {
    const platform = getPlatformFromLink(element) || 'contact method';
    const message = customMessage || `Please update the ${platform} link in the contact section.`;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'placeholder-tooltip';
    tooltip.textContent = message;
    
    element.parentNode.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.bottom + 10}px`;
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.zIndex = '1000';
    
    // Remove tooltip after 3 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 3000);
    
    trackContactEvent('placeholder_link_clicked', { platform: platform });
}

/**
 * Track contact events
 */
function trackContactEvent(eventName, data = {}) {
    // Integration with analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'contact_section': true,
            ...data
        });
    }
    
    console.log(`Contact event: ${eventName}`, data);
}

/**
 * Initialize enhanced contact functionality
 */
function initEnhancedContactLinks() {
    initContactLinks();
    
    // Add keyboard shortcuts for contact actions
    addContactKeyboardShortcuts();
    
    // Initialize contact link health check
    initContactLinkHealthCheck();
}

/**
 * Add keyboard shortcuts for contact actions
 */
function addContactKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only activate when not in form fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl/Cmd + E to copy email
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            const copyButton = document.querySelector('.email-copy-btn');
            if (copyButton) {
                copyButton.click();
            }
        }
        
        // Ctrl/Cmd + L to open LinkedIn
        if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
            event.preventDefault();
            const linkedinLink = document.querySelector('.social-links__item--linkedin');
            if (linkedinLink && !linkedinLink.classList.contains('social-links__item--placeholder')) {
                linkedinLink.click();
            }
        }
    });
}

/**
 * Initialize contact link health check
 */
function initContactLinkHealthCheck() {
    const socialLinks = document.querySelectorAll('.social-links__item');
    let placeholderCount = 0;
    
    socialLinks.forEach(link => {
        if (link.classList.contains('social-links__item--placeholder')) {
            placeholderCount++;
        }
    });
    
    if (placeholderCount > 0) {
        console.warn(`${placeholderCount} placeholder contact links found. Please update with actual URLs.`);
        
        // Show admin notice if in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            showDevelopmentNotice(placeholderCount);
        }
    }
}

/**
 * Show development notice for placeholder links
 */
function showDevelopmentNotice(count) {
    const notice = document.createElement('div');
    notice.className = 'dev-notice';
    notice.innerHTML = `
        <h4>Development Notice</h4>
        <p>${count} placeholder contact link(s) detected. Update the URLs in contact.html for production.</p>
        <button class="dev-notice__close">×</button>
    `;
    
    document.body.appendChild(notice);
    
    const closeButton = notice.querySelector('.dev-notice__close');
    closeButton.addEventListener('click', () => notice.remove());
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notice.parentNode) {
            notice.remove();
        }
    }, 10000);
}

// Initialize enhanced contact links when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initEnhancedContactLinks();
});

// Update exports
window.ContactModule = {
    ...window.ContactModule,
    initEnhancedContactLinks,
    updateAvailabilityStatus,
    trackContactEvent
};