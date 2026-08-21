// startQuiz.js - Phase 4: Start and Take Quizzes from Database
// Loads quizzes from database, allows user to take them and saves attempts

import { getAllQuizzes, getQuiz, saveAttempt } from './storage.js';

// ===== STATE =====
let currentTakingQuizId = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;

// ===== INITIALIZATION =====

/**
 * Initialize Start Quiz section
 * Load all quizzes from database
 */
export async function initStartQuiz() {
    console.log('🎯 Initializing Start Quiz section...');
    
    try {
        // Load all quizzes from database
        const quizzes = await getAllQuizzes();
        console.log('✅ Loaded quizzes:', quizzes.length);
        
        // Display quizzes for selection
        displayQuizzesForSelection(quizzes);
    } catch (error) {
        console.error('❌ Error loading quizzes:', error);
        showNotification('Error loading quizzes: ' + error.message);
    }
}

// ===== DISPLAY QUIZZES =====

/**
 * Display quizzes in the selection list
 * @param {Array} quizzes - Array of quiz objects
 */
function displayQuizzesForSelection(quizzes) {
    console.log('Displaying quizzes for selection:', quizzes.length);
    
    const quizList = document.getElementById('startQuizzesList');
    
    if (!quizList) {
        console.error('Start quizzes list element not found');
        return;
    }
    
    // Clear existing content
    quizList.innerHTML = '';
    
    if (quizzes.length === 0) {
        quizList.innerHTML = '<p style="text-align: center; color: #999;">No quizzes available. Create one first!</p>';
        return;
    }
    
    // Create quiz selection cards
    quizzes.forEach(quiz => {
        const quizCard = createQuizSelectionCard(quiz);
        quizList.appendChild(quizCard);
    });
}

/**
 * Create a quiz selection card
 * @param {Object} quiz - Quiz object
 * @returns {HTMLElement} - Quiz card element
 */
function createQuizSelectionCard(quiz) {
    const card = document.createElement('div');
    card.className = 'quiz-selection-card';
    card.id = `quiz-select-${quiz.id}`;
    
    const questionsCount = quiz.questions ? quiz.questions.length : 0;
    
    card.innerHTML = `
        <div class="quiz-selection-content">
            <h3>${escapeHtml(quiz.title || 'Untitled Quiz')}</h3>
            <p class="quiz-selection-meta">
                <span>📚 ${escapeHtml(quiz.unit || 'No unit')}</span>
                <span>❓ ${questionsCount} questions</span>
            </p>
        </div>
        <button class="primary-button start-quiz-btn" data-quiz-id="${quiz.id}">
            ▶️ Start
        </button>
    `;
    
    // Add click listener to start button
    const startBtn = card.querySelector('.start-quiz-btn');
    startBtn.addEventListener('click', async () => {
        await startQuizSession(parseInt(quiz.id));
    });
    
    return card;
}

// ===== START QUIZ SESSION =====

/**
 * Start a quiz session for a specific quiz
 * @param {number} quizId - Quiz ID to start
 */
async function startQuizSession(quizId) {
    console.log('Starting quiz session:', quizId);
    
    try {
        // Load quiz from database
        const quiz = await getQuiz(quizId);
        
        if (!quiz) {
            showNotification('Quiz not found');
            return;
        }
        
        if (!quiz.questions || quiz.questions.length === 0) {
            showNotification('This quiz has no questions');
            return;
        }
        
        // Initialize session
        currentTakingQuizId = quiz.id;
        currentQuiz = quiz;
        currentQuestionIndex = 0;
        userAnswers = [];
        quizStartTime = Date.now();
        
        // Show quiz taking section
        const startSection = document.getElementById('startQuizSection');
        const quizSection = document.getElementById('quizTakingSection');
        
        if (startSection) startSection.style.display = 'none';
        if (quizSection) quizSection.style.display = 'block';
        
        // Display first question
        displayQuestion();
    } catch (error) {
        console.error('❌ Error starting quiz:', error);
        showNotification('Error loading quiz: ' + error.message);
    }
}

// ===== DISPLAY QUESTIONS =====

/**
 * Display current question
 */
