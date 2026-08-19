/* ============================================
   CREATE QUIZ MODULE
   Purpose: Handle all quiz creation functionality
   - Adding questions
   - Editing answers
   - Saving quizzes
   ============================================ */

// Store current questions being edited
let currentQuestions = [];

/* ============================================
   ADD QUESTION
   Purpose: Add a new question-answer pair to the form
   ============================================ */
function addQuestion() {
    // Create unique ID for this question
    const questionId = createUniqueId();
    
    // Create a new question object
    const questionObject = {
        id: questionId,
        question: '',
        answerType: 'multiple-choice', // Default to multiple choice
        answers: [
            { id: createUniqueId(), text: '', isCorrect: false }
        ]
    };
    
    // Add to current questions array
    currentQuestions.push(questionObject);
    
    // Render the question card in the UI
    renderQuestionCard(questionObject);
}

/* ============================================
   RENDER QUESTION CARD
   Purpose: Display a question card in the form
   Parameter: questionObject - The question to display
   ============================================ */
function renderQuestionCard(questionObject) {
    // Get the container where questions are displayed
    const container = document.getElementById('questionsContainer');
    
    // Create a new div for the question card using CSS class
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `question-${questionObject.id}`;
    
    // Build the HTML for the question card
    card.innerHTML = `
        <!-- Question card header with number and remove button -->
        <div class="question-card-header">
            <h3 class="question-number">Question ${currentQuestions.length}</h3>
            <button 
                class="remove-question-button" 
                onclick="removeQuestion('${questionObject.id}')"
            >
                Remove
            </button>
        </div>
        
        <!-- Question text input -->
        <label>Question</label>
        <textarea 
            id="questionText-${questionObject.id}" 
            class="question-input"
            placeholder="Enter your question here"
        >${questionObject.question}</textarea>
        
        <!-- Answer section container -->
        <div class="answer-section">
            <!-- Answer type selector row -->
            <div class="type-row">
                <label>Answer Type:</label>
                <select 
                    class="type-select"
                    id="answerType-${questionObject.id}"
                    onchange="changeAnswerType('${questionObject.id}', this.value)"
                >
                    <option value="multiple-choice" ${questionObject.answerType === 'multiple-choice' ? 'selected' : ''}>
                        Multiple Choice
                    </option>
                    <option value="fill-blank" ${questionObject.answerType === 'fill-blank' ? 'selected' : ''}>
                        Fill in the Blank
                    </option>
                </select>
            </div>
            
            <!-- Answer input section -->
            <div id="answersList-${questionObject.id}"></div>
        </div>
    `;
    
    // Add the question card to the container
    container.appendChild(card);
    
    // Render all answers for this question
    renderAnswers(questionObject.id);
}

/* ============================================
   RENDER ANSWERS
   Purpose: Display answer inputs for a question
   Parameter: questionId - ID of the question
   ============================================ */
function renderAnswers(questionId) {
    // Find the question object
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Get the answers list container
    const answersList = document.getElementById(`answersList-${questionId}`);
    
    // Clear existing answers
    answersList.innerHTML = '';
    
    // Check if this is fill-in-the-blank type
    if (question.answerType === 'fill-blank') {
        // For fill-in-the-blank, show single correct answer input
        answersList.innerHTML = `
            <label>Correct Answer</label>
            <input 
                type="text" 
                id="correctAnswer-${questionId}" 
                class="answer-input"
                placeholder="Enter the correct answer"
                value="${question.answers[0]?.text || ''}"
            >
        `;
    } else {
        // For multiple choice, show each answer with correct indicator
        const label = document.createElement('label');
        label.textContent = 'Answer Options';
        answersList.appendChild(label);
        
        question.answers.forEach((answer, index) => {
            // Create option row
            const optionRow = document.createElement('div');
            optionRow.className = 'option-row';
            optionRow.id = `answer-${answer.id}`;
            
            // Create answer input
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'answer-input';
            input.placeholder = `Enter answer option ${index + 1}`;
            input.value = answer.text;
            input.id = `answerText-${answer.id}`;
            
            // Create checkbox container
            const checkboxContainer = document.createElement('label');
            checkboxContainer.className = 'correct-label';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = answer.isCorrect;
            checkbox.onchange = () => updateAnswerCorrectStatus(questionId, answer.id, checkbox.checked);
            checkbox.title = 'Mark as correct answer';
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(document.createTextNode(' Correct'));
            
            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'small-button';
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeAnswer(questionId, answer.id);
            
            // Add elements to option row
            optionRow.appendChild(input);
            optionRow.appendChild(checkboxContainer);
            optionRow.appendChild(removeBtn);
            
            answersList.appendChild(optionRow);
        });
        
        // Add answer button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-button';
        addBtn.style.marginTop = '12px';
        addBtn.textContent = '+ Add Answer';
        addBtn.onclick = () => addAnswer(questionId);
        answersList.appendChild(addBtn);
    }
}

/* ============================================
   ADD ANSWER
   Purpose: Add a new answer option to a question
   Parameter: questionId - ID of the question
   ============================================ */
