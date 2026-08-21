// ============================================================
// app.js - PHASE 4: AUTHENTICATION + DASHBOARD (FIXED v2)
// FIXED: Better error handling, logging, and form submission
// ============================================================

import { getCurrentUser, signIn, signOut } from './auth.js';
import { initEditQuiz } from './editQuiz.js';
import { initStartQuiz } from './startQuiz.js';

console.log('📱 App module loading...');

// ===== AUTH INITIALIZATION =====

/**
 * Initialize app: Check if user is logged in
 * If not, show login screen
 * If yes, show dashboard
 */
async function initializeApp() {
    console.log('🔍 Checking authentication status...');
    
    try {
        const user = await getCurrentUser();
        const loginSection = document.getElementById('loginSection');
        const mainDashboardSection = document.getElementById('mainDashboardSection');
        
        if (!loginSection || !mainDashboardSection) {
            console.error('❌ Required DOM elements not found');
            return;
        }
        
        if (!user) {
            // User not logged in - show login screen
            console.log('❌ User not logged in - showing login screen');
            loginSection.style.display = 'flex';
            mainDashboardSection.style.display = 'none';
            setupLoginHandlers();
            return;
        }
        
        // User logged in - show dashboard
        console.log('✅ User authenticated:', user.email);
        loginSection.style.display = 'none';
        mainDashboardSection.style.display = 'block';
        
        // Initialize the rest of the app
        initializeDashboard();
    } catch (error) {
        console.error('❌ Error during app initialization:', error);
        showNotification('Error initializing app. Please refresh the page.');
    }
}

/**
 * Setup login form handlers
 * CRITICAL: This must run AFTER DOM is ready and loginForm element exists
 */
function setupLoginHandlers() {
    console.log('⚙️ Setting up login form handlers...');
    
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (!loginForm) {
        console.error('❌ Login form element not found!');
        return;
    }
    
    console.log('✅ Login form found, attaching submit handler');
    
    // Remove any existing listeners
    const newForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newForm, loginForm);
    
    // Attach fresh listener
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('📝 Login form submitted');
        
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!emailInput || !passwordInput) {
            console.error('❌ Email or password input not found');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validate inputs
        if (!email || !password) {
            console.warn('⚠️ Email or password is empty');
            if (loginError) {
                loginError.textContent = 'Please enter both email and password.';
                loginError.style.display = 'block';
            }
            return;
        }
        
        try {
            // Clear previous errors
            if (loginError) {
                loginError.style.display = 'none';
                loginError.textContent = '';
            }
            
            console.log('🔐 Attempting login with email:', email);
            
            // Show loading state
            const submitBtn = document.querySelector('#loginForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Logging in...';
            }
            
            // Attempt login
            const result = await signIn(email, password);
            
            console.log('✅ Login successful!', result);
            
            // Show success notification
            showNotification('✅ Login successful! Loading dashboard...');
            
            // Wait a moment then reinitialize app to show dashboard
            await new Promise(resolve => setTimeout(resolve, 500));
            await initializeApp();
            
        } catch (error) {
            console.error('❌ Login error:', error.message);
            
            // Re-enable submit button
            const submitBtn = document.querySelector('#loginForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Log In';
            }
            
            // Show error message
            if (loginError) {
                loginError.textContent = error.message || 'Login failed. Please check your email and password.';
                loginError.style.display = 'block';
            }
            
            showNotification('❌ Login failed: ' + (error.message || 'Unknown error'));
        }
    });
    
    console.log('✅ Login handlers setup complete');
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
                showNotification('Logout failed: ' + error.message);
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
                console.log('📖 Loading quizzes...');
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

// ===== UTILITY FUNCTIONS =====

/**
 * Show a section and hide others
 * @param {string} sectionId - ID of section to show
 */
export function showSection(sectionId) {
    console.log('👁️ Showing section:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('[id*="Section"], [id*="Dashboard"], [id*="Page"]');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show requested section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    } else {
        console.warn('⚠️ Section not found:', sectionId);
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
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.style.display = 'none';
            notification.classList.remove('show');
        }, 3000);
    } else {
        console.log('📢 Notification:', message);
    }
}

/**
 * Apply theme settings
 */
function applyThemeSettings() {
    // This can be expanded to load user's theme preference from database
    const body = document.body;
    if (!body.classList.contains('dark-theme')) {
        body.classList.add('light-theme');
    }
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
window.getCurrentUser = getCurrentUser;
window.signIn = signIn;
window.signOut = signOut;
window.initializeApp = initializeApp;

// Debug helpers
window.appDebug = {
    showSection,
    showNotification,
    initializeApp
};

console.log('✅ App module loaded');

// ===== START APP =====

/**
 * Initialize app when page loads
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 QuizCall v4.0 starting...');
    console.log('📋 DOM Content Loaded - beginning initialization');
    
    try {
        // Wait a tiny moment to ensure all modules are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check authentication and initialize
        await initializeApp();
        
        console.log('✅ App initialization complete');
    } catch (error) {
        console.error('❌ Fatal error during app initialization:', error);
    }
});