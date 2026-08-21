// editQuiz.js - Phase 4: Edit Quizzes from Database
// Loads quizzes from database, allows editing and deletion

import { getAllQuizzes, getQuiz, updateQuizData, deleteQuizData } from './storage.js';

// ===== STATE =====
let currentEditingQuizId = null;
let allQuizzesForEditing = [];

// ===== INITIALIZATION =====

/**
 * Initialize Edit Quiz section
 * Load all quizzes and display them for editing
 */
export async function initEditQuiz() {
    console.log('🔧 Initializing Edit Quiz section...');
    
    try {
        // Load all quizzes from database
        allQuizzesForEditing = await getAllQuizzes();
        console.log('✅ Loaded quizzes:', allQuizzesForEditing.length);
        
        // Display quizzes in the edit list
        displayEditQuizzes(allQuizzesForEditing);
        
        // Setup event listeners
        setupEditQuizEventListeners();
    } catch (error) {
        console.error('❌ Error initializing edit quiz:', error);
        showNotification('Error loading quizzes: ' + error.message);
    }
}

// ===== DISPLAY QUIZZES =====

/**
 * Display all quizzes in a list for editing
 * @param {Array} quizzes - Array of quiz objects
 */
function displayEditQuizzes(quizzes) {
    console.log('Displaying quizzes for editing:', quizzes.length);
    
    const editQuizzesList = document.getElementById('editQuizzesList');
    
    if (!editQuizzesList) {
        console.error('editQuizzesList element not found');
        return;
    }
    
    // Clear existing content
    editQuizzesList.innerHTML = '';
    
    if (quizzes.length === 0) {
        editQuizzesList.innerHTML = '<p style="text-align: center; color: #999;">No quizzes yet. Create one to get started!</p>';
        return;
    }
    
    // Create quiz items
    quizzes.forEach(quiz => {
        const quizItem = createQuizEditCard(quiz);
        editQuizzesList.appendChild(quizItem);
    });
}

/**
 * Create a quiz card for editing
 * @param {Object} quiz - Quiz object
 * @returns {HTMLElement} - Quiz card element
 */
