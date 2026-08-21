// ============================================================
// ADD THIS SECTION TO THE TOP OF YOUR EXISTING app.js
// BEFORE ANY OTHER CODE
// ============================================================

import { getCurrentUser, signIn, signOut } from './auth.js';

// ===== AUTH INITIALIZATION =====

/**
 * Initialize app: Check if user is logged in
 * If not, show login screen
 * If yes, show dashboard
 */
async function initializeApp() {
    const user = await getCurrentUser();
    const loginSection = document.getElementById('loginSection');
    const mainDashboardSection = document.getElementById('mainDashboardSection');
    
    if (!user) {
        // User not logged in - show login screen
        loginSection.style.display = 'flex';
        mainDashboardSection.style.display = 'none';
        setupLoginHandlers();
        return;
    }
    
    // User logged in - show dashboard
    loginSection.style.display = 'none';
    mainDashboardSection.style.display = 'block';
    
    // Initialize the rest of the app (existing code)
    initializeDashboard();
}

/**
 * Setup login form handlers
 */
function setupLoginHandlers() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                loginError.style.display = 'none';
                
                // Attempt login
                await signIn(email, password);
                
                // Success - reinitialize app to show dashboard
                await initializeApp();
                
            } catch (error) {
                // Show error message
                loginError.textContent = error.message || 'Login failed. Please check your email and password.';
                loginError.style.display = 'block';
            }
        });
    }
}

/**
 * Setup logout button
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut();
                // Show login screen again
                await initializeApp();
            } catch (error) {
                console.error('Logout failed:', error);
                alert('Logout failed: ' + error.message);
            }
        });
    }
}

/**
 * Initialize dashboard (existing app functionality)
 * This is called after login succeeds
 */
function initializeDashboard() {
    // Setup logout button
    setupLogoutButton();
    
    // Initialize rest of app (call existing init functions here)
    console.log('✅ Dashboard initialized - User logged in');
    
    // TODO: Call your existing app initialization functions here
    // Examples:
    // setupMainDashboard();
    // setupQuizFeatures();
    // etc.
}

// ===== START APP =====

// Check auth state when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 QuizCall starting...');
    await initializeApp();
});

// ============================================================
// PASTE YOUR EXISTING app.js CODE BELOW THIS LINE
// ============================================================

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
    
    // Review Due Button
    const reviewDueBtn = document.getElementById('reviewDueBtn');
    if (reviewDueBtn) {
        reviewDueBtn.addEventListener('click', function() {
            startReviewDueSession();
        });
    }
    
    // Mixed Practice Button
    const mixedPracticeBtn = document.getElementById('mixedPracticeBtn');
    if (mixedPracticeBtn) {
        mixedPracticeBtn.addEventListener('click', function() {
            loadQuizzesForMixedPractice();
            showSection('mixedPracticeSelectionSection');
        });
    }
    
    // Back from Mixed Practice Selection
    const backFromMixedSelectBtn = document.getElementById('backFromMixedSelectBtn');
    if (backFromMixedSelectBtn) {
        backFromMixedSelectBtn.addEventListener('click', function() {
            selectedQuizzes.clear();
            showSection('quizDashboard');
        });
    }
    
    // Select All Quizzes
    const selectAllQuizzesBtn = document.getElementById('selectAllQuizzesBtn');
    if (selectAllQuizzesBtn) {
        selectAllQuizzesBtn.addEventListener('click', function() {
            selectAllQuizzes();
        });
    }
    
    // Clear All Quizzes
    const clearAllQuizzesBtn = document.getElementById('clearAllQuizzesBtn');
    if (clearAllQuizzesBtn) {
        clearAllQuizzesBtn.addEventListener('click', function() {
            clearAllQuizzes();
        });
    }
    
    // Start Mixed Session
    const startMixedSessionBtn = document.getElementById('startMixedSessionBtn');
    if (startMixedSessionBtn) {
        startMixedSessionBtn.addEventListener('click', function() {
            startMixedSession();
        });
    }
    
    // Export Quizzes Button
    const exportQuizzesBtn = document.getElementById('exportQuizzesBtn');
    if (exportQuizzesBtn) {
        exportQuizzesBtn.addEventListener('click', function() {
            exportAllData();
        });
    }
    
    // Import Quizzes Button
    const importQuizzesBtn = document.getElementById('importQuizzesBtn');
    if (importQuizzesBtn) {
        importQuizzesBtn.addEventListener('click', function() {
            document.getElementById('importFileInput').click();
        });
    }
    
    // Import File Input Handler
    const importFileInput = document.getElementById('importFileInput');
    if (importFileInput) {
        importFileInput.addEventListener('change', function(e) {
            handleImportFile(e.target.files[0]);
            // Reset input so same file can be selected again
            e.target.value = '';
        });
    }
    
    // Back from Create
    const backFromCreateBtn = document.getElementById('backFromCreateBtn');
    if (backFromCreateBtn) {
        backFromCreateBtn.addEventListener('click', function() {
            showSection('quizDashboard');
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
            showSection('quizDashboard');
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
            showSection('quizDashboard');
        });
    }
    
    // Back from Quiz
    const backFromQuizBtn = document.getElementById('backFromQuizBtn');
    if (backFromQuizBtn) {
        backFromQuizBtn.addEventListener('click', function() {
            currentTakingQuizId = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            window.currentMixedQuiz = null;
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
            showSection('quizDashboard');
        });
    }
    
    // Back from Results
    const backFromResultsBtn = document.getElementById('backFromResultsBtn');
    if (backFromResultsBtn) {
        backFromResultsBtn.addEventListener('click', function() {
            currentTakingQuizId = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            window.currentMixedQuiz = null;
            showSection('quizDashboard');
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

/* ============================================================
   PREVENT INSPECTION & CONTEXT MENU
   Block right-click, long-press, and inspect element
   ============================================================ */

// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Prevent long-press on Android (shows context menu)
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
        return false;
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
        return false;
    }
}, { passive: false });

// Prevent holding down on Android
let touchStartTime = 0;
document.addEventListener('touchstart', () => {
    touchStartTime = Date.now();
}, false);

document.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration > 500) {
        e.preventDefault();
        return false;
    }
}, false);

// Prevent F12 developer tools (optional - can be bypassed)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        return false;
    }
}, true);