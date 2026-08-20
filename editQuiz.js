/* ============================================
   EDIT QUIZ MODULE
   ============================================ */

let currentEditingQuizId = null;
let currentEditingQuestions = [];

function loadQuizzesForEditing() {
    const quizzes = getAllQuizzes();
    const editQuizzesList = document.getElementById('editQuizzesList');
    
    clearElement('editQuizzesList');
    
    if (quizzes.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No quizzes available yet. Create one to get started!</p>';
        editQuizzesList.appendChild(emptyState);
        return;
    }
    
    const folders = getAllUnits();
    
    folders.forEach(unitName => {
        displayEditUnit(unitName, editQuizzesList);
    });
    
    const quizzesWithoutUnit = getQuizzesWithoutUnit();
    if (quizzesWithoutUnit.length > 0) {
        const noUnitContainer = document.createElement('div');
        noUnitContainer.style.marginTop = '20px';
        
        quizzesWithoutUnit.forEach(quiz => {
            displayEditQuizCard(quiz, noUnitContainer);
        });
        
        editQuizzesList.appendChild(noUnitContainer);
    }
}

function populateEditingUnitSuggestions() {
    const units = getAllUnits();
    const unitDropdownList = document.getElementById('editingUnitDropdownList');
    
    if (unitDropdownList) {
        unitDropdownList.innerHTML = '';
        
        if (units.length > 0) {
            units.forEach(unit => {
                const item = document.createElement('div');
                item.className = 'unit-dropdown-item';
                item.textContent = unit;
                item.onclick = () => selectEditingUnit(unit);
                unitDropdownList.appendChild(item);
            });
        }
    }
}

function selectEditingUnit(unit) {
    setFormValue('editingQuizUnit', unit);
    const dropdown = document.getElementById('editingUnitDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function setupEditingUnitDropdownHandlers() {
    // Get all elements we need
    const editingUnitPickerContainers = document.querySelectorAll('.editing-unit-picker-container');
    
    editingUnitPickerContainers.forEach(container => {
        const dropdown = container.querySelector('.unit-dropdown');
        
        if (container && dropdown) {
            container.addEventListener('mouseenter', () => {
                dropdown.classList.add('show');
            });
            
            container.addEventListener('mouseleave', () => {
                dropdown.classList.remove('show');
            });
        }
    });
}

function displayEditUnit(unitName, container) {
    const folderElement = document.createElement('div');
    folderElement.className = 'category-folder';
    folderElement.id = `edit-unit-${unitName}`;
    
    const header = document.createElement('div');
    header.className = 'category-folder-header';
    
    const folderTitle = document.createElement('h3');
    folderTitle.className = 'category-folder-title';
    folderTitle.innerHTML = `📁 ${unitName}`;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'category-toggle-btn';
    toggleBtn.textContent = 'View';
    toggleBtn.id = `edit-toggle-${unitName}`;
    
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        toggleEditUnitDisplay(unitName, toggleBtn);
    };
    
    header.appendChild(folderTitle);
    header.appendChild(toggleBtn);
    
    const quizzesContainer = document.createElement('div');
    quizzesContainer.className = 'category-quizzes';
    quizzesContainer.id = `edit-quizzes-${unitName}`;
    
    const quizzesInUnit = getQuizzesByUnit(unitName);
    const unitQuizzes = quizzesInUnit.filter(q => q.unit === unitName);
    
    unitQuizzes.forEach(quiz => {
        displayEditQuizCard(quiz, quizzesContainer);
    });
    
    folderElement.appendChild(header);
    folderElement.appendChild(quizzesContainer);
    
    container.appendChild(folderElement);
}

function toggleEditUnitDisplay(unitName, button) {
    const container = document.getElementById(`edit-quizzes-${unitName}`);
    
    if (container.classList.contains('expanded')) {
        container.classList.remove('expanded');
        button.textContent = 'View';
    } else {
        container.classList.add('expanded');
        button.textContent = 'Show Less';
    }
}

