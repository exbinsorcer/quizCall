// api.js - Supabase Data Access Layer
// Replaces direct localStorage calls

import { getSupabaseClient } from './auth.js';

const supabase = getSupabaseClient();

// ===== QUIZ FUNCTIONS =====

/**
 * Get all quizzes for current user
 * @returns {Promise} - Array of quizzes
 */
export async function getMyQuizzes() {
    try {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching quizzes:', err);
        return [];
    }
}

/**
 * Get single quiz by ID
 * @param {number} id - Quiz ID
 * @returns {Promise} - Quiz object
 */
export async function getQuizById(id) {
    try {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error fetching quiz:', err);
        return null;
    }
}

/**
 * Save new quiz
 * @param {Object} quiz - Quiz data (title, unit, questions)
 * @returns {Promise} - Saved quiz with ID
 */
export async function saveQuiz(quiz) {
    try {
        const { data, error } = await supabase
            .from('quizzes')
            .insert([
                {
                    title: quiz.title,
                    unit: quiz.unit,
                    questions: quiz.questions || []
                }
            ])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Error saving quiz:', err);
        throw err;
    }
}

/**
 * Update existing quiz
 * @param {number} id - Quiz ID
 * @param {Object} quiz - Updated quiz data
 * @returns {Promise} - Updated quiz
 */
export async function updateQuiz(id, quiz) {
    try {
        const { data, error } = await supabase
            .from('quizzes')
            .update({
                title: quiz.title,
                unit: quiz.unit,
                questions: quiz.questions,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Error updating quiz:', err);
        throw err;
    }
}

/**
 * Delete quiz
 * @param {number} id - Quiz ID
 * @returns {Promise} - Success
 */
export async function deleteQuiz(id) {
    try {
        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error deleting quiz:', err);
        throw err;
    }
}

// ===== QUIZ ATTEMPT FUNCTIONS =====

/**
 * Save quiz attempt (when user finishes quiz)
 * @param {number} quizId - Quiz ID
 * @param {number} score - Score achieved
 * @param {number} totalQuestions - Total questions
 * @param {number} timeSpent - Time in seconds
 * @param {Object} answers - User's answers
 * @returns {Promise} - Saved attempt
 */
export async function saveQuizAttempt(quizId, score, totalQuestions, timeSpent, answers = {}) {
    try {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert([
                {
                    quiz_id: quizId,
                    score,
                    total_questions: totalQuestions,
                    time_spent_seconds: timeSpent,
                    answers: answers
                }
            ])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Error saving quiz attempt:', err);
        throw err;
    }
}

/**
 * Get all quiz attempts for current user
 * @returns {Promise} - Array of attempts
 */
export async function getMyAttempts() {
    try {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .order('attempted_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching attempts:', err);
        return [];
    }
}

// ===== USER SETTINGS FUNCTIONS =====

/**
 * Get user settings
 * @returns {Promise} - User settings object
 */
export async function getMySettings() {
    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .single();
        
        // If no settings exist yet, return defaults
        if (error?.code === 'PGRST116') {
            return {
                theme: 'light-theme',
                reminders_enabled: true,
                timer_visible_by_default: false
            };
        }
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error fetching settings:', err);
        return null;
    }
}

/**
 * Update user settings
 * @param {Object} settings - Settings to update
 * @returns {Promise} - Updated settings
 */
export async function updateSettings(settings) {
    try {
        const { data, error } = await supabase
            .from('user_settings')
            .upsert([settings], { onConflict: 'user_id' })
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Error updating settings:', err);
        throw err;
    }
}

// ===== REMINDER FUNCTIONS =====

/**
 * Get all reminders for current user
 * @returns {Promise} - Array of reminders
 */
export async function getReminders() {
    try {
        const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching reminders:', err);
        return [];
    }
}

/**
 * Add reminder
 * @param {string} text - Reminder text
 * @returns {Promise} - Created reminder
 */
export async function addReminder(text) {
    try {
        const { data, error } = await supabase
            .from('reminders')
            .insert([{ text }])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Error adding reminder:', err);
        throw err;
    }
}

/**
 * Delete reminder
 * @param {string} id - Reminder ID
 * @returns {Promise} - Success
 */
export async function deleteReminder(id) {
    try {
        const { error } = await supabase
            .from('reminders')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error deleting reminder:', err);
        throw err;
    }
}

// ===== REVIEW DATA FUNCTIONS =====

/**
 * Get review due questions
 * @returns {Promise} - Array of questions due for review
 */
export async function getReviewDueQuestions() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('review_data')
            .select('*')
            .lte('next_review', today)
            .order('next_review', { ascending: true });
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching review data:', err);
        return [];
    }
}

/**
 * Update review data (after review)
 * @param {string} questionId - Question ID
 * @param {boolean} wasCorrect - Whether answered correctly
 * @param {number} timeTaken - Time in seconds
 * @returns {Promise} - Updated review data
 */
export async function updateReviewData(questionId, wasCorrect, timeTaken) {
    try {
        // Get current review data
        const { data: existing } = await supabase
            .from('review_data')
            .select('*')
            .eq('question_id', questionId)
            .single();
        
        if (!existing) {
            // Create new if doesn't exist
            const { data, error } = await supabase
                .from('review_data')
                .insert([{
                    question_id: questionId,
                    next_review: new Date().toISOString().split('T')[0],
                    interval: 1
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        }
        
        // Update existing
        const { data, error } = await supabase
            .from('review_data')
            .update({
                last_reviewed: new Date().toISOString(),
                consecutive_correct: wasCorrect ? existing.consecutive_correct + 1 : 0
            })
            .eq('question_id', questionId)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Error updating review data:', err);
        throw err;
    }
}

export default {
    getMyQuizzes,
    getQuizById,
    saveQuiz,
    updateQuiz,
    deleteQuiz,
    saveQuizAttempt,
    getMyAttempts,
    getMySettings,
    updateSettings,
    getReminders,
    addReminder,
    deleteReminder,
    getReviewDueQuestions,
    updateReviewData
};