function addAnswer(questionId) {
    // Find the question
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Create new answer object
    const newAnswer = {
        id: createUniqueId(),
        text: '',
        isCorrect: false
    };
    
    // Add to question's answers array
    question.answers.push(newAnswer);
    
    // Re-render the answers
    renderAnswers(questionId);
}

/* ============================================
   CHANGE ANSWER TYPE
   Purpose: Switch between multiple choice and fill-in-the-blank
   Parameter: questionId - ID of the question
   Parameter: newType - 'multiple-choice' or 'fill-blank'
   ============================================ */
function changeAnswerType(questionId, newType) {
    // Find the question
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Update the answer type
    question.answerType = newType;
    
    // Reset answers based on new type
    if (newType === 'fill-blank') {
        // For fill-in-the-blank, keep only one answer
        question.answers = [
            {
                id: createUniqueId(),
                text: '',
                isCorrect: true
            }
        ];
    } else {
        // For multiple choice, ensure we have at least one answer
        if (question.answers.length === 0) {
            question.answers = [
                { id: createUniqueId(), text: '', isCorrect: false }
            ];
        }
    }
    
    // Update UI
    // Find all answer type buttons for this question
    const typeButtons = document.querySelectorAll(`#question-${questionId} .answer-type-option`);
    typeButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set active class on clicked button
    event.target.classList.add('active');
    
    // Re-render answers
    renderAnswers(questionId);
}

/* ============================================
   REMOVE QUESTION
   Purpose: Delete a question from the quiz
   Parameter: questionId - ID of the question to remove
   ============================================ */
function removeQuestion(questionId) {
    // Remove from questions array
    currentQuestions = currentQuestions.filter(q => q.id !== questionId);
    
    // Remove the card from DOM
    const card = document.getElementById(`question-${questionId}`);
    if (card) {
        card.remove();
    }
}

/* ============================================
   REMOVE ANSWER
   Purpose: Delete an answer option from a question
   Parameter: questionId - ID of the question
   Parameter: answerId - ID of the answer to remove
   ============================================ */
function removeAnswer(questionId, answerId) {
    // Find the question
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Don't allow removing if only one answer remains
    if (question.answers.length === 1) {
        alert('Each question must have at least one answer');
        return;
    }
    
    // Remove the answer
    question.answers = question.answers.filter(a => a.id !== answerId);
    
    // Re-render answers
    renderAnswers(questionId);
}

/* ============================================
   UPDATE ANSWER CORRECT STATUS
   Purpose: Mark/unmark an answer as correct
   Parameter: questionId - ID of the question
   Parameter: answerId - ID of the answer
   Parameter: isCorrect - Boolean indicating if correct
   ============================================ */
function updateAnswerCorrectStatus(questionId, answerId, isCorrect) {
    // Find the question
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Find the answer
    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return;
    
    // Update correct status
    answer.isCorrect = isCorrect;
    
    // Re-render to show updated status
    renderAnswers(questionId);
}

/* ============================================
   SAVE QUIZ
   Purpose: Save the current quiz to storage
   ============================================ */
function saveQuiz() {
    // Get quiz title from input
    const title = getFormValue('quizTitle');
    
    // Update all question data from form inputs
    currentQuestions.forEach(question => {
        // Get question text from input
        const textInput = document.getElementById(`questionText-${question.id}`);
        if (textInput) {
            question.question = textInput.value.trim();
        }
        
        // Update answer data based on type
        if (question.answerType === 'fill-blank') {
            const correctInput = document.getElementById(`correctAnswer-${question.id}`);
            if (correctInput) {
                question.answers[0].text = correctInput.value.trim();
                question.answers[0].isCorrect = true;
            }
        } else {
            // For multiple choice, update answers from inputs
            const answerInputs = document.querySelectorAll(`#answersList-${question.id} input[type="text"]`);
            const checkboxes = document.querySelectorAll(`#answersList-${question.id} input[type="checkbox"]`);
            
            question.answers.forEach((answer, index) => {
                if (answerInputs[index]) {
                    answer.text = answerInputs[index].value.trim();
                }
                if (checkboxes[index]) {
                    answer.isCorrect = checkboxes[index].checked;
                }
            });
        }
    });
    
    // Validate the quiz data
    const validation = validateQuizData(title, currentQuestions);
    
    // If validation fails, show error and return
    if (!validation.isValid) {
        alert(validation.error);
        return;
    }
    
    // Create quiz object to save
    const newQuiz = {
        id: Date.now(), // Use timestamp as unique ID
        title: title,
        questions: currentQuestions,
        createdDate: new Date().toLocaleDateString()
    };
    
    // Save to storage
    saveQuiz(newQuiz);
    
    // Show success notification
    showNotification('Quiz saved!');
    
    // Reset form
    setTimeout(() => {
        // Clear title
        setFormValue('quizTitle', '');
        
        // Clear questions
        currentQuestions = [];
        clearElement('questionsContainer');
        
        // Return to dashboard
        showSection('dashboard');
    }, 1500);
}
