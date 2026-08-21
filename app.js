// ============================================================
// app.js - PHASE 4: AUTHENTICATION + DASHBOARD
// FIXED: Functions exported and bound to window for scope access
// ============================================================

import { getCurrentUser, signIn, signOut } from './auth.js';
import { initEditQuiz } from './editQuiz.js';
import { initStartQuiz } from './startQuiz.js';

// ===== AUTH INITIALIZATION =====

/**
 * Initialize app: Check if user is logged in
 * If not, show login screen
 * If yes, show dashboard
 */
async function initializeApp() {
    console.log('🔍 Checking authentication...');
    
    const user = await getCurrentUser();
    const loginSection = document.getElementById('loginSection');
    const mainDashboardSection = document.getElementById('mainDashboardSection');
    
    if (!user) {
        // User not logged in - show login screen
        console.log('❌ User not logged in - showing login screen');
        loginSection.style.display = 'flex';
        mainDashboardSection.style.display = 'none';
        setupLoginHandlers();
        return;
    }
    
    // User logged in - show dashboard
    console.log('✅ User logged in - showing dashboard');
    loginSection.style.display = 'none';
    mainDashboardSection.style.display = 'block';
    
    // Initialize the rest of the app
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
                if (loginError) {
                    loginError.style.display = 'none';
                }
                
                console.log('🔐 Attempting login...');
                
                // Attempt login
                await signIn(email, password);
                
                console.log('✅ Login successful!');
                
                // Success - reinitialize app to show dashboard
                await initializeApp();
                
            } catch (error) {
                // Show error message
                console.error('❌ Login error:', error);
                if (loginError) {
                    loginError.textContent = error.message || 'Login failed. Please check your email and password.';
                    loginError.style.display = 'block';
                }
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
                console.log('🚪 Logging out...');
                await signOut();
                console.log('✅ Logged out');
                
                // Show login screen again
                await initializeApp();
            } catch (error) {
                console.error('❌ Logout failed:', error);
                alert('Logout failed: ' + error.message);
            }
        });
    }
}

/**
 * Initialize dashboard (main app functionality)
 * This is called after login succeeds
 */
function initializeDashboard() {
    console.log('📊 Initializing dashboard...');
    
    // Setup logout button
    setupLogoutButton();
    
    // Setup all the main dashboard buttons
    setupMainDashboardButtons();
    
    // Initialize theme if needed
    applyThemeSettings();
    
    console.log('✅ Dashboard initialized successfully!');
}

// ===== MAIN DASHBOARD BUTTONS =====

/**
 * Setup all main dashboard button click handlers
 */
function setupMainDashboardButtons() {
    // Start Quiz Button
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', async function() {
            try {
                await initStartQuiz();
                showSection('startQuizSection');
            } catch (error) {
                console.error('Error initializing start quiz:', error);
                showNotification('Error loading quizzes: ' + error.message);
            }
        });
    }
    
    // Create Quiz Button
    const createQuizBtn = document.getElementById('createQuizBtn');
    if (createQuizBtn) {
        createQuizBtn.addEventListener('click', function() {
            if (typeof initCreateQuiz === 'function') {
                initCreateQuiz();
            }
            showSection('createQuizSection');
        });
    }
    
    // Edit Quiz Button
    const editQuizBtn = document.getElementById('editQuizBtn');
    if (editQuizBtn) {
        editQuizBtn.addEventListener('click', async function() {
            try {
                await initEditQuiz();
                showSection('editQuizSection');
            } catch (error) {
                console.error('Error initializing edit quiz:', error);
                showNotification('Error loading quizzes: ' + error.message);
            }
        });
    }
    
    // Print Quiz Button
    const printQuizBtn = document.getElementById('printQuizBtn');
    if (printQuizBtn) {
        printQuizBtn.addEventListener('click', function() {
            if (typeof loadQuizzesForPrinting === 'function') {
                loadQuizzesForPrinting();
                showSection('printQuizSection');
            } else {
                showNotification('Print feature coming soon!');
            }
        });
    }
    
    // Review Due Button
    const reviewDueBtn = document.getElementById('reviewDueBtn');
    if (reviewDueBtn) {
        reviewDueBtn.addEventListener('click', function() {
            if (typeof startReviewDueSession === 'function') {
                startReviewDueSession();
            } else {
                showNotification('Review feature coming soon!');
            }
        });
    }
    
    // Mixed Practice Button
    const mixedPracticeBtn = document.getElementById('mixedPracticeBtn');
    if (mixedPracticeBtn) {
        mixedPracticeBtn.addEventListener('click', function() {
            if (typeof loadQuizzesForMixedPractice === 'function') {
                loadQuizzesForMixedPractice();
                showSection('mixedPracticeSelectionSection');
            } else {
                showNotification('Mixed practice feature coming soon!');
            }
        });
    }
    
    // Back from Mixed Practice Selection
    const backFromMixedSelectBtn = document.getElementById('backFromMixedSelectBtn');
    if (backFromMixedSelectBtn) {
        backFromMixedSelectBtn.addEventListener('click', function() {
            if (window.selectedQuizzes) {
                selectedQuizzes.clear();
            }
            showSection('mainDashboard');
        });
    }
    
    // Select All Quizzes
    const selectAllQuizzesBtn = document.getElementById('selectAllQuizzesBtn');
    if (selectAllQuizzesBtn) {
        selectAllQuizzesBtn.addEventListener('click', function() {
            if (typeof selectAllQuizzes === 'function') {
                selectAllQuizzes();
            }
        });
    }
    
    // Clear All Quizzes
    const clearAllQuizzesBtn = document.getElementById('clearAllQuizzesBtn');
    if (clearAllQuizzesBtn) {
        clearAllQuizzesBtn.addEventListener('click', function() {
            if (typeof clearAllQuizzes === 'function') {
                clearAllQuizzes();
            }
        });
    }
    
    // Start Mixed Session
    const startMixedSessionBtn = document.getElementById('startMixedSessionBtn');
    if (startMixedSessionBtn) {
        startMixedSessionBtn.addEventListener('click', function() {
            if (typeof startMixedSession === 'function') {
                startMixedSession();
            } else {
                showNotification('Mixed practice feature coming soon!');
            }
        });
    }
    
    // Export Quizzes Button
    const exportQuizzesBtn = document.getElementById('exportQuizzesBtn');
    if (exportQuizzesBtn) {
        exportQuizzesBtn.addEventListener('click', function() {
            if (typeof exportAllData === 'function') {
                exportAllData();
            } else {
                showNotification('Export feature coming soon!');
            }
        });
    }
    
    // Import Quizzes Button
    const importQuizzesBtn = document.getElementById('importQuizzesBtn');
    if (importQuizzesBtn) {
        importQuizzesBtn.addEventListener('click', function() {
            const importFileInput = document.getElementById('importFileInput');
            if (importFileInput) {
                importFileInput.click();
            }
        });
    }
    
    // Import File Input Handler
    const importFileInput = document.getElementById('importFileInput');
    if (importFileInput) {
        importFileInput.addEventListener('change', function(e) {
            if (typeof handleImportFile === 'function') {
                handleImportFile(e.target.files[0]);
            }
            e.target.value = '';
        });
    }
}