function displayEditQuizCard(quiz, container) {
    const quizCard = document.createElement('div');
    quizCard.className = 'quiz-library-card';
    
    const infoSection = document.createElement('div');
    infoSection.innerHTML = `
        <h2>${quiz.title}</h2>
        <p>${quiz.questions.length} question${quiz.questions.length !== 1 ? 's' : ''} | Created: ${quiz.createdDate}</p>
    `;
    
    const actionsSection = document.createElement('div');
    actionsSection.className = 'quiz-card-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'primary-button';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => startEditingQuiz(quiz.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'secondary-button';
    deleteBtn.style.background = '#fee2e2';
    deleteBtn.style.color = '#991b1b';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
        if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
            deleteQuiz(quiz.id);
            showNotification('✓ Quiz deleted!');
            setTimeout(() => {
                loadQuizzesForEditing();
            }, 1500);
        }
    };
    
    actionsSection.appendChild(editBtn);
    actionsSection.appendChild(deleteBtn);
    
    quizCard.appendChild(infoSection);
    quizCard.appendChild(actionsSection);
    
    container.appendChild(quizCard);
}

function startEditingQuiz(quizId) {
    const quiz = getQuizById(quizId);
    
    if (!quiz) {
        alert('Quiz not found!');
        return;
    }
    
    currentEditingQuizId = quizId;
    
    setFormValue('editingQuizTitle', quiz.title);
    setFormValue('editingQuizUnit', quiz.unit || '');
    
    populateEditingUnitSuggestions();
    setupEditingUnitDropdownHandlers();
    
    clearElement('editingQuestionsContainer');
    currentEditingQuestions = JSON.parse(JSON.stringify(quiz.questions));
    
    currentEditingQuestions.forEach(question => {
        renderEditQuestionCard(question);
    });
    
    showSection('quizEditorSection');
}

function renderEditQuestionCard(questionObject) {
    const container = document.getElementById('editingQuestionsContainer');
    
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `edit-question-${questionObject.id}`;
    
    card.innerHTML = `
        <div class="question-card-header">
            <h3 class="question-number">Question ${currentEditingQuestions.indexOf(questionObject) + 1}</h3>
            <button class="remove-question-button" onclick="removeEditQuestion('${questionObject.id}')">Remove</button>
        </div>
        
        <label>Question</label>
        <textarea id="edit-questionText-${questionObject.id}" class="question-input" placeholder="Enter your question here">${questionObject.question}</textarea>

        <label style="display: block; margin-top: 15px;">💡 Hint (Optional)</label>
        <textarea id="edit-questionHint-${questionObject.id}" class="hint-input" placeholder="Enter a helpful hint for this question">${questionObject.hint || ''}</textarea>
        
        <div class="answer-section">
            <div class="type-row">
                <label>Answer Type:</label>
                <select class="type-select" id="edit-answerType-${questionObject.id}" onchange="changeEditAnswerType('${questionObject.id}', this.value)">
                    <option value="multiple-choice" ${questionObject.answerType === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                    <option value="fill-blank" ${questionObject.answerType === 'fill-blank' ? 'selected' : ''}>Fill in the Blank</option>
                </select>
            </div>
            <div id="edit-answersList-${questionObject.id}"></div>
        </div>
    `;
    
    container.appendChild(card);
    renderEditAnswers(questionObject.id);
}

function renderEditAnswers(questionId) {
    const question = currentEditingQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`edit-answersList-${questionId}`);
    
    answersList.innerHTML = '';
    
    if (question.answerType === 'fill-blank') {
        answersList.innerHTML = `
            <label>Correct Answer</label>
            <input type="text" id="edit-correctAnswer-${questionId}" class="answer-input" placeholder="Enter the correct answer" value="${question.answers[0]?.text || ''}">
        `;
    } else {
        const label = document.createElement('label');
        label.textContent = 'Answer Options';
        answersList.appendChild(label);
        
        question.answers.forEach((answer, index) => {
            const optionRow = document.createElement('div');
            optionRow.className = 'option-row';
            optionRow.id = `edit-answer-${answer.id}`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'answer-input';
            input.placeholder = `Enter answer option ${index + 1}`;
            input.value = answer.text;
            input.id = `edit-answerText-${answer.id}`;
            
            const checkboxContainer = document.createElement('label');
            checkboxContainer.className = 'correct-label';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = answer.isCorrect;
            checkbox.onchange = () => updateEditAnswerCorrectStatus(questionId, answer.id, checkbox.checked);
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(document.createTextNode(' Correct'));
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'small-button';
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeEditAnswer(questionId, answer.id);
            
            optionRow.appendChild(input);
            optionRow.appendChild(checkboxContainer);
            optionRow.appendChild(removeBtn);
            
            answersList.appendChild(optionRow);
        });
        
        const addBtn = document.createElement('button');
        addBtn.className = 'add-button';
        addBtn.style.marginTop = '12px';
        addBtn.textContent = '+ Add Answer';
        addBtn.onclick = () => addEditAnswer(questionId);
        answersList.appendChild(addBtn);
    }
}

