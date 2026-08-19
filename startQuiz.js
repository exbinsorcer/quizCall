/* ============================================
   START QUIZ MODULE
   ============================================ */

let currentTakingQuizId = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let hintShown = false;

function loadQuizzes() {
    const quizzes = getAllQuizzes();
    const quizzesList = document.getElementById('quizzesList');
    
    clearElement('quizzesList');
    
    if (quizzes.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No quizzes available yet. Create one to get started!</p>';
        quizzesList.appendChild(emptyState);
        return;
    }
    
    const folders = getAllFolders();
    
    folders.forEach(folderName => {
        displayFolder(folderName, quizzesList);
    });
    
    const quizzesWithoutFolder = getQuizzesWithoutFolder();
    if (quizzesWithoutFolder.length > 0) {
        const noFolderContainer = document.createElement('div');
        noFolderContainer.style.marginTop = '20px';
        
        quizzesWithoutFolder.forEach(quiz => {
            displayQuizCard(quiz, noFolderContainer);
        });
        
        quizzesList.appendChild(noFolderContainer);
    }
}

function displayFolder(folderName, container) {
    const folderElement = document.createElement('div');
    folderElement.className = 'category-folder';
    folderElement.id = `folder-${folderName}`;
    
    const header = document.createElement('div');
    header.className = 'category-folder-header';
    
    const folderTitle = document.createElement('h3');
    folderTitle.className = 'category-folder-title';
    folderTitle.innerHTML = `📁 ${folderName}`;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'category-toggle-btn';
    toggleBtn.textContent = 'View';
    toggleBtn.id = `toggle-${folderName}`;
    
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        toggleFolderDisplay(folderName, toggleBtn);
    };
    
    header.appendChild(folderTitle);
    header.appendChild(toggleBtn);
    
    const quizzesContainer = document.createElement('div');
    quizzesContainer.className = 'category-quizzes';
    quizzesContainer.id = `quizzes-${folderName}`;
    
    const quizzesInFolder = getQuizzesByFolder(folderName);
    const folderQuizzes = quizzesInFolder.filter(q => q.folder === folderName);
    
    folderQuizzes.forEach(quiz => {
        displayQuizCard(quiz, quizzesContainer);
    });
    
    folderElement.appendChild(header);
    folderElement.appendChild(quizzesContainer);
    
    container.appendChild(folderElement);
}

function toggleFolderDisplay(folderName, button) {
    const container = document.getElementById(`quizzes-${folderName}`);
    
    if (container.classList.contains('expanded')) {
        container.classList.remove('expanded');
        button.textContent = 'View';
    } else {
        container.classList.add('expanded');
        button.textContent = 'Show Less';
    }
}

function displayQuizCard(quiz, container) {
    const quizCard = document.createElement('div');
    quizCard.className = 'quiz-library-card';
    
    const infoSection = document.createElement('div');
    infoSection.innerHTML = `
        <h2>${quiz.title}</h2>
        <p>${quiz.questions.length} question${quiz.questions.length !== 1 ? 's' : ''} | Created: ${quiz.createdDate}</p>
    `;
    
    const actionsSection = document.createElement('div');
    actionsSection.className = 'quiz-card-actions';
    
    const startBtn = document.createElement('button');
    startBtn.className = 'primary-button';
    startBtn.textContent = 'Start';
    startBtn.onclick = () => startTakingQuiz(quiz.id);
    
    actionsSection.appendChild(startBtn);
    
    quizCard.appendChild(infoSection);
    quizCard.appendChild(actionsSection);
    
    container.appendChild(quizCard);
}

function startTakingQuiz(quizId) {
    const quiz = getQuizById(quizId);
    
    if (!quiz) {
        alert('Quiz not found!');
        return;
    }
    
    currentTakingQuizId = quizId;
    currentQuestionIndex = 0;
    hintShown = false;
    userAnswers = new Array(quiz.questions.length).fill(null);
    
    showSection('quizTakingSection');
    displayQuestion();
}