function createQuizEditCard(quiz) {
    const card = document.createElement('div');
    card.className = 'quiz-library-item';
    card.id = `quiz-edit-${quiz.id}`;
    
    const questionsCount = quiz.questions ? quiz.questions.length : 0;
    
    card.innerHTML = `
        <div class="quiz-item-content">
            <h3>${escapeHtml(quiz.title || 'Untitled Quiz')}</h3>
            <p class="quiz-item-meta">
                <span>📚 ${escapeHtml(quiz.unit || 'No unit')}</span>
                <span>❓ ${questionsCount} questions</span>
            </p>
        </div>
        <div class="quiz-item-buttons">
            <button class="secondary-button edit-quiz-btn" data-quiz-id="${quiz.id}">
                ✏️ Edit
            </button>
            <button class="danger-button delete-quiz-btn" data-quiz-id="${quiz.id}">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}

// ===== EVENT LISTENERS =====

/**
 * Setup event listeners for edit quiz buttons
 */
function setupEditQuizEventListeners() {
    const editQuizzesList = document.getElementById('editQuizzesList');
    
    if (!editQuizzesList) return;
    
    // Edit button click
    editQuizzesList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-quiz-btn')) {
            const quizId = parseInt(e.target.dataset.quizId);
            await openQuizEditor(quizId);
        }
        
        // Delete button click
        if (e.target.classList.contains('delete-quiz-btn')) {
            const quizId = parseInt(e.target.dataset.quizId);
            await deleteQuizHandler(quizId);
        }
    });
    
    // Back button from editor
    const backFromEditorBtn = document.getElementById('backFromQuizEditorBtn');
    if (backFromEditorBtn) {
        backFromEditorBtn.addEventListener('click', () => {
            goBackToEditList();
        });
    }
    
    // Save changes button
    const saveEditQuizBtn = document.getElementById('saveEditQuizBtn');
    if (saveEditQuizBtn) {
        saveEditQuizBtn.addEventListener('click', async () => {
            await saveEditedQuiz();
        });
    }
    
    // Add question button in editor
    const addEditQuestionBtn = document.getElementById('addEditQuestionBtn');
    if (addEditQuestionBtn) {
        addEditQuestionBtn.addEventListener('click', () => {
            addQuestionToEditor();
        });
    }
}

// ===== OPEN QUIZ EDITOR =====

/**
 * Open quiz editor for a specific quiz
 * @param {number} quizId - Quiz ID to edit
 */
async function openQuizEditor(quizId) {
    console.log('Opening editor for quiz:', quizId);
    
    try {
        // Load quiz from database
        const quiz = await getQuiz(quizId);
        
        if (!quiz) {
            showNotification('Quiz not found');
            return;
        }
        
        currentEditingQuizId = quiz.id;
        
        // Hide quiz list, show editor
        document.getElementById('editQuizSection').style.display = 'none';
        document.getElementById('quizEditorSection').style.display = 'block';
        
        // Populate editor with quiz data
        populateEditorWithQuiz(quiz);
    } catch (error) {
        console.error('❌ Error opening editor:', error);
        showNotification('Error loading quiz: ' + error.message);
    }
}

/**
 * Populate editor form with quiz data
 * @param {Object} quiz - Quiz object
 */
function populateEditorWithQuiz(quiz) {
    console.log('Populating editor with quiz:', quiz.title);
    
    // Set title
    const titleInput = document.getElementById('editingQuizTitle');
    if (titleInput) {
        titleInput.value = quiz.title || '';
    }
    
    // Set unit
    const unitInput = document.getElementById('editingQuizUnit');
    if (unitInput) {
        unitInput.value = quiz.unit || '';
    }
    
    // Clear questions container
    const questionsContainer = document.getElementById('editingQuestionsContainer');
    if (questionsContainer) {
        questionsContainer.innerHTML = '';
    }
    
    // Add questions to editor
    if (quiz.questions && quiz.questions.length > 0) {
        quiz.questions.forEach((question, index) => {
            addQuestionToEditor(question);
        });
    }
}

/**
 * Add question input to editor
 * @param {Object} question - Question object (optional)
 */
function addQuestionToEditor(question = null) {
    const container = document.getElementById('editingQuestionsContainer');
    
    if (!container) return;
    
    const questionIndex = container.children.length;
    
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.id = `edit-question-${questionIndex}`;
    
    questionCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3>Question ${questionIndex + 1}</h3>
            <button type="button" class="danger-button remove-question-btn" data-index="${questionIndex}">
                ❌ Remove
            </button>
        </div>
        
        <label>Question Text</label>
        <textarea 
            class="question-text" 
            data-index="${questionIndex}"
            placeholder="Enter question"
            style="width: 100%; min-height: 80px; padding: 10px; margin-bottom: 15px; border: 2px solid #ddd; border-radius: 8px; font-family: inherit;"
        >${question && question.text ? escapeHtml(question.text) : ''}</textarea>
        
        <div class="answers-container" data-index="${questionIndex}" style="margin-bottom: 15px;">
            <!-- Answers will be added here -->
        </div>
        
        <button type="button" class="secondary-button add-answer-btn" data-index="${questionIndex}">
            + Add Answer
        </button>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    `;
    
    container.appendChild(questionCard);
    
    // Add existing answers
    if (question && question.answers) {
        question.answers.forEach((answer, answerIndex) => {
            addAnswerToQuestion(questionIndex, answer);
        });
    } else {
        // Add one empty answer by default
        addAnswerToQuestion(questionIndex);
    }
    
    // Setup event listeners for this question
    setupQuestionEventListeners(questionCard);
}

/**
 * Add answer input to question
 * @param {number} questionIndex - Question index
 * @param {Object} answer - Answer object (optional)
 */
