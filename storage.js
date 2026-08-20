/* ============================================
   STORAGE MODULE
   Purpose: Handle all localStorage operations
   - Save and retrieve quizzes
   - Data persistence
   - Text file generation for printing
   ============================================ */

function getAllQuizzes() {
    const data = localStorage.getItem('quizzes_data');
    return data ? JSON.parse(data) : [];
}

function saveQuiz(quiz) {
    const allQuizzes = getAllQuizzes();
    allQuizzes.push(quiz);
    localStorage.setItem('quizzes_data', JSON.stringify(allQuizzes));
}

function getQuizById(quizId) {
    const quizzes = getAllQuizzes();
    return quizzes.find(quiz => quiz.id === quizId) || null;
}

function deleteQuiz(quizId) {
    const allQuizzes = getAllQuizzes();
    const filtered = allQuizzes.filter(quiz => quiz.id !== quizId);
    localStorage.setItem('quizzes_data', JSON.stringify(filtered));
}

function getQuizzesByFolder(folderName) {
    const quizzes = getAllQuizzes();
    return quizzes.filter(quiz => quiz.folder === folderName || !quiz.folder);
}

function getAllFolders() {
    const quizzes = getAllQuizzes();
    const folders = new Set();
    quizzes.forEach(quiz => {
        if (quiz.folder) {
            folders.add(quiz.folder);
        }
    });
    return Array.from(folders).sort();
}

function getQuizzesWithoutFolder() {
    const quizzes = getAllQuizzes();
    return quizzes.filter(quiz => !quiz.folder);
}

/* ============================================================
   UNIT FUNCTIONS (replaces folder terminology)
   ============================================================ */

function getQuizzesByUnit(unitName) {
    const quizzes = getAllQuizzes();
    return quizzes.filter(quiz => quiz.unit === unitName || !quiz.unit);
}

function getAllUnits() {
    const quizzes = getAllQuizzes();
    const units = new Set();
    quizzes.forEach(quiz => {
        if (quiz.unit) {
            units.add(quiz.unit);
        }
    });
    return Array.from(units).sort();
}

function getQuizzesWithoutUnit() {
    const quizzes = getAllQuizzes();
    return quizzes.filter(quiz => !quiz.unit);
}

function generateQuizTextFile(quiz) {
    let textContent = '';
    
    textContent += `${'='.repeat(80)}\n`;
    textContent += `${quiz.title.toUpperCase()}\n`;
    textContent += `${'='.repeat(80)}\n\n`;
    
    textContent += `Total Questions: ${quiz.questions.length}\n`;
    textContent += `Date Created: ${quiz.createdDate}\n`;
    textContent += `${'='.repeat(80)}\n\n`;
    
    quiz.questions.forEach((question, index) => {
        textContent += `Question ${index + 1}: ${question.question}\n`;
        
        if (question.answerType === 'multiple-choice') {
            question.answers.forEach((answer, answerIndex) => {
                textContent += `  ${String.fromCharCode(97 + answerIndex)}) ${answer.text}\n`;
            });
        } else {
            textContent += `  Answer: ____________________________________________________\n`;
        }
        
        textContent += '\n';
    });
    
    textContent += `\n${'='.repeat(80)}\n`;
    textContent += `ANSWER KEY\n`;
    textContent += `${'='.repeat(80)}\n\n`;
    
    quiz.questions.forEach((question, index) => {
        if (question.answerType === 'multiple-choice') {
            const correctIndex = question.answers.findIndex(ans => ans.isCorrect);
            const correctAnswer = String.fromCharCode(97 + correctIndex).toUpperCase();
            textContent += `Question ${index + 1}: ${correctAnswer}\n`;
        } else {
            const correctAnswer = question.answers[0].text;
            textContent += `Question ${index + 1}: ${correctAnswer}\n`;
        }
    });
    
    return textContent;
}

function downloadQuizTextFile(quiz) {
    const textContent = generateQuizTextFile(quiz);
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quiz.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}