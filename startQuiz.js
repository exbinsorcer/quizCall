/* ============================================
   START QUIZ MODULE
   Purpose: Handle quiz listing and quiz taking
   - Display saved quizzes
   - Start quiz
   - Track current question
   - Calculate score
   ============================================ */

// Track the quiz currently being taken
let currentTakingQuizId = null;

// Track current question index while taking quiz
let currentQuestionIndex = 0;

// Store user's answers while taking quiz
let userAnswers = [];

/* ============================================
   LOAD AND DISPLAY QUIZ LIST
   Purpose: Display all saved quizzes
   ============================================ */
function loadQuizzes() {
    // Get all quizzes from storage
    const quizzes = getAllQuizzes();
    
    // Get the container for quiz list
    const quizzesList = document.getElementById('quizzesList');
    
    // Clear existing content
    clearElement('quizzesList');
    
    // If no quizzes exist, show empty state
    if (quizzes.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No quizzes available yet. Create one to get started!</p>';
        quizzesList.appendChild(emptyState);
        return;
    }
    
    // Loop through each quiz and display it
    quizzes.forEach(quiz => {
        // Create quiz card element using CSS class
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-library-card';
        
        // Create info section
        const infoSection = document.createElement('div');
        infoSection.innerHTML = `
            <!-- Quiz title -->
            <h2>${quiz.title}</h2>
            
            <!-- Quiz info - number of questions -->
            <p>${quiz.questions.length} question${quiz.questions.length !== 1 ? 's' : ''} | Created: ${quiz.createdDate}</p>
        `;
        
        // Create actions section
        const actionsSection = document.createElement('div');
        actionsSection.className = 'quiz-card-actions';
        
        // Start quiz button
        const startBtn = document.createElement('button');
        startBtn.className = 'primary-button';
        startBtn.textContent = 'Start';
        startBtn.onclick = () => startTakingQuiz(quiz.id);
        
        // Delete quiz button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'secondary-button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteQuizConfirm(quiz.id);
        
        actionsSection.appendChild(startBtn);
        actionsSection.appendChild(deleteBtn);
        
        // Add sections to card
        quizCard.appendChild(infoSection);
        quizCard.appendChild(actionsSection);
        
        // Add card to container
        quizzesList.appendChild(quizCard);
    });
}

/* ============================================
   DELETE QUIZ WITH CONFIRMATION
   Purpose: Ask user to confirm before deleting a quiz
   Parameter: quizId - ID of quiz to delete
   ============================================ */
function deleteQuizConfirm(quizId) {
    // Show browser confirmation dialog
    if (confirm('Are you sure you want to delete this quiz? This cannot be undone.')) {
        // Delete from storage
        deleteQuiz(quizId);
        
        // Reload quiz list to update display
        loadQuizzes();
    }
}

/* ============================================
   START TAKING QUIZ
   Purpose: Initialize and display a quiz for the user to take
   Parameter: quizId - ID of quiz to start
   ============================================ */
function startTakingQuiz(quizId) {
    // Get the quiz from storage
    const quiz = getQuizById(quizId);
    
    // If quiz not found, show error
    if (!quiz) {
        alert('Quiz not found!');
        return;
    }
    
    // Set current quiz ID
    currentTakingQuizId = quizId;
    
    // Reset question index to first question
    currentQuestionIndex = 0;
    
    // Initialize user answers array with null values
    // One entry for each question
    userAnswers = new Array(quiz.questions.length).fill(null);
    
    // Show quiz taking section
    showSection('quizTakingSection');
    
    // Display the first question
    displayQuestion();
}

/* ============================================
   DISPLAY QUESTION
   Purpose: Render the current question and answers
   ============================================ */