function displayQuestion() {
    if (!currentQuiz || !currentQuiz.questions || currentQuestionIndex >= currentQuiz.questions.length) {
        return;
    }
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const questionContainer = document.getElementById('currentQuestionContainer');
    
    if (!questionContainer) {
        console.error('Question container not found');
        return;
    }
    
    // Clear container
    questionContainer.innerHTML = '';
    
    // Create question display
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-display';
    
    // Question number and text
    const questionHeader = document.createElement('div');
    questionHeader.style.marginBottom = '20px';
    questionHeader.innerHTML = `
        <h3>Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</h3>
        <p style="font-size: 18px; margin-top: 10px;">${escapeHtml(question.text || '')}</p>
    `;
    questionDiv.appendChild(questionHeader);
    
    // Answers
    const answersDiv = document.createElement('div');
    answersDiv.className = 'answers-display';
    
    if (question.answers && question.answers.length > 0) {
        question.answers.forEach((answer, index) => {
            const label = document.createElement('label');
            label.className = 'answer-option';
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.padding = '12px';
            label.style.margin = '10px 0';
            label.style.border = '2px solid #ddd';
            label.style.borderRadius = '8px';
            label.style.cursor = 'pointer';
            label.style.transition = 'all 0.2s';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${currentQuestionIndex}`;
            input.value = index;
            input.className = 'answer-radio';
            
            // Check if this answer was already selected
            if (userAnswers[currentQuestionIndex] === index) {
                input.checked = true;
            }
            
            input.addEventListener('change', () => {
                userAnswers[currentQuestionIndex] = index;
                console.log('Answer selected:', index);
            });
            
            const span = document.createElement('span');
            span.style.marginLeft = '10px';
            span.textContent = escapeHtml(answer.text || '');
            
            label.appendChild(input);
            label.appendChild(span);
            answersDiv.appendChild(label);
        });
    }
    
    questionDiv.appendChild(answersDiv);
    questionContainer.appendChild(questionDiv);
    
    // Update navigation buttons
    updateNavigationButtons();
}

/**
 * Update previous/next button states
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const finishBtn = document.getElementById('finishQuizBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
        if (currentQuestionIndex === currentQuiz.questions.length - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
        }
    }
    
    if (finishBtn) {
        if (currentQuestionIndex === currentQuiz.questions.length - 1) {
            finishBtn.style.display = 'block';
        } else {
            finishBtn.style.display = 'none';
        }
    }
}

// ===== NAVIGATION =====

/**
 * Go to previous question
 */
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

/**
 * Go to next question
 */
function goToNextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

/**
 * Finish quiz and save results
 */
async function finishQuiz() {
    console.log('Finishing quiz...');
    
    try {
        // Calculate score
        let score = 0;
        currentQuiz.questions.forEach((question, index) => {
            const userAnswerIndex = userAnswers[index];
            if (userAnswerIndex !== undefined && question.answers[userAnswerIndex]) {
                if (question.answers[userAnswerIndex].isCorrect) {
                    score++;
                }
            }
        });
        
        // Calculate time spent
        const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
        
        console.log(`Score: ${score}/${currentQuiz.questions.length}, Time: ${timeSpent}s`);
        
        // Save attempt to database
        await saveAttempt(
            currentTakingQuizId,
            score,
            currentQuiz.questions.length,
            timeSpent,
            userAnswers
        );
        
        // Show results
        displayResults(score, currentQuiz.questions.length, timeSpent);
    } catch (error) {
        console.error('❌ Error finishing quiz:', error);
        showNotification('Error saving results: ' + error.message);
    }
}

/**
 * Display quiz results
 * @param {number} score - Score achieved
 * @param {number} total - Total questions
 * @param {number} timeSpent - Time spent in seconds
 */
function displayResults(score, total, timeSpent) {
    const resultsSection = document.getElementById('quizResultsSection');
    const quizSection = document.getElementById('quizTakingSection');
    
    if (!resultsSection) {
        console.error('Results section not found');
        return;
    }
    
    if (quizSection) quizSection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'block';
    
    // Calculate percentage
    const percentage = Math.round((score / total) * 100);
    
    // Determine message
    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfect score!';
    } else if (percentage >= 80) {
        message = '🌟 Great job!';
    } else if (percentage >= 60) {
        message = '👍 Good effort!';
    } else {
        message = '📚 Keep practicing!';
    }
    
    // Format time
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    // Display results
    const resultsContent = document.getElementById('quizResultsContent');
    if (resultsContent) {
        resultsContent.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <h2 style="font-size: 36px; margin-bottom: 20px;">${message}</h2>
                <div style="background: rgba(0,0,0,0.05); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="font-size: 48px; margin: 0;">${score} / ${total}</h3>
                    <p style="font-size: 24px; margin: 10px 0; color: #666;">${percentage}%</p>
                    <p style="font-size: 16px; color: #999;">Time: ${timeStr}</p>
                </div>
            </div>
        `;
    }
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

/**
 * Show notification to user
 * @param {string} message - Notification message
 */
function showNotification(message) {
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
 * Show a section and hide others
 * @param {string} sectionId - ID of section to show
 */
function showSection(sectionId) {
    const sections = document.querySelectorAll('[id*="Section"], [id*="Dashboard"], [id*="Page"]');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

// ===== SETUP EVENT LISTENERS =====

/**
 * Setup event listeners for quiz navigation
 */
function setupQuizEventListeners() {
    // Previous Question
    const prevBtn = document.getElementById('prevQuestionBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPreviousQuestion);
    }
    
    // Next Question
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextQuestion);
    }
    
    // Finish Quiz
    const finishBtn = document.getElementById('finishQuizBtn');
    if (finishBtn) {
        finishBtn.addEventListener('click', finishQuiz);
    }
    
    // Back from Quiz
    const backFromQuizBtn = document.getElementById('backFromQuizBtn');
    if (backFromQuizBtn) {
        backFromQuizBtn.addEventListener('click', () => {
            currentTakingQuizId = null;
            currentQuiz = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            showSection('startQuizSection');
            initStartQuiz();
        });
    }
    
    // Back from Results
    const backFromResultsBtn = document.getElementById('backFromResultsBtn');
    if (backFromResultsBtn) {
        backFromResultsBtn.addEventListener('click', () => {
            currentTakingQuizId = null;
            currentQuiz = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            showSection('mainDashboard');
        });
    }
}

// ===== EXPORTS =====

export default {
    initStartQuiz,
    goToPreviousQuestion,
    goToNextQuestion,
    finishQuiz
};

// Setup listeners when module loads
setupQuizEventListeners();