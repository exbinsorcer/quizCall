/* ============================================
   CREATE QUIZ MODULE
   ============================================ */

let currentQuestions = [];

function initCreateQuiz() {
    setFormValue('quizTitle', '');
    setFormValue('quizFolder', '');
    clearElement('questionsContainer');
    currentQuestions = [];
    addQuestion();
}

function addQuestion() {
    const questionId = createUniqueId();
    const questionObject = {
        id: questionId,
        question: '',
        hint: '',
        answerType: 'multiple-choice',
        answers: [
            { id: createUniqueId(), text: '', isCorrect: false }
        ]
    };
    
    currentQuestions.push(questionObject);
    renderQuestionCard(questionObject);
}

function renderQuestionCard(questionObject) {
    const container = document.getElementById('questionsContainer');
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `question-${questionObject.id}`;
    
    card.innerHTML = `
        <div class="question-card-header">
            <h3 class="question-number">Question ${currentQuestions.length}</h3>
            <button class="remove-question-button" onclick="removeQuestion('${questionObject.id}')">Remove</button>
        </div>
        
        <label>Question</label>
        <textarea id="questionText-${questionObject.id}" class="question-input" placeholder="Enter your question here">${questionObject.question}</textarea>

        <label style="display: block; margin-top: 15px;">💡 Hint (Optional)</label>
        <textarea id="questionHint-${questionObject.id}" class="hint-input" placeholder="Enter a helpful hint for this question">${questionObject.hint}</textarea>
        
        <div class="answer-section">
            <div class="type-row">
                <label>Answer Type:</label>
                <select class="type-select" id="answerType-${questionObject.id}" onchange="changeAnswerType('${questionObject.id}', this.value)">
                    <option value="multiple-choice" ${questionObject.answerType === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                    <option value="fill-blank" ${questionObject.answerType === 'fill-blank' ? 'selected' : ''}>Fill in the Blank</option>
                </select>
            </div>
            <div id="answersList-${questionObject.id}"></div>
        </div>
    `;
    
    container.appendChild(card);
    renderAnswers(questionObject.id);
}

function renderAnswers(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`answersList-${questionId}`);
    answersList.innerHTML = '';
    
    if (question.answerType === 'fill-blank') {
        answersList.innerHTML = `
            <label>Correct Answer</label>
            <input type="text" id="correctAnswer-${questionId}" class="answer-input" placeholder="Enter the correct answer" value="${question.answers[0]?.text || ''}">
        `;
    } else {
        const label = document.createElement('label');
        label.textContent = 'Answer Options';
        answersList.appendChild(label);
        
        question.answers.forEach((answer, index) => {
            const optionRow = document.createElement('div');
            optionRow.className = 'option-row';
            optionRow.id = `answer-${answer.id}`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'answer-input';
            input.placeholder = `Enter answer option ${index + 1}`;
            input.value = answer.text;
            input.id = `answerText-${answer.id}`;
            
            const checkboxContainer = document.createElement('label');
            checkboxContainer.className = 'correct-label';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = answer.isCorrect;
            checkbox.onchange = () => updateAnswerCorrectStatus(questionId, answer.id, checkbox.checked);
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(document.createTextNode(' Correct'));
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'small-button';
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeAnswer(questionId, answer.id);
            
            optionRow.appendChild(input);
            optionRow.appendChild(checkboxContainer);
            optionRow.appendChild(removeBtn);
            answersList.appendChild(optionRow);
        });
        
        const addBtn = document.createElement('button');
        addBtn.className = 'add-button';
        addBtn.style.marginTop = '12px';
        addBtn.textContent = '+ Add Answer';
        addBtn.onclick = () => addAnswer(questionId);
        answersList.appendChild(addBtn);
    }
}

function addAnswer(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`answersList-${questionId}`);
    if (answersList) {
        const inputs = answersList.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            if (question.answers[index]) {
                question.answers[index].text = input.value.trim();
            }
        });
    }
    
    const newAnswer = {
        id: createUniqueId(),
        text: '',
        isCorrect: false
    };
    
    question.answers.push(newAnswer);
    renderAnswers(questionId);
}