// ===== CREATE QUIZ SECTION BUTTONS =====

/**
 * Setup create quiz section buttons
 */
function setupCreateQuizButtons() {
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
            if (typeof addQuestion === 'function') {
                addQuestion();
            }
        });
    }
    
    // Save Quiz
    const saveQuizBtn = document.getElementById('saveQuizBtn');
    if (saveQuizBtn) {
        saveQuizBtn.addEventListener('click', async function() {
            try {
                if (typeof saveQuiz === 'function') {
                    await saveQuiz();
                } else {
                    showNotification('Save function not found');
                }
            } catch (error) {
                console.error('Error saving quiz:', error);
                showNotification('Error saving quiz: ' + error.message);
            }
        });
    }
}

// ===== EDIT QUIZ SECTION BUTTONS =====

/**
 * Setup edit quiz section buttons
 */
function setupEditQuizButtons() {
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
            location.reload();
        });
    }
}

// ===== START QUIZ SECTION BUTTONS =====

/**
 * Setup start quiz section buttons
 */
function setupStartQuizButtons() {
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
        backFromQuizBtn.addEventListener('click', async function() {
            try {
                await initStartQuiz();
                showSection('startQuizSection');
            } catch (error) {
                console.error('Error reloading quizzes:', error);
                showNotification('Error loading quizzes: ' + error.message);
            }
        });
    }
}

// ===== RESULTS SECTION BUTTONS =====

/**
 * Setup results section buttons
 */
function setupResultsButtons() {
    // Back from Results
    const backFromResultsBtn = document.getElementById('backFromResultsBtn');
    if (backFromResultsBtn) {
        backFromResultsBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
}

// ===== PRINT SECTION BUTTONS =====

/**
 * Setup print section buttons
 */
function setupPrintButtons() {
    // Back from Print
    const backFromPrintBtn = document.getElementById('backFromPrintBtn');
    if (backFromPrintBtn) {
        backFromPrintBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Show a section and hide others
 * @param {string} sectionId - ID of section to show
 */
export function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('[id*="Section"], [id*="Dashboard"], [id*="Page"]');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show requested section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

/**
 * Show notification to user
 * @param {string} message - Message to display
 */
export function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    } else {
        console.log('Notification:', message);
    }
}

/**
 * Apply theme settings
 */
function applyThemeSettings() {
    // This can be expanded to load user's theme preference from database
    const body = document.body;
    body.classList.add('light-theme'); // Default theme
}

// ===== SECURITY: PREVENT INSPECTION =====

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

// ===== BIND FUNCTIONS TO WINDOW FOR INLINE HANDLER ACCESSIBILITY =====
// This allows inline HTML event handlers (like onclick="") to access these functions

window.showSection = showSection;
window.showNotification = showNotification;

// ===== BIND FUNCTIONS TO WINDOW FOR INLINE HANDLER ACCESSIBILITY =====
window.showSection = showSection;
window.showNotification = showNotification;
window.getCurrentUser = getCurrentUser;
window.signIn = signIn;
window.signOut = signOut;

// ===== START APP =====

/**
 * Initialize app when page loads
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 QuizCall v4.0 starting...');
    
    // Setup all button handlers
    setupCreateQuizButtons();
    setupEditQuizButtons();
    setupStartQuizButtons();
    setupResultsButtons();
    setupPrintButtons();
    
    // Check authentication and initialize
    await initializeApp();
});