/* ============================================
   MAIN APPLICATION FILE
   Purpose: Initialize app and connect all event listeners
   This file runs when page loads and sets up the app
   ============================================ */

/* ============================================
   INITIALIZE APPLICATION
   Purpose: Set up event listeners and prepare app
   Runs when page finishes loading
   ============================================ */
function initializeApp() {
    // ========== DASHBOARD BUTTONS ==========
    
    // Listen for Create Quiz button click
    document.getElementById('createQuizBtn').addEventListener('click', () => {
        // Show create quiz section
        showSection('createQuizSection');
        
        // Reset form
        setFormValue('quizTitle', '');
        currentQuestions = [];
        clearElement('questionsContainer');
        
        // Add first empty question
        addQuestion();
    });
    
    // Listen for Start Quiz button click
    document.getElementById('startQuizBtn').addEventListener('click', () => {
        // Show start quiz section
        showSection('startQuizSection');
        
        // Load all saved quizzes
        loadQuizzes();
    });
    
    // ========== CREATE QUIZ SECTION BUTTONS ==========
    
    // Back button from create quiz
    document.getElementById('backFromCreateBtn').addEventListener('click', () => {
        showSection('dashboard');
    });
    
    // Add Question button
    document.getElementById('addQuestionBtn').addEventListener('click', () => {
        addQuestion();
    });
    
    // Save Quiz button
    document.getElementById('saveQuizBtn').addEventListener('click', () => {
        saveQuiz();
    });
    
    // ========== START QUIZ SECTION BUTTONS ==========
    
    // Back button from start quiz
    document.getElementById('backFromStartBtn').addEventListener('click', () => {
        showSection('dashboard');
    });
    
    // ========== QUIZ TAKING SECTION BUTTONS ==========
    
    // Back button from quiz taking
    document.getElementById('backFromQuizBtn').addEventListener('click', () => {
        showSection('startQuizSection');
        loadQuizzes();
    });
    
    // Previous question button
    document.getElementById('prevQuestionBtn').addEventListener('click', () => {
        goToPreviousQuestion();
    });
    
    // Next question button
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        goToNextQuestion();
    });
    
    // Finish quiz button
    document.getElementById('finishQuizBtn').addEventListener('click', () => {
        finishQuiz();
    });
    
    // ========== RESULTS SECTION BUTTONS ==========
    
    // Back button from results
    document.getElementById('backFromResultsBtn').addEventListener('click', () => {
        showSection('dashboard');
    });
}

/* ============================================
   PAGE LOAD EVENT
   Purpose: Run initialization when page finishes loading
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initializeApp();
});
