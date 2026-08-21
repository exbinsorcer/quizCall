/* ============================================
   MIXED PRACTICE MODULE
   Handles quiz selection and question shuffling
   for interleaved/mixed practice sessions
   ============================================ */

let selectedQuizzes = new Set();
let mixedQuestions = [];

function loadQuizzesForMixedPractice() {
    const allQuizzes = getAllQuizzes();
    const quizSelectionList = document.getElementById('quizSelectionList');
    
    clearElement('quizSelectionList');
    selectedQuizzes.clear();
    
    if (allQuizzes.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No quizzes available. Create one to get started!</p>';
        quizSelectionList.appendChild(emptyState);
        updateStartMixedSessionButton();
        return;
    }
    
    // Group quizzes by unit
    const units = getAllUnits();
    
    units.forEach(unitName => {
        const unitQuizzes = getQuizzesByUnit(unitName).filter(q => q.unit === unitName);
        
        unitQuizzes.forEach(quiz => {
            createQuizSelectionItem(quiz, quizSelectionList);
        });
    });
    
    // Show quizzes without unit (shouldn't happen but for safety)
    const quizzesWithoutUnit = getQuizzesWithoutUnit();
    quizzesWithoutUnit.forEach(quiz => {
        createQuizSelectionItem(quiz, quizSelectionList);
    });
    
    updateStartMixedSessionButton();
}

function createQuizSelectionItem(quiz, container) {
    const item = document.createElement('div');
    item.className = 'quiz-selection-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `quiz-${quiz.id}`;
    checkbox.value = quiz.id;
    checkbox.onchange = () => toggleQuizSelection(quiz.id, checkbox.checked);
    
    const label = document.createElement('label');
    label.htmlFor = `quiz-${quiz.id}`;
    label.textContent = quiz.title;
    
    const info = document.createElement('div');
    info.className = 'quiz-item-info';
    info.textContent = `${quiz.questions.length} questions`;
    
    item.appendChild(checkbox);
    
    const labelContainer = document.createElement('div');
    labelContainer.style.flex = '1';
    labelContainer.appendChild(label);
    labelContainer.appendChild(info);
    
    item.appendChild(labelContainer);
    
    container.appendChild(item);
}

function toggleQuizSelection(quizId, isSelected) {
    if (isSelected) {
        selectedQuizzes.add(quizId);
    } else {
        selectedQuizzes.delete(quizId);
    }
    
    updateStartMixedSessionButton();
}

function selectAllQuizzes() {
    const allQuizzes = getAllQuizzes();
    allQuizzes.forEach(quiz => {
        selectedQuizzes.add(quiz.id);
        const checkbox = document.getElementById(`quiz-${quiz.id}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    updateStartMixedSessionButton();
}

function clearAllQuizzes() {
    selectedQuizzes.clear();
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    updateStartMixedSessionButton();
}

function updateStartMixedSessionButton() {
    const btn = document.getElementById('startMixedSessionBtn');
    btn.disabled = selectedQuizzes.size === 0;
}

function buildMixedQuestions() {
    const allQuizzes = getAllQuizzes();
    const questions = [];
    
    // Collect all questions from selected quizzes
    selectedQuizzes.forEach(quizId => {
        const quiz = allQuizzes.find(q => q.id === quizId);
        if (quiz && quiz.questions) {
            quiz.questions.forEach(question => {
                // Add quiz reference for display
                questions.push({
                    ...question,
                    sourceQuiz: quiz.title,
                    sourceQuizId: quiz.id,
                    unit: quiz.unit
                });
            });
        }
    });
    
    // Shuffle questions
    shuffleArray(questions);
    
    // Get limit from selector
    const limitSelect = document.getElementById('questionLimitSelect');
    const limit = limitSelect.value;
    
    if (limit !== 'all') {
        const numLimit = parseInt(limit);
        if (questions.length > numLimit) {
            return questions.slice(0, numLimit);
        }
    }
    
    return questions;
}

function shuffleArray(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startMixedSession() {
    mixedQuestions = buildMixedQuestions();
    
    if (mixedQuestions.length === 0) {
        showNotification('❌ No questions to practice');
        return;
    }
    
    // Create a synthetic quiz object from mixed questions
    const mixedQuiz = {
        id: 'mixed-' + Date.now(),
        title: `Mixed Practice (${mixedQuestions.length} questions)`,
        questions: mixedQuestions,
        createdDate: new Date().toLocaleDateString(),
        isMixedSession: true,
        selectedQuizCount: selectedQuizzes.size
    };
    
    // Start the quiz session with mixed questions
    startMixedTakingQuiz(mixedQuiz);
}

function startMixedTakingQuiz(mixedQuiz) {
    currentTakingQuizId = mixedQuiz.id;
    currentQuestionIndex = 0;
    hintShown = false;
    userAnswers = new Array(mixedQuiz.questions.length).fill(null);
    isReviewDueMode = false;
    
    // Add mixed quiz to temporary storage (don't save to actual quizzes)
    window.currentMixedQuiz = mixedQuiz;
    
    showSection('quizTakingSection');
    displayQuestion();
}

function getMixedQuizData() {
    return window.currentMixedQuiz || null;
}
