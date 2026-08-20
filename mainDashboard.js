// ============================================================
// MAIN DASHBOARD SCRIPT
// Handles theme toggle and navigation between Study and Eat
// ============================================================

// THEME TOGGLE LOGIC
const themeToggleBtn = document.getElementById('themeToggleBtn');
const savedTheme = localStorage.getItem('app-theme') || 'light-theme';
document.body.className = savedTheme;
updateThemeButton();

function updateThemeButton() {
    const isDark = document.body.classList.contains('dark-theme');
    themeToggleBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

themeToggleBtn.addEventListener('click', function() {
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
    
    updateThemeButton();
});

// NAVIGATION FUNCTIONS
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

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    // Study Button - goes to Quiz app
    const studyBtn = document.getElementById('studyBtn');
    if (studyBtn) {
        studyBtn.addEventListener('click', function() {
            window.location.href = './quizCall.html';
        });
    }

    // Eat Button - shows Nutrition section
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

    // Daily Intake Button - Coming Soon
    const dailyIntakeBtn = document.getElementById('dailyIntakeBtn');
    if (dailyIntakeBtn) {
        dailyIntakeBtn.addEventListener('click', function() {
            showNotification('📊 Daily Intake feature coming soon!');
        });
    }

    // Progress Button - Coming Soon
    const progressBtn = document.getElementById('progressBtn');
    if (progressBtn) {
        progressBtn.addEventListener('click', function() {
            showNotification('📈 Progress tracking coming soon!');
        });
    }
});