function displayQuestion() {
    const quiz = getQuizById(currentTakingQuizId);
    if (!quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    hintShown = false;
    
    const progressText = `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`;
    document.getElementById('quizProgress').textContent = progressText;
    document.getElementById('quizTitle-display').textContent = quiz.title;
    
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.innerHTML = '';
    
    const questionText = document.createElement('h2');
    questionText.className = 'quiz-question';
    questionText.textContent = currentQuestion.question;
    questionDisplay.appendChild(questionText);
    
    if (currentQuestion.hint) {
        const hintContainer = document.createElement('div');
        hintContainer.className = 'hint-container';
        
        const hintButtonWrapper = document.createElement('div');
        hintButtonWrapper.className = 'hint-button-wrapper';
        
        const hintBtn = document.createElement('button');
        hintBtn.className = 'hint-button';
        hintBtn.textContent = '💡 Show Hint';
        hintBtn.onclick = () => toggleHint(currentQuestion.hint, hintBtn);
        
        hintButtonWrapper.appendChild(hintBtn);
        hintContainer.appendChild(hintButtonWrapper);
        questionDisplay.appendChild(hintContainer);
    }
    
    if (currentQuestion.answerType === 'multiple-choice') {
        displayMultipleChoice(currentQuestion);
    } else {
        displayFillBlank(currentQuestion);
    }
    
    updateNavigationButtons(quiz);
}

function toggleHint(hintText, button) {
    if (hintShown) {
        const overlay = document.querySelector('.hint-overlay');
        const box = document.querySelector('.hint-box');
        if (overlay) overlay.remove();
        if (box) box.remove();
        hintShown = false;
        button.textContent = '💡 Show Hint';
    } else {
        const overlay = document.createElement('div');
        overlay.className = 'hint-overlay';
        overlay.onclick = () => toggleHint(hintText, button);
        document.body.appendChild(overlay);
        
        const hintBox = document.createElement('div');
        hintBox.className = 'hint-box';
        
        const hintContent = document.createElement('div');
        hintContent.className = 'hint-box-content';
        hintContent.textContent = '💭 Hint';
        
        const hintBoxText = document.createElement('div');
        hintBoxText.className = 'hint-box-text';
        hintBoxText.textContent = hintText;
        
        hintBox.appendChild(hintContent);
        hintBox.appendChild(hintBoxText);
        document.body.appendChild(hintBox);
        
        hintShown = true;
        button.textContent = '💡 Hide Hint';
    }
}

function displayMultipleChoice(question) {
    const questionDisplay = document.getElementById('questionDisplay');
    
    const quizOptions = document.createElement('div');
    quizOptions.className = 'quiz-options';
    
    question.answers.forEach((answer, index) => {
        const quizOption = document.createElement('div');
        quizOption.className = 'quiz-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz-answer';
        radio.value = index;
        radio.id = `answer-${index}`;
        
        if (userAnswers[currentQuestionIndex] === index) {
            radio.checked = true;
        }
        
        radio.onchange = () => {
            userAnswers[currentQuestionIndex] = index;
        };
        
        const label = document.createElement('label');
        label.style.cursor = 'pointer';
        label.style.width = '100%';
        label.htmlFor = `answer-${index}`;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + answer.text));
        
        quizOption.appendChild(label);
        
        quizOption.style.cursor = 'pointer';
        quizOption.onclick = () => {
            radio.checked = true;
            userAnswers[currentQuestionIndex] = index;
        };
        
        quizOptions.appendChild(quizOption);
    });
    
    questionDisplay.appendChild(quizOptions);
}

function displayFillBlank(question) {
    const questionDisplay = document.getElementById('questionDisplay');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-answer';
    input.placeholder = 'Type your answer here';
    
    if (userAnswers[currentQuestionIndex]) {
        input.value = userAnswers[currentQuestionIndex];
    }
    
    input.onchange = () => {
        userAnswers[currentQuestionIndex] = input.value.trim();
    };
    
    input.onkeyup = () => {
        userAnswers[currentQuestionIndex] = input.value.trim();
    };
    
    questionDisplay.appendChild(input);
}

function updateNavigationButtons(quiz) {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const finishBtn = document.getElementById('finishQuizBtn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === quiz.questions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        finishBtn.style.display = 'none';
    }
}

function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function goToNextQuestion() {
    const quiz = getQuizById(currentTakingQuizId);
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function finishQuiz() {
    const quiz = getQuizById(currentTakingQuizId);
    if (!quiz) return;
    
    let correctCount = 0;
    
    quiz.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        
        if (question.answerType === 'multiple-choice') {
            if (userAnswer !== null && userAnswer !== undefined) {
                const correctIndex = question.answers.findIndex(ans => ans.isCorrect);
                if (userAnswer === correctIndex) {
                    correctCount++;
                }
            }
        } else {
            if (userAnswer) {
                const correctAnswer = question.answers[0].text.toLowerCase().trim();
                const userAnswerLower = userAnswer.toLowerCase().trim();
                if (userAnswerLower === correctAnswer) {
                    correctCount++;
                }
            }
        }
    });
    
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    
    displayResults(quiz, correctCount, quiz.questions.length, percentage);
}

