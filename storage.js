// storage_UPDATED.js - Database Storage Layer (replaces localStorage)
// Uses Supabase database instead of browser localStorage
// Same function names for compatibility with existing code

import { 
    getMyQuizzes, 
    saveQuiz, 
    updateQuiz, 
    deleteQuiz,
    getMyAttempts,
    getMySettings,
    updateSettings,
    getReminders,
    addReminder,
    deleteReminder
} from './api.js';

// ===== QUIZ STORAGE =====

/**
 * Get all quizzes for current user from database
 * @returns {Promise} - Array of quizzes
 */
export async function getAllQuizzes() {
    try {
        console.log('Loading quizzes from database...');
        const quizzes = await getMyQuizzes();
        console.log('✅ Loaded quizzes:', quizzes.length);
        return quizzes || [];
    } catch (error) {
        console.error('❌ Error loading quizzes:', error);
        return [];
    }
}

/**
 * Get single quiz by ID from database
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Quiz object
 */
export async function getQuiz(quizId) {
    try {
        const quizzes = await getMyQuizzes();
        return quizzes.find(q => q.id === quizId) || null;
    } catch (error) {
        console.error('Error getting quiz:', error);
        return null;
    }
}

/**
 * Save new quiz to database
 * @param {Object} quiz - Quiz data (title, unit, questions)
 * @returns {Promise} - Saved quiz with ID
 */
export async function saveQuizData(quiz) {
    try {
        console.log('Saving quiz to database:', quiz.title);
        const saved = await saveQuiz(quiz);
        console.log('✅ Quiz saved:', saved);
        return saved;
    } catch (error) {
        console.error('❌ Error saving quiz:', error);
        throw error;
    }
}

/**
 * Update existing quiz in database
 * @param {number} quizId - Quiz ID
 * @param {Object} quiz - Updated quiz data
 * @returns {Promise} - Updated quiz
 */
export async function updateQuizData(quizId, quiz) {
    try {
        console.log('Updating quiz:', quizId);
        const updated = await updateQuiz(quizId, quiz);
        console.log('✅ Quiz updated:', updated);
        return updated;
    } catch (error) {
        console.error('❌ Error updating quiz:', error);
        throw error;
    }
}

/**
 * Delete quiz from database
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Success
 */
export async function deleteQuizData(quizId) {
    try {
        console.log('Deleting quiz:', quizId);
        await deleteQuiz(quizId);
        console.log('✅ Quiz deleted');
        return true;
    } catch (error) {
        console.error('❌ Error deleting quiz:', error);
        throw error;
    }
}

// ===== QUIZ ATTEMPTS (RESULTS) =====

/**
 * Get all quiz attempts for current user
 * @returns {Promise} - Array of attempts
 */
export async function getAllAttempts() {
    try {
        const attempts = await getMyAttempts();
        return attempts || [];
    } catch (error) {
        console.error('Error loading attempts:', error);
        return [];
    }
}

/**
 * Save quiz attempt (results after completing quiz)
 * @param {number} quizId - Quiz ID
 * @param {number} score - Score achieved
 * @param {number} totalQuestions - Total questions
 * @param {number} timeSpent - Time in seconds
 * @param {Object} answers - User's answers
 * @returns {Promise} - Saved attempt
 */
export async function saveAttempt(quizId, score, totalQuestions, timeSpent, answers = {}) {
    try {
        console.log('Saving quiz attempt:', quizId);
        const { saveQuizAttempt } = await import('./api.js');
        const attempt = await saveQuizAttempt(quizId, score, totalQuestions, timeSpent, answers);
        console.log('✅ Attempt saved');
        return attempt;
    } catch (error) {
        console.error('Error saving attempt:', error);
        throw error;
    }
}

// ===== USER SETTINGS =====

/**
 * Get user settings from database
 * @returns {Promise} - User settings object
 */
export async function loadSettings() {
    try {
        const settings = await getMySettings();
        return settings || {
            theme: 'light-theme',
            reminders_enabled: true,
            timer_visible_by_default: false
        };
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
}

/**
 * Save user settings to database
 * @param {Object} settings - Settings to update
 * @returns {Promise} - Updated settings
 */
export async function saveSettings(settings) {
    try {
        console.log('Saving settings...');
        const updated = await updateSettings(settings);
        console.log('✅ Settings saved');
        return updated;
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

// ===== REMINDERS =====

/**
 * Get all reminders for current user
 * @returns {Promise} - Array of reminders
 */
export async function getRemindersData() {
    try {
        const reminders = await getReminders();
        return reminders || [];
    } catch (error) {
        console.error('Error loading reminders:', error);
        return [];
    }
}

/**
 * Add a reminder
 * @param {string} text - Reminder text
 * @returns {Promise} - Created reminder
 */
export async function addReminderData(text) {
    try {
        console.log('Adding reminder...');
        const reminder = await addReminder(text);
        console.log('✅ Reminder added');
        return reminder;
    } catch (error) {
        console.error('Error adding reminder:', error);
        throw error;
    }
}

/**
 * Delete a reminder
 * @param {string} id - Reminder ID
 * @returns {Promise} - Success
 */
export async function deleteReminderData(id) {
    try {
        console.log('Deleting reminder:', id);
        await deleteReminder(id);
        console.log('✅ Reminder deleted');
        return true;
    } catch (error) {
        console.error('Error deleting reminder:', error);
        throw error;
    }
}

// ===== EXPORTS FOR COMPATIBILITY =====

export default {
    getAllQuizzes,
    getQuiz,
    saveQuizData,
    updateQuizData,
    deleteQuizData,
    getAllAttempts,
    saveAttempt,
    loadSettings,
    saveSettings,
    getRemindersData,
    addReminderData,
    deleteReminderData
};