function addAnswerToQuestion(questionIndex, answer = null) {
    const answersContainer = document.querySelector(`.answers-container[data-index="${questionIndex}"]`);
    
    if (!answersContainer) return;
    
    const answerIndex = answersContainer.children.length;
    
    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer-input-group';
    answerDiv.style.marginBottom = '10px';
    
    answerDiv.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center;">
            <input 
                type="text" 
                class="answer-text" 
                placeholder="Answer option"
                value="${answer && answer.text ? escapeHtml(answer.text) : ''}"
                style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
            />
            <label style="display: flex; align-items: center; gap: 5px;">
                <input 
                    type="radio" 
                    name="correct-${questionIndex}"
                    class="correct-answer-radio"
                    ${answer && answer.isCorrect ? 'checked' : ''}
                />
                Correct
            </label>
            <button type="button" class="danger-button remove-answer-btn" style="padding: 5px 10px;">
                ❌
            </button>
        </div>
    `;
    
    answersContainer.appendChild(answerDiv);
    
    // Remove answer listener
    const removeBtn = answerDiv.querySelector('.remove-answer-btn');
    removeBtn.addEventListener('click', () => {
        answerDiv.remove();
    });
}

/**
 * Setup event listeners for a question card
 * @param {HTMLElement} questionCard - Question card element
 */
function setupQuestionEventListeners(questionCard) {
    // Add answer button
    const addAnswerBtn = questionCard.querySelector('.add-answer-btn');
    if (addAnswerBtn) {
        addAnswerBtn.addEventListener('click', () => {
            const questionIndex = addAnswerBtn.dataset.index;
            addAnswerToQuestion(questionIndex);
        });
    }
    
    // Remove question button
    const removeQuestionBtn = questionCard.querySelector('.remove-question-btn');
    if (removeQuestionBtn) {
        removeQuestionBtn.addEventListener('click', () => {
            questionCard.remove();
        });
    }
}

// ===== SAVE EDITED QUIZ =====

/**
 * Save edited quiz to database
 */
async function saveEditedQuiz() {
    console.log('Saving edited quiz:', currentEditingQuizId);
    
    if (!currentEditingQuizId) {
        showNotification('No quiz selected');
        return;
    }
    
    try {
        // Get form data
        const title = document.getElementById('editingQuizTitle')?.value || 'Untitled Quiz';
        const unit = document.getElementById('editingQuizUnit')?.value || '';
        const questions = getQuestionsFromEditor();
        
        if (!title.trim()) {
            showNotification('Please enter a quiz title');
            return;
        }
        
        if (questions.length === 0) {
            showNotification('Please add at least one question');
            return;
        }
        
        // Validate questions
        for (let q of questions) {
            if (!q.text.trim()) {
                showNotification('All questions must have text');
                return;
            }
            if (q.answers.length < 2) {
                showNotification('Each question must have at least 2 answers');
                return;
            }
            if (!q.answers.some(a => a.isCorrect)) {
                showNotification('Each question must have a correct answer');
                return;
            }
        }
        
        // Update quiz in database
        const updated = await updateQuizData(currentEditingQuizId, {
            title,
            unit,
            questions
        });
        
        console.log('✅ Quiz updated:', updated);
        showNotification('Quiz updated successfully!');
        
        // Reload and go back to list
        await initEditQuiz();
        goBackToEditList();
    } catch (error) {
        console.error('❌ Error saving quiz:', error);
        showNotification('Error saving quiz: ' + error.message);
    }
}

/**
 * Extract questions from editor form
 * @returns {Array} - Array of question objects
 */
function getQuestionsFromEditor() {
    const questions = [];
    const questionCards = document.querySelectorAll('#editingQuestionsContainer .question-card');
    
    questionCards.forEach((card, questionIndex) => {
        const questionText = card.querySelector('.question-text')?.value || '';
        const answerInputs = card.querySelectorAll('.answer-input-group');
        
        const answers = [];
        answerInputs.forEach((input) => {
            const text = input.querySelector('.answer-text')?.value || '';
            const isCorrect = input.querySelector('.correct-answer-radio')?.checked || false;
            
            if (text.trim()) {
                answers.push({ text: text.trim(), isCorrect });
            }
        });
        
        if (questionText.trim()) {
            questions.push({
                text: questionText.trim(),
                answers
            });
        }
    });
    
    return questions;
}

// ===== DELETE QUIZ =====

/**
 * Delete quiz with confirmation
 * @param {number} quizId - Quiz ID to delete
 */
async function deleteQuizHandler(quizId) {
    const confirmed = confirm('Are you sure you want to delete this quiz? This cannot be undone.');
    
    if (!confirmed) {
        return;
    }
    
    console.log('Deleting quiz:', quizId);
    
    try {
        await deleteQuizData(quizId);
        console.log('✅ Quiz deleted');
        showNotification('Quiz deleted successfully');
        
        // Reload quizzes
        await initEditQuiz();
    } catch (error) {
        console.error('❌ Error deleting quiz:', error);
        showNotification('Error deleting quiz: ' + error.message);
    }
}

// ===== NAVIGATION =====

/**
 * Go back to quiz list from editor
 */
function goBackToEditList() {
    console.log('Going back to edit list');
    
    currentEditingQuizId = null;
    
    document.getElementById('editQuizSection').style.display = 'block';
    document.getElementById('quizEditorSection').style.display = 'none';
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

// ===== EXPORT =====

export default {
    initEditQuiz,
    openQuizEditor,
    saveEditedQuiz,
    deleteQuizHandler,
    goBackToEditList
};