function displayResults(quiz, correctCount, totalQuestions, percentage) {
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = '';
    
    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'result-score-top';
    scoreBadge.textContent = `Score: ${percentage}%`;
    resultsContent.appendChild(scoreBadge);
    
    const heading = document.createElement('h2');
    heading.textContent = 'Quiz Complete!';
    resultsContent.appendChild(heading);
    
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
    
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.fontSize = '18px';
    messageEl.style.marginBottom = '20px';
    resultsContent.appendChild(messageEl);
    
    const breakdown = document.createElement('p');
    breakdown.textContent = `You got ${correctCount} out of ${totalQuestions} questions correct`;
    breakdown.style.marginBottom = '30px';
    breakdown.style.color = '#6b7280';
    resultsContent.appendChild(breakdown);
    
    const reviewContainer = document.createElement('div');
    reviewContainer.className = 'quiz-review-container';
    
    const reviewHeading = document.createElement('h3');
    reviewHeading.style.marginTop = '0';
    reviewHeading.textContent = 'Quiz Review';
    reviewContainer.appendChild(reviewHeading);
    
    quiz.questions.forEach((question, qIndex) => {
        let isCorrect = false;
        
        if (question.answerType === 'multiple-choice') {
            const userAnswerIndex = userAnswers[qIndex];
            if (userAnswerIndex !== null && userAnswerIndex !== undefined) {
                const correctIndex = question.answers.findIndex(ans => ans.isCorrect);
                isCorrect = userAnswerIndex === correctIndex;
            }
        } else {
            if (userAnswers[qIndex]) {
                const correctAnswer = question.answers[0].text.toLowerCase().trim();
                const userAnswer = userAnswers[qIndex].toLowerCase().trim();
                isCorrect = userAnswer === correctAnswer;
            }
        }
        
        const reviewQuestion = document.createElement('div');
        reviewQuestion.className = `quiz-review-question ${isCorrect ? 'correct' : 'incorrect'}`;
        
        const questionTitle = document.createElement('p');
        questionTitle.className = 'quiz-review-question-title';
        questionTitle.textContent = `${qIndex + 1}. ${question.question} ${isCorrect ? '✓' : '✗'}`;
        reviewQuestion.appendChild(questionTitle);
        
        const userAnswerDiv = document.createElement('div');
        userAnswerDiv.className = `quiz-review-answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        if (question.answerType === 'multiple-choice') {
            const userAnswerIndex = userAnswers[qIndex];
            if (userAnswerIndex !== null && userAnswerIndex !== undefined) {
                userAnswerDiv.textContent = `Your answer: ${question.answers[userAnswerIndex].text}`;
            } else {
                userAnswerDiv.textContent = 'Your answer: Not answered';
            }
        } else {
            userAnswerDiv.textContent = `Your answer: ${userAnswers[qIndex] || 'Not answered'}`;
        }
        reviewQuestion.appendChild(userAnswerDiv);
        
        if (!isCorrect) {
            const correctAnswerDiv = document.createElement('div');
            correctAnswerDiv.className = 'quiz-review-answer-item correct';
            
            if (question.answerType === 'multiple-choice') {
                const correctIndex = question.answers.findIndex(ans => ans.isCorrect);
                correctAnswerDiv.textContent = `Correct answer: ${question.answers[correctIndex].text}`;
            } else {
                correctAnswerDiv.textContent = `Correct answer: ${question.answers[0].text}`;
            }
            reviewQuestion.appendChild(correctAnswerDiv);
        }
        
        reviewContainer.appendChild(reviewQuestion);
    });
    
    resultsContent.appendChild(reviewContainer);
    
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '12px';
    actions.style.justifyContent = 'center';
    actions.style.marginTop = '20px';
    
    const tryAgainBtn = document.createElement('button');
    tryAgainBtn.className = 'primary-button';
    tryAgainBtn.textContent = 'Try Again';
    tryAgainBtn.onclick = () => {
        startTakingQuiz(currentTakingQuizId);
    };
    actions.appendChild(tryAgainBtn);
    
    const backBtn = document.createElement('button');
    backBtn.className = 'secondary-button';
    backBtn.textContent = 'Back to Quizzes';
    backBtn.onclick = () => {
        showSection('startQuizSection');
        loadQuizzes();
    };
    actions.appendChild(backBtn);
    
    resultsContent.appendChild(actions);
    
    showSection('quizResultsSection');
}