function addEditQuestion() {
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
    
    currentEditingQuestions.push(questionObject);
    renderEditQuestionCard(questionObject);
}

function removeEditQuestion(questionId) {
    if (currentEditingQuestions.length === 1) {
        alert('You must have at least one question');
        return;
    }
    
    currentEditingQuestions = currentEditingQuestions.filter(q => q.id !== questionId);
    
    const card = document.getElementById(`edit-question-${questionId}`);
    if (card) {
        card.remove();
    }
}

function changeEditAnswerType(questionId, newType) {
    const question = currentEditingQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`edit-answersList-${questionId}`);
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
    
    const select = document.getElementById(`edit-answerType-${questionId}`);
    if (select) {
        select.value = newType;
    }
    
    renderEditAnswers(questionId);
}

function addEditAnswer(questionId) {
    const question = currentEditingQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`edit-answersList-${questionId}`);
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
    
    renderEditAnswers(questionId);
}

function removeEditAnswer(questionId, answerId) {
    const question = currentEditingQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    if (question.answers.length === 1) {
        alert('Each question must have at least one answer');
        return;
    }
    
    const answersList = document.getElementById(`edit-answersList-${questionId}`);
    if (answersList) {
        const inputs = answersList.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            if (question.answers[index]) {
                question.answers[index].text = input.value.trim();
            }
        });
    }
    
    question.answers = question.answers.filter(a => a.id !== answerId);
    
    renderEditAnswers(questionId);
}

function updateEditAnswerCorrectStatus(questionId, answerId, isCorrect) {
    const question = currentEditingQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const answersList = document.getElementById(`edit-answersList-${questionId}`);
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
    
    renderEditAnswers(questionId);
}

function saveEditedQuiz() {
    const title = getFormValue('editingQuizTitle');
    const folder = getFormValue('editingQuizUnit');
    
    currentEditingQuestions.forEach(question => {
        const textInput = document.getElementById(`edit-questionText-${question.id}`);
        if (textInput) {
            question.question = textInput.value.trim();
        }
        
        const hintInput = document.getElementById(`edit-questionHint-${question.id}`);
        if (hintInput) {
            question.hint = hintInput.value.trim();
        }
        
        if (question.answerType === 'fill-blank') {
            const correctInput = document.getElementById(`edit-correctAnswer-${question.id}`);
            if (correctInput) {
                question.answers[0].text = correctInput.value.trim();
                question.answers[0].isCorrect = true;
            }
        } else {
            const answersList = document.getElementById(`edit-answersList-${question.id}`);
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
    
    const validation = validateQuizData(title, currentEditingQuestions);
    
    if (!validation.isValid) {
        alert(validation.error);
        return;
    }
    
    const allQuizzes = getAllQuizzes();
    const quizIndex = allQuizzes.findIndex(q => q.id === currentEditingQuizId);
    
    if (quizIndex !== -1) {
        allQuizzes[quizIndex].title = title;
        allQuizzes[quizIndex].unit = folder || null;
        allQuizzes[quizIndex].questions = JSON.parse(JSON.stringify(currentEditingQuestions));
        
        try {
            localStorage.setItem('quizzes_data', JSON.stringify(allQuizzes));
            
            showNotification('✓ Quiz updated successfully!');
            
            setTimeout(() => {
                currentEditingQuizId = null;
                currentEditingQuestions = [];
                clearElement('editingQuestionsContainer');
                loadQuizzesForEditing();
                showSection('editQuizSection');
            }, 2000);
            
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Error saving quiz. Please try again.');
        }
    }
}