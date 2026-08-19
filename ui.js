/* ============================================
   UI UTILITIES MODULE
   Purpose: Common UI helper functions
   ============================================ */

function showSection(sectionId) {
    const sections = document.querySelectorAll('.page');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function createUniqueId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getFormValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value : '';
}

function setFormValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = value;
    }
}

function clearElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}

function validateQuizData(title, questions) {
    if (!title || title.trim() === '') {
        return { isValid: false, error: 'Please enter a quiz title' };
    }
    
    if (questions.length === 0) {
        return { isValid: false, error: 'Please add at least one question' };
    }
    
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        if (!q.question || q.question.trim() === '') {
            return { isValid: false, error: `Question ${i + 1} is empty` };
        }
        
        if (q.answers.length === 0) {
            return { isValid: false, error: `Question ${i + 1} has no answers` };
        }
        
        if (q.answerType === 'multiple-choice') {
            const hasCorrect = q.answers.some(a => a.isCorrect);
            if (!hasCorrect) {
                return { isValid: false, error: `Question ${i + 1} has no correct answer marked` };
            }
            
            const allAnswersEmpty = q.answers.every(a => !a.text || a.text.trim() === '');
            if (allAnswersEmpty) {
                return { isValid: false, error: `Question ${i + 1} has empty answers` };
            }
        }
    }
    
    return { isValid: true, error: null };
}