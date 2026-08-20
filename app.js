/* ============================================
   MAIN APPLICATION FILE
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Start Quiz Button
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            loadQuizzes();
            showSection('startQuizSection');
        });
    }
    
    // Create Quiz Button
    const createQuizBtn = document.getElementById('createQuizBtn');
    if (createQuizBtn) {
        createQuizBtn.addEventListener('click', function() {
            initCreateQuiz();
            showSection('createQuizSection');
        });
    }
    
    // Edit Quiz Button
    const editQuizBtn = document.getElementById('editQuizBtn');
    if (editQuizBtn) {
        editQuizBtn.addEventListener('click', function() {
            loadQuizzesForEditing();
            showSection('editQuizSection');
        });
    }
    
    // Print Quiz Button
    const printQuizBtn = document.getElementById('printQuizBtn');
    if (printQuizBtn) {
        printQuizBtn.addEventListener('click', function() {
            loadQuizzesForPrinting();
            showSection('printQuizSection');
        });
    }
    
    // Back from Create
    const backFromCreateBtn = document.getElementById('backFromCreateBtn');
    if (backFromCreateBtn) {
        backFromCreateBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
    
    // Add Question
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', function() {
            addQuestion();
        });
    }
    
    // Save Quiz
    const saveQuizBtn = document.getElementById('saveQuizBtn');
    if (saveQuizBtn) {
        saveQuizBtn.addEventListener('click', function() {
            saveQuiz();
        });
    }
    
    // Back from Edit
    const backFromEditBtn = document.getElementById('backFromEditBtn');
    if (backFromEditBtn) {
        backFromEditBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
    
    // Back from Quiz Editor
    const backFromQuizEditorBtn = document.getElementById('backFromQuizEditorBtn');
    if (backFromQuizEditorBtn) {
        backFromQuizEditorBtn.addEventListener('click', function() {
            currentEditingQuizId = null;
            currentEditingQuestions = [];
            clearElement('editingQuestionsContainer');
            loadQuizzesForEditing();
            showSection('editQuizSection');
        });
    }
    
    // Add Edit Question
    const addEditQuestionBtn = document.getElementById('addEditQuestionBtn');
    if (addEditQuestionBtn) {
        addEditQuestionBtn.addEventListener('click', function() {
            addEditQuestion();
        });
    }
    
    // Save Edit Quiz
    const saveEditQuizBtn = document.getElementById('saveEditQuizBtn');
    if (saveEditQuizBtn) {
        saveEditQuizBtn.addEventListener('click', function() {
            saveEditedQuiz();
        });
    }
    
    // Back from Start
    const backFromStartBtn = document.getElementById('backFromStartBtn');
    if (backFromStartBtn) {
        backFromStartBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
    
    // Back from Quiz
    const backFromQuizBtn = document.getElementById('backFromQuizBtn');
    if (backFromQuizBtn) {
        backFromQuizBtn.addEventListener('click', function() {
            currentTakingQuizId = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            loadQuizzes();
            showSection('startQuizSection');
        });
    }
    
    // Previous Question
    const prevQuestionBtn = document.getElementById('prevQuestionBtn');
    if (prevQuestionBtn) {
        prevQuestionBtn.addEventListener('click', function() {
            goToPreviousQuestion();
        });
    }
    
    // Next Question
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', function() {
            goToNextQuestion();
        });
    }
    
    // Finish Quiz
    const finishQuizBtn = document.getElementById('finishQuizBtn');
    if (finishQuizBtn) {
        finishQuizBtn.addEventListener('click', function() {
            finishQuiz();
        });
    }
    
    // Back from Print
    const backFromPrintBtn = document.getElementById('backFromPrintBtn');
    if (backFromPrintBtn) {
        backFromPrintBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
    
    // Back from Results
    const backFromResultsBtn = document.getElementById('backFromResultsBtn');
    if (backFromResultsBtn) {
        backFromResultsBtn.addEventListener('click', function() {
            currentTakingQuizId = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            showSection('mainDashboard');
        });
    }

    // Back to Main Dashboard
    const backToMainDashboardBtn = document.getElementById('backToMainDashboardBtn');
    if (backToMainDashboardBtn) {
        backToMainDashboardBtn.addEventListener('click', function() {
            // Try GitHub Pages path first, fall back to relative path
            if (window.location.href.includes('github.io')) {
                window.location.href = '/quizCall/index.html';
            } else {
                window.location.href = './index.html';
            }
        });
    }
});