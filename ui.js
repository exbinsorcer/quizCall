/* ============================================
   UI UTILITY FUNCTIONS
   Purpose: Helper functions for managing UI elements
   - Showing/hiding sections
   - Displaying notifications
   - Managing visibility
   ============================================ */

/* ============================================
   SHOW SECTION
   Purpose: Display a specific section and hide all others
   Parameter: sectionId - ID of the section to show
   ============================================ */
function showSection(sectionId) {
    // Get all section elements from the DOM
    const sections = [
        document.getElementById('dashboard'),
        document.getElementById('createQuizSection'),
        document.getElementById('startQuizSection'),
        document.getElementById('quizTakingSection'),
        document.getElementById('quizResultsSection')
    ];
    
    // Hide all sections by setting display to none
    sections.forEach(section => {
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Show the requested section
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}

/* ============================================
   SHOW NOTIFICATION
   Purpose: Display a temporary toast notification message
   Parameter: message - Text to display in notification
   Duration: Automatically hides after 3 seconds
   ============================================ */
function showNotification(message) {
    // Get the toast element from the DOM
    const toast = document.getElementById('notification');
    
    // Set the notification message
    toast.textContent = message;
    
    // Show the toast by adding the 'show' class
    // CSS animation will handle the appearance
    toast.classList.add('show');
    
    // Automatically hide the toast after 3 seconds
    // 3000 milliseconds = 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ============================================
   CLEAR ELEMENT
   Purpose: Remove all child elements from a container
   Parameter: elementId - ID of the container to clear
   ============================================ */
function clearElement(elementId) {
    // Get the element
    const element = document.getElementById(elementId);
    
    // Remove all child elements
    // innerHTML = '' replaces all content with nothing
    if (element) {
        element.innerHTML = '';
    }
}

/* ============================================
   CREATE UNIQUE ID
   Purpose: Generate a unique ID for new questions
   Returns: Unique timestamp-based ID
   ============================================ */
function createUniqueId() {
    // Use current timestamp plus random number for uniqueness
    // Date.now() returns milliseconds since Jan 1, 1970
    // Math.random() returns decimal from 0 to 1
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/* ============================================
   GET FORM VALUE
   Purpose: Safely retrieve value from an input element
   Parameter: elementId - ID of the input element
   Returns: Trimmed string value
   ============================================ */
function getFormValue(elementId) {
    // Get the element from the DOM
    const element = document.getElementById(elementId);
    
    // Return the value, trimmed of whitespace
    // .trim() removes spaces from start and end
    return element ? element.value.trim() : '';
}

/* ============================================
   SET FORM VALUE
   Purpose: Safely set value of an input element
   Parameter: elementId - ID of the input element
   Parameter: value - Value to set
   ============================================ */
function setFormValue(elementId, value) {
    // Get the element from the DOM
    const element = document.getElementById(elementId);
    
    // Set the value if element exists
    if (element) {
        element.value = value;
    }
}

/* ============================================
   VALIDATE QUIZ DATA
   Purpose: Check if quiz has required data
   Parameter: title - Quiz title
   Parameter: questions - Array of questions
   Returns: Object with isValid boolean and error message
   ============================================ */
function validateQuizData(title, questions) {
    // Check if title is empty
    if (!title) {
        return {
            isValid: false,
            error: 'Please enter a quiz title'
        };
    }
    
    // Check if at least one question exists
    if (questions.length === 0) {
        return {
            isValid: false,
            error: 'Please add at least one question'
        };
    }
    
    // Check each question for required data
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        
        // Check if question text exists
        if (!question.question) {
            return {
                isValid: false,
                error: `Question ${i + 1}: Please enter question text`
            };
        }
        
        // Check if at least one answer exists
        if (question.answers.length === 0) {
            return {
                isValid: false,
                error: `Question ${i + 1}: Please add at least one answer`
            };
        }
        
        // Check if all answers have text
        for (let j = 0; j < question.answers.length; j++) {
            if (!question.answers[j].text) {
                return {
                    isValid: false,
                    error: `Question ${i + 1}, Answer ${j + 1}: Please enter answer text`
                };
            }
        }
    }
    
    // If all checks pass, return valid
    return {
        isValid: true,
        error: null
    };
}
