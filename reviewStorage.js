/* ============================================
   REVIEW STORAGE MODULE
   Handles all review data and scheduling
   ============================================ */

const REVIEW_DATA_KEY = 'review_data';

function getReviewData() {
    const data = localStorage.getItem(REVIEW_DATA_KEY);
    if (!data) {
        return {
            questions: {},
            settings: {
                timerVisibleByDefault: false
            }
        };
    }
    return JSON.parse(data);
}

function saveReviewData(data) {
    localStorage.setItem(REVIEW_DATA_KEY, JSON.stringify(data));
}

function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

function addDaysToDate(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function initQuestionReview(questionId) {
    const data = getReviewData();
    
    if (!data.questions[questionId]) {
        data.questions[questionId] = {
            nextReview: getToday(), // Due immediately
            interval: 1,
            consecutiveCorrect: 0,
            lastReviewed: null,
            confidenceHistory: []
        };
        
        saveReviewData(data);
    }
}

function getDueQuestions() {
    const data = getReviewData();
    const today = getToday();
    const dueQuestionIds = [];
    
    for (const questionId in data.questions) {
        const question = data.questions[questionId];
        if (question.nextReview <= today) {
            dueQuestionIds.push(questionId);
        }
    }
    
    return dueQuestionIds;
}

function getDueQuizzesForReview() {
    const allQuizzes = getAllQuizzes();
    const dueQuestionIds = new Set(getDueQuestions());
    
    // Build quizzes that contain at least one due question
    const dueQuizzes = [];
    
    allQuizzes.forEach(quiz => {
        const dueQuestions = quiz.questions.filter(q => dueQuestionIds.has(q.id));
        
        if (dueQuestions.length > 0) {
            // Create a modified quiz with only due questions
            const modifiedQuiz = {
                ...quiz,
                questions: dueQuestions,
                isDueReview: true,
                originalQuestionCount: quiz.questions.length,
                dueQuestionCount: dueQuestions.length
            };
            
            dueQuizzes.push(modifiedQuiz);
        }
    });
    
    return dueQuizzes;
}

function calculateConfidence(secondsTaken, wasCorrect) {
    if (!wasCorrect) {
        return 'incorrect';
    }
    
    if (secondsTaken > 300) {
        return 'distracted';
    }
    
    if (secondsTaken <= 30) {
        return 'high';
    }
    
    if (secondsTaken <= 90) {
        return 'medium';
    }
    
    // 91 - 300 seconds
    return 'low';
}

function calculateNextInterval(currentInterval, confidence, consecutiveCorrect) {
    if (confidence === 'incorrect' || confidence === 'distracted') {
        return 1;
    }
    
    if (confidence === 'high') {
        // Aggressive increase: multiply by 2.5
        return Math.max(2, Math.ceil(currentInterval * 2.5));
    }
    
    if (confidence === 'medium') {
        // Normal increase: multiply by 1.5
        return Math.max(1, Math.ceil(currentInterval * 1.5));
    }
    
    if (confidence === 'low') {
        // Slight increase: add 1 day
        return currentInterval + 1;
    }
    
    return currentInterval;
}

function updateQuestionReview(questionId, wasCorrect, secondsTaken) {
    const data = getReviewData();
    
    // Initialize if doesn't exist
    if (!data.questions[questionId]) {
        initQuestionReview(questionId);
    }
    
    const question = data.questions[questionId];
    const confidence = calculateConfidence(secondsTaken, wasCorrect);
    
    // Record confidence history
    question.confidenceHistory.push({
        date: getToday(),
        seconds: secondsTaken,
        confidence: confidence
    });
    
    // Update review metadata
    question.lastReviewed = getToday();
    
    if (confidence === 'incorrect' || confidence === 'distracted') {
        question.interval = 1;
        question.consecutiveCorrect = 0;
    } else {
        const newInterval = calculateNextInterval(question.interval, confidence, question.consecutiveCorrect);
        question.interval = newInterval;
        question.consecutiveCorrect = (question.consecutiveCorrect || 0) + 1;
    }
    
    // Calculate next review date
    question.nextReview = addDaysToDate(getToday(), question.interval);
    
    saveReviewData(data);
}

function getTimerVisibility() {
    const data = getReviewData();
    return data.settings.timerVisibleByDefault;
}

function setTimerVisibility(isVisible) {
    const data = getReviewData();
    data.settings.timerVisibleByDefault = isVisible;
    saveReviewData(data);
}

function getQuestionReviewData(questionId) {
    const data = getReviewData();
    
    if (!data.questions[questionId]) {
        return null;
    }
    
    return data.questions[questionId];
}
