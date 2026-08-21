// mainDashboard.js - PHASE 4: Main Dashboard Navigation
// FIXED: Import functions from app.js and bind inline handlers to window

// Import core functions from app.js
import { showSection, showNotification } from './app.js';

// ===== THEME MANAGEMENT =====

/**
 * Initialize theme from localStorage or set default
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('app-theme') || 'light-theme';
    document.body.className = savedTheme;
    updateThemeToggleButton();
}

/**
 * Update theme toggle button display
 */
function updateThemeToggleButton() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const isDark = document.body.classList.contains('dark-theme');
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }
}

/**
 * Toggle between dark and light theme
 */
function toggleDarkMode() {
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('app-theme', 'light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('app-theme', 'dark-theme');
    }
    
    updateThemeToggleButton();
}

// ===== REMINDERS FUNCTIONS =====

/**
 * Display current date in reminders section
 */
function displayRemindersDate() {
    const dateEl = document.getElementById('remindersDate');
    if (dateEl) {
        const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        dateEl.textContent = today;
    }
}

/**
 * Get all reminders from localStorage
 * @returns {Array} - Array of reminders
 */
function getAllReminders() {
    const data = localStorage.getItem('reminders');
    return data ? JSON.parse(data) : [];
}

/**
 * Save reminders to localStorage
 * @param {Array} reminders - Array of reminders
 */
function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

/**
 * Add a new reminder
 */
function addReminder() {
    const input = document.getElementById('reminderInput');
    
    if (!input) {
        console.error('Reminder input not found');
        return;
    }
    
    const text = input.value.trim();
    
    if (!text) {
        showNotification('❌ Reminder cannot be empty');
        return;
    }
    
    const reminders = getAllReminders();
    reminders.push({
        id: Date.now(),
        text: text,
        date: new Date().toLocaleDateString()
    });
    
    saveReminders(reminders);
    input.value = '';
    showNotification('✅ Reminder added!');
    loadReminders();
}

/**
 * Delete a reminder by ID
 * IMPORTANT: Exposed to window object for inline onclick handlers
 * @param {number} reminderId - ID of reminder to delete
 */
function deleteReminder(reminderId) {
    const reminders = getAllReminders();
    const filtered = reminders.filter(r => r.id !== reminderId);
    saveReminders(filtered);
    showNotification('🗑️ Reminder deleted');
    loadReminders();
}

/**
 * Load and display all reminders
 */
function loadReminders() {
    const remindersList = document.getElementById('remindersList');
    
    if (!remindersList) {
        console.error('Reminders list element not found');
        return;
    }
    
    const reminders = getAllReminders();
    
    if (reminders.length === 0) {
        remindersList.innerHTML = '<p style="text-align: center; color: #9ca3af;">📭 No reminders yet</p>';
        return;
    }
    
    remindersList.innerHTML = reminders.map(reminder => `
        <div class="reminder-item">
            <p class="reminder-text">${escapeHtml(reminder.text)}</p>
            <button class="reminder-delete-btn" onclick="window.deleteReminder(${reminder.id})">🗑️</button>
        </div>
    `).join('');
}

// ===== UTILITY FUNCTIONS =====

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== INITIALIZATION =====

/**
 * Initialize main dashboard when page loads
 */
function initMainDashboard() {
    console.log('📊 Initializing main dashboard...');
    
    // Setup theme
    initializeTheme();
    
    // Setup main navigation buttons
    setupMainNavigationButtons();
    
    // Setup reminders buttons
    setupRemindersButtons();
    
    // Setup eat section buttons
    setupEatButtons();
    
    console.log('✅ Main dashboard initialized');
}

/**
 * Setup main navigation buttons (Study, Eat, Reminders, Progress)
 */
function setupMainNavigationButtons() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Study Button - goes to quiz dashboard
    const studyBtn = document.getElementById('studyBtn');
    if (studyBtn) {
        studyBtn.addEventListener('click', function() {
            showSection('quizDashboard');
        });
    }
    
    // Eat Button
    const eatBtn = document.getElementById('eatBtn');
    if (eatBtn) {
        eatBtn.addEventListener('click', function() {
            showSection('eatDashboard');
        });
    }
    
    // Progress Button
    const progressBtn = document.getElementById('progressBtn');
    if (progressBtn) {
        progressBtn.addEventListener('click', function() {
            showNotification('📈 Progress tracking coming soon!');
        });
    }
    
    // Reminders Button
    const remindersBtn = document.getElementById('remindersBtn');
    if (remindersBtn) {
        remindersBtn.addEventListener('click', function() {
            displayRemindersDate();
            loadReminders();
            showSection('remindersPage');
        });
    }
}

/**
 * Setup reminders section buttons
 */
function setupRemindersButtons() {
    // Back from Reminders
    const backFromRemindersBtn = document.getElementById('backFromRemindersBtn');
    if (backFromRemindersBtn) {
        backFromRemindersBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
    
    // Add Reminder Button
    const reminderAddBtn = document.getElementById('reminderAddBtn');
    if (reminderAddBtn) {
        reminderAddBtn.addEventListener('click', function() {
            addReminder();
        });
    }
    
    // Allow Enter key to add reminder
    const reminderInput = document.getElementById('reminderInput');
    if (reminderInput) {
        reminderInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                addReminder();
            }
        });
    }
}

/**
 * Setup eat section buttons
 */
function setupEatButtons() {
    // Back from Eat
    const backToMainFromEatBtn = document.getElementById('backToMainFromEatBtn');
    if (backToMainFromEatBtn) {
        backToMainFromEatBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }
    
    // Daily Intake Button
    const dailyIntakeBtn = document.getElementById('dailyIntakeBtn');
    if (dailyIntakeBtn) {
        dailyIntakeBtn.addEventListener('click', function() {
            if (typeof initDailyIntake === 'function') {
                initDailyIntake();
            }
            showSection('dailyIntakePage');
        });
    }
    
    // Back from Daily Intake
    const backFromDailyIntakeBtn = document.getElementById('backFromDailyIntakeBtn');
    if (backFromDailyIntakeBtn) {
        backFromDailyIntakeBtn.addEventListener('click', function() {
            showSection('eatDashboard');
        });
    }
    
    // Save Intake Entry
    const saveIntakeBtn = document.getElementById('saveIntakeBtn');
    if (saveIntakeBtn) {
        saveIntakeBtn.addEventListener('click', function() {
            if (typeof saveIntakeEntry === 'function') {
                saveIntakeEntry();
            }
        });
    }
}

// ===== EXPOSE FUNCTIONS TO WINDOW FOR INLINE EVENT HANDLERS =====
// This allows inline HTML onclick attributes to access these functions

window.deleteReminder = deleteReminder;
window.showSection = showSection;

// ===== START APP =====

/**
 * Initialize when page loads
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Main dashboard loading...');
        initMainDashboard();
    });
} else {
    // DOM already loaded (for ES modules)
    console.log('🚀 Main dashboard loading...');
    initMainDashboard();
}