function displayQuestion() {
    // Get current quiz from storage
    const quiz = getQuizById(currentTakingQuizId);
    if (!quiz) return;
    
    // Get current question
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Update quiz header with current question number
    const progressText = `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`;
    document.getElementById('quizProgress').textContent = progressText;
    document.getElementById('quizTitle-display').textContent = quiz.title;
    
    // Get the display container
    const questionDisplay = document.getElementById('questionDisplay');
    
    // Clear previous content
    questionDisplay.innerHTML = '';
    
    // Create question text element
    const questionText = document.createElement('h2');
    questionText.className = 'quiz-question';
    questionText.textContent = currentQuestion.question;
    questionDisplay.appendChild(questionText);
    
    // Display answers based on question type
    if (currentQuestion.answerType === 'multiple-choice') {
        // Display multiple choice answers
        displayMultipleChoice(currentQuestion);
    } else {
        // Display fill-in-the-blank answer input
        displayFillBlank(currentQuestion);
    }
    
    // Update navigation buttons
    updateNavigationButtons(quiz);
}

/* ============================================
   DISPLAY MULTIPLE CHOICE
   Purpose: Show multiple choice answer options
   Parameter: question - The question object
   ============================================ */
function displayMultipleChoice(question) {
    // Get question display container
    const questionDisplay = document.getElementById('questionDisplay');
    
    // Create container for answer options
    const quizOptions = document.createElement('div');
    quizOptions.className = 'quiz-options';
    
    // Loop through each answer option
    question.answers.forEach((answer, index) => {
        // Create answer option element
        const quizOption = document.createElement('div');
        quizOption.className = 'quiz-option';
        
        // Create radio button
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz-answer';
        radio.value = index;
        
        // If this answer was previously selected, check it
        if (userAnswers[currentQuestionIndex] === index) {
            radio.checked = true;
        }
        
        // Set click handler to select this answer
        radio.onchange = () => {
            userAnswers[currentQuestionIndex] = index;
        };
        
        // Create label for answer
        const label = document.createElement('label');
        label.style.cursor = 'pointer';
        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + answer.text));
        
        // Add label to option
        quizOption.appendChild(label);
        
        // Add to container
        quizOptions.appendChild(quizOption);
    });
    
    // Add options to display
    questionDisplay.appendChild(quizOptions);
}

/* ============================================
   DISPLAY FILL BLANK
   Purpose: Show fill-in-the-blank answer input
   Parameter: question - The question object
   ============================================ */
function displayFillBlank(question) {
    // Get question display container
    const questionDisplay = document.getElementById('questionDisplay');
    
    // Create input element using CSS class
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-answer';
    input.placeholder = 'Type your answer here';
    
    // Set value if user previously answered this question
    if (userAnswers[currentQuestionIndex]) {
        input.value = userAnswers[currentQuestionIndex];
    }
    
    // Handle input changes in real-time
    input.onchange = () => {
        userAnswers[currentQuestionIndex] = input.value.trim();
    };
    
    input.onkeyup = () => {
        userAnswers[currentQuestionIndex] = input.value.trim();
    };
    
    // Add to display
    questionDisplay.appendChild(input);
}

/* ============================================
   UPDATE NAVIGATION BUTTONS
   Purpose: Enable/disable Previous and Next buttons based on position
   Parameter: quiz - The quiz object
   ============================================ */
function updateNavigationButtons(quiz) {
    // Get navigation buttons
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const finishBtn = document.getElementById('finishQuizBtn');
    
    // Disable Previous button if on first question
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Show Finish button on last question
    if (currentQuestionIndex === quiz.questions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-block';
    } else {
        // Show Next button on other questions
        nextBtn.style.display = 'inline-block';
        finishBtn.style.display = 'none';
    }
}

/* ============================================
   GO TO PREVIOUS QUESTION
   Purpose: Move to previous question in quiz
   ============================================ */
