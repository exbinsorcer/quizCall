import { getAllQuizzes } from './storage.js';

async function initDashboard() {
    try {
        const quizzes = await getAllQuizzes();
        displayQuizzesInDashboard(quizzes);
    } catch (error) {
        console.error('Failed to load quizzes:', error);
    }
}
initDashboard();

// ============================================================
// MAIN DASHBOARD SCRIPT
// Handles navigation and dark/light mode
// ============================================================

// DARK/LIGHT MODE TOGGLE
const savedTheme = localStorage.getItem('app-theme') || 'light-theme';
document.body.className = savedTheme;

function toggleDarkMode() {
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('app-theme', 'light-theme');
        document.getElementById('darkModeToggle').textContent = '🌙';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('app-theme', 'dark-theme');
        document.getElementById('darkModeToggle').textContent = '☀️';
    }
}

// REMINDERS FUNCTIONS
function displayRemindersDate() {
    const dateEl = document.getElementById('remindersDate');
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    dateEl.textContent = today;
}

function getAllReminders() {
    const data = localStorage.getItem('reminders');
    return data ? JSON.parse(data) : [];
}

function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function addReminder() {
    const input = document.getElementById('reminderInput');
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

function deleteReminder(reminderId) {
    const reminders = getAllReminders();
    const filtered = reminders.filter(r => r.id !== reminderId);
    saveReminders(filtered);
    showNotification('🗑️ Reminder deleted');
    loadReminders();
}

function loadReminders() {
    const remindersList = document.getElementById('remindersList');
    const reminders = getAllReminders();
    
    if (reminders.length === 0) {
        remindersList.innerHTML = '<p style="text-align: center; color: #9ca3af;">📭 No reminders yet</p>';
        return;
    }
    
    remindersList.innerHTML = reminders.map(reminder => `
        <div class="reminder-item">
            <p class="reminder-text">${reminder.text}</p>
            <button class="reminder-delete-btn" onclick="deleteReminder(${reminder.id})">🗑️</button>
        </div>
    `).join('');
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    // Setup Dark Mode Toggle Button
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        toggleBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        toggleBtn.addEventListener('click', toggleDarkMode);
    }
    
    // Study Button - shows Quiz app
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
            initDailyIntake();
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
            saveIntakeEntry();
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

    // Back from Reminders
    const backFromRemindersBtn = document.getElementById('backFromRemindersBtn');
    if (backFromRemindersBtn) {
        backFromRemindersBtn.addEventListener('click', function() {
            showSection('mainDashboard');
        });
    }

    // Add Reminder
    const reminderAddBtn = document.getElementById('reminderAddBtn');
    if (reminderAddBtn) {
        reminderAddBtn.addEventListener('click', function() {
            addReminder();
        });
    }

    // Allow Enter to add reminder
    const reminderInput = document.getElementById('reminderInput');
    if (reminderInput) {
        reminderInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                addReminder();
            }
        });
    }

    // Back from Quiz Dashboard
    const backToMainFromQuizBtn = document.getElementById('backToMainFromQuizBtn');
    if (backToMainFromQuizBtn) {
        backToMainFromQuizBtn.addEventListener('click', function() {
            currentTakingQuizId = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            showSection('mainDashboard');
        });
    }
});