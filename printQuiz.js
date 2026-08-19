/* ============================================
   PRINT QUIZ MODULE
   ============================================ */

function loadQuizzesForPrinting() {
    const quizzes = getAllQuizzes();
    const printQuizzesList = document.getElementById('printQuizzesList');
    
    clearElement('printQuizzesList');
    
    if (quizzes.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No quizzes available yet. Create one first!</p>';
        printQuizzesList.appendChild(emptyState);
        return;
    }
    
    const folders = getAllFolders();
    
    folders.forEach(folderName => {
        displayPrintFolder(folderName, printQuizzesList);
    });
    
    const quizzesWithoutFolder = getQuizzesWithoutFolder();
    if (quizzesWithoutFolder.length > 0) {
        const noFolderContainer = document.createElement('div');
        noFolderContainer.style.marginTop = '20px';
        
        quizzesWithoutFolder.forEach(quiz => {
            displayPrintQuizCard(quiz, noFolderContainer);
        });
        
        printQuizzesList.appendChild(noFolderContainer);
    }
}

function displayPrintFolder(folderName, container) {
    const folderElement = document.createElement('div');
    folderElement.className = 'category-folder';
    folderElement.id = `print-folder-${folderName}`;
    
    const header = document.createElement('div');
    header.className = 'category-folder-header';
    
    const folderTitle = document.createElement('h3');
    folderTitle.className = 'category-folder-title';
    folderTitle.innerHTML = `📁 ${folderName}`;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'category-toggle-btn';
    toggleBtn.textContent = 'View';
    toggleBtn.id = `print-toggle-${folderName}`;
    
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        togglePrintFolderDisplay(folderName, toggleBtn);
    };
    
    header.appendChild(folderTitle);
    header.appendChild(toggleBtn);
    
    const quizzesContainer = document.createElement('div');
    quizzesContainer.className = 'category-quizzes';
    quizzesContainer.id = `print-quizzes-${folderName}`;
    
    const quizzesInFolder = getQuizzesByFolder(folderName);
    const folderQuizzes = quizzesInFolder.filter(q => q.folder === folderName);
    
    folderQuizzes.forEach(quiz => {
        displayPrintQuizCard(quiz, quizzesContainer);
    });
    
    folderElement.appendChild(header);
    folderElement.appendChild(quizzesContainer);
    
    container.appendChild(folderElement);
}

function togglePrintFolderDisplay(folderName, button) {
    const container = document.getElementById(`print-quizzes-${folderName}`);
    
    if (container.classList.contains('expanded')) {
        container.classList.remove('expanded');
        button.textContent = 'View';
    } else {
        container.classList.add('expanded');
        button.textContent = 'Show Less';
    }
}

function displayPrintQuizCard(quiz, container) {
    const quizCard = document.createElement('div');
    quizCard.className = 'quiz-library-card';
    
    const infoSection = document.createElement('div');
    infoSection.innerHTML = `
        <h2>${quiz.title}</h2>
        <p>${quiz.questions.length} question${quiz.questions.length !== 1 ? 's' : ''} | Created: ${quiz.createdDate}</p>
    `;
    
    const actionsSection = document.createElement('div');
    actionsSection.className = 'quiz-card-actions';
    
    const textBtn = document.createElement('button');
    textBtn.className = 'primary-button';
    textBtn.textContent = 'Download .txt';
    textBtn.onclick = () => downloadQuizTextFile(quiz);
    
    actionsSection.appendChild(textBtn);
    
    quizCard.appendChild(infoSection);
    quizCard.appendChild(actionsSection);
    
    container.appendChild(quizCard);
}