function changeAnswerType(questionId, newType) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`answersList-${questionId}`);
    if (answersList && question.answerType === 'multiple-choice') {
        const inputs = answersList.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            if (question.answers[index]) {
                question.answers[index].text = input.value.trim();
            }
        });
    }
    
    question.answerType = newType;
    
    if (newType === 'fill-blank') {
        question.answers = [
            {
                id: createUniqueId(),
                text: '',
                isCorrect: true
            }
        ];
    } else {
        if (question.answers.length === 0) {
            question.answers = [
                { id: createUniqueId(), text: '', isCorrect: false }
            ];
        }
    }
    
    const select = document.getElementById(`answerType-${questionId}`);
    if (select) {
        select.value = newType;
    }
    
    renderAnswers(questionId);
}

function removeQuestion(questionId) {
    if (currentQuestions.length === 1) {
        alert('You must have at least one question');
        return;
    }
    
    currentQuestions = currentQuestions.filter(q => q.id !== questionId);
    const card = document.getElementById(`question-${questionId}`);
    if (card) {
        card.remove();
    }
}

function removeAnswer(questionId, answerId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    if (question.answers.length === 1) {
        alert('Each question must have at least one answer');
        return;
    }
    
    const answersList = document.getElementById(`answersList-${questionId}`);
    if (answersList) {
        const inputs = answersList.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            if (question.answers[index]) {
                question.answers[index].text = input.value.trim();
            }
        });
    }
    
    question.answers = question.answers.filter(a => a.id !== answerId);
    renderAnswers(questionId);
}

function updateAnswerCorrectStatus(questionId, answerId, isCorrect) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`answersList-${questionId}`);
    if (answersList) {
        const inputs = answersList.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            if (question.answers[index]) {
                question.answers[index].text = input.value.trim();
            }
        });
    }
    
    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return;
    
    answer.isCorrect = isCorrect;
    renderAnswers(questionId);
}

function saveQuiz() {
    const title = getFormValue('quizTitle');
    const folder = getFormValue('quizFolder');
    
    currentQuestions.forEach(question => {
        const textInput = document.getElementById(`questionText-${question.id}`);
        if (textInput) {
            question.question = textInput.value.trim();
        }
        
        const hintInput = document.getElementById(`questionHint-${question.id}`);
        if (hintInput) {
            question.hint = hintInput.value.trim();
        }
        
        if (question.answerType === 'fill-blank') {
            const correctInput = document.getElementById(`correctAnswer-${question.id}`);
            if (correctInput) {
                question.answers[0].text = correctInput.value.trim();
                question.answers[0].isCorrect = true;
            }
        } else {
            const answersList = document.getElementById(`answersList-${question.id}`);
            if (answersList) {
                const answerInputs = answersList.querySelectorAll('input[type="text"]');
                const checkboxes = answersList.querySelectorAll('input[type="checkbox"]');
                
                question.answers.forEach((answer, index) => {
                    if (answerInputs[index]) {
                        answer.text = answerInputs[index].value.trim();
                    }
                    if (checkboxes[index]) {
                        answer.isCorrect = checkboxes[index].checked;
                    }
                });
            }
        }
    });
    
    const validation = validateQuizData(title, currentQuestions);
    
    if (!validation.isValid) {
        alert(validation.error);
        return;
    }
    
    const newQuiz = {
        id: Date.now(),
        title: title,
        folder: folder || null,
        questions: JSON.parse(JSON.stringify(currentQuestions)),
        createdDate: new Date().toLocaleDateString()
    };
    
    const allQuizzes = getAllQuizzes();
    allQuizzes.push(newQuiz);
    
    try {
        localStorage.setItem('quizzes_data', JSON.stringify(allQuizzes));
        showNotification('✓ Quiz saved successfully!');
        
        setTimeout(() => {
            setFormValue('quizTitle', '');
            setFormValue('quizFolder', '');
            currentQuestions = [];
            clearElement('questionsContainer');
            showSection('dashboard');
        }, 2000);
        
    } catch (error) {
        console.error('Error saving quiz:', error);
        alert('Error saving quiz. Please try again.');
    }
}