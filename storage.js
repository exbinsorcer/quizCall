/* ============================================
   STORAGE UTILITY
   Purpose: Handle all localStorage operations
   - Saving quizzes
   - Loading quizzes
   - Deleting quizzes
   ============================================ */

// Define the key used for storing quizzes in localStorage
const QUIZZES_STORAGE_KEY = 'quizzes_data';

/* ============================================
   GET ALL QUIZZES
   Purpose: Retrieve all saved quizzes from localStorage
   Returns: Array of quiz objects
   ============================================ */
function getAllQuizzes() {
    // Get the data from localStorage using the storage key
    const data = localStorage.getItem(QUIZZES_STORAGE_KEY);
    
    // If no data exists, return empty array
    // Otherwise, parse the JSON string back to JavaScript objects
    return data ? JSON.parse(data) : [];
}

/* ============================================
   SAVE QUIZ
   Purpose: Save a new quiz to localStorage
   Parameter: quiz - Quiz object to save
   ============================================ */
function saveQuiz(quiz) {
    // Get all existing quizzes
    const quizzes = getAllQuizzes();
    
    // Add the new quiz to the array
    quizzes.push(quiz);
    
    // Save the updated array back to localStorage
    // JSON.stringify converts the JavaScript object to a JSON string
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
}

/* ============================================
   GET QUIZ BY ID
   Purpose: Retrieve a specific quiz by its ID
   Parameter: quizId - The ID of the quiz to retrieve
   Returns: Quiz object or null if not found
   ============================================ */
function getQuizById(quizId) {
    // Get all quizzes
    const quizzes = getAllQuizzes();
    
    // Use find() to locate quiz with matching ID
    return quizzes.find(quiz => quiz.id === quizId) || null;
}

/* ============================================
   DELETE QUIZ
   Purpose: Remove a quiz from localStorage
   Parameter: quizId - The ID of the quiz to delete
   ============================================ */
function deleteQuiz(quizId) {
    // Get all existing quizzes
    const quizzes = getAllQuizzes();
    
    // Use filter() to create new array without the quiz to delete
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    
    // Save the updated array back to localStorage
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(updatedQuizzes));
}

/* ============================================
   CLEAR ALL QUIZZES
   Purpose: Remove all quizzes from localStorage (useful for testing)
   ============================================ */
function clearAllQuizzes() {
    // Remove the storage key completely from localStorage
    localStorage.removeItem(QUIZZES_STORAGE_KEY);
}