function goToPreviousQuestion() {
    // Only go back if not on first question
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

/* ============================================
   GO TO NEXT QUESTION
   Purpose: Move to next question in quiz
   ============================================ */
function goToNextQuestion() {
    // Get current quiz
    const quiz = getQuizById(currentTakingQuizId);
    if (!quiz) return;
    
    // Only go forward if not on last question
    if (currentQuestionIndex < quiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

/* ============================================
   FINISH QUIZ
   Purpose: Calculate score and display results
   ============================================ */
function finishQuiz() {
    // Get quiz from storage
    const quiz = getQuizById(currentTakingQuizId);
    if (!quiz) return;
    
    // Calculate score
    let correctCount = 0;
    
    // Check each answer
    quiz.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        
        // Check based on question type
        if (question.answerType === 'multiple-choice') {
            // For multiple choice, check if selected answer is correct
            if (userAnswer !== null && userAnswer !== undefined) {
                // Find the correct answer index
                const correctIndex = question.answers.findIndex(ans => ans.isCorrect);
                
                // If user selected correct answer, increment score
                if (userAnswer === correctIndex) {
                    correctCount++;
                }
            }
        } else {
            // For fill-in-the-blank, check if answer matches
            if (userAnswer) {
                // Get correct answer and convert to lowercase for comparison
                const correctAnswer = question.answers[0].text.toLowerCase().trim();
                const userAnswerLower = userAnswer.toLowerCase().trim();
                
                // If match, increment score
                if (userAnswerLower === correctAnswer) {
                    correctCount++;
                }
            }
        }
    });
    
    // Calculate percentage
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    
    // Display results
    displayResults(correctCount, quiz.questions.length, percentage);
}

/* ============================================
   DISPLAY RESULTS
   Purpose: Show quiz score and results
   Parameter: correctCount - Number of correct answers
   Parameter: totalQuestions - Total number of questions
   Parameter: percentage - Score as percentage
   ============================================ */
function displayResults(correctCount, totalQuestions, percentage) {
    // Get results section
    const resultsContent = document.getElementById('resultsContent');
    
    // Clear previous content
    resultsContent.innerHTML = '';
    
    // Create result heading
    const heading = document.createElement('h2');
    heading.textContent = 'Quiz Complete!';
    resultsContent.appendChild(heading);
    
    // Determine message based on score
    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfect Score!';
    } else if (percentage >= 80) {
        message = '🌟 Great Job!';
    } else if (percentage >= 60) {
        message = '👍 Good Try!';
    } else {
        message = '💪 Keep Practicing!';
    }
    
    // Create score display
    const scoreDisplay = document.createElement('h1');
    scoreDisplay.style.fontSize = '48px';
    scoreDisplay.style.color = '#2563eb';
    scoreDisplay.style.margin = '20px 0';
    scoreDisplay.textContent = `${percentage}%`;
    resultsContent.appendChild(scoreDisplay);
    
    // Create message
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.fontSize = '18px';
    messageEl.style.marginBottom = '20px';
    resultsContent.appendChild(messageEl);
    
    // Create score breakdown
    const breakdown = document.createElement('p');
    breakdown.textContent = `You got ${correctCount} out of ${totalQuestions} questions correct`;
    breakdown.style.marginBottom = '30px';
    breakdown.style.color = '#6b7280';
    resultsContent.appendChild(breakdown);
    
    // Create action buttons container
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '12px';
    actions.style.justifyContent = 'center';
    
    // Try again button
    const tryAgainBtn = document.createElement('button');
    tryAgainBtn.className = 'primary-button';
    tryAgainBtn.textContent = 'Try Again';
    tryAgainBtn.onclick = () => {
        startTakingQuiz(currentTakingQuizId);
    };
    actions.appendChild(tryAgainBtn);
    
    // Back to quizzes button
    const backBtn = document.createElement('button');
    backBtn.className = 'secondary-button';
    backBtn.textContent = 'Back to Quizzes';
    backBtn.onclick = () => {
        showSection('startQuizSection');
        loadQuizzes();
    };
    actions.appendChild(backBtn);
    
    resultsContent.appendChild(actions);
    
    // Show results section
    showSection('quizResultsSection');
}
