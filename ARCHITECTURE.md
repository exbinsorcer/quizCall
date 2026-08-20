# QuizCall - Complete Architecture Documentation

**Last Updated:** August 20, 2026

---

## 📁 PROJECT STRUCTURE

```
QuizCall/
├── index.html                 # QuizCall dashboard (Start, Create, Edit, Print)
├── mainDashboard.html         # MAIN ENTRY POINT (Study, Eat buttons + Theme Toggle)
├── style.css                  # All styling (global + components + theme)
├── Naluka.ttf                 # Custom font file
│
├── storage.js                 # LocalStorage data management
├── ui.js                      # UI utility functions
├── createQuiz.js              # Create quiz functionality
├── editQuiz.js                # Edit quiz functionality
├── startQuiz.js               # Take quiz functionality
├── printQuiz.js               # Download quiz as .txt
├── app.js                     # Event listeners (button click handlers)
└── mainDashboard.js           # Main dashboard logic + theme toggle
```

---

## 🎯 HOW IT WORKS

### User Flow:
1. User opens **mainDashboard.html** (main entry point)
2. Sees "QuizCall" title with 2 buttons: "📚 Study" and "🍽️ Eat"
3. Theme toggle (🌙 Dark / ☀️ Light) in top right
4. Click "📚 Study" → redirects to `index.html` (QuizCall app)
5. Click "🍽️ Eat" → shows Nutrition section (placeholder)
6. In QuizCall, click Start/Create/Edit/Print as normal
7. **No back button from QuizCall** (user must use browser back)

---

## 📋 FILE DESCRIPTIONS

### Entry Points

#### **mainDashboard.html**
- Main entry point users see first
- Contains Study and Eat buttons
- Theme toggle button (top right)
- Imports `style.css` and `mainDashboard.js`
- **NO changes needed to this** (except if adding new features)

#### **index.html**
- QuizCall dashboard (Start, Create, Edit, Print buttons)
- All HTML sections (create, edit, start, print, taking, results)
- Imports 7 JS files in order:
  1. storage.js
  2. ui.js
  3. createQuiz.js
  4. editQuiz.js
  5. startQuiz.js
  6. printQuiz.js
  7. app.js
- **DO NOT change script load order**

---

### JavaScript Modules (each handles ONE feature)

#### **storage.js** - Data Management
Functions:
- `getAllQuizzes()` - Get all quizzes from localStorage
- `saveQuiz(quiz)` - Save new quiz
- `getQuizById(quizId)` - Get single quiz
- `deleteQuiz(quizId)` - Delete quiz
- `getQuizzesByFolder(folderName)` - Get quizzes in folder
- `getAllFolders()` - Get list of all folders
- `getQuizzesWithoutFolder()` - Get quizzes not in folder
- `generateQuizTextFile(quiz)` - Create text content
- `downloadQuizTextFile(quiz)` - Download as .txt file

**Data Structure (localStorage key: 'quizzes_data'):**
```javascript
{
  id: Date.now(),
  title: "Quiz Title",
  folder: "Physics" or null,
  questions: [
    {
      id: "unique_id",
      question: "What is...?",
      hint: "Optional hint text",
      answerType: "multiple-choice" or "fill-blank",
      answers: [
        { id: "ans_1", text: "Option 1", isCorrect: true },
        { id: "ans_2", text: "Option 2", isCorrect: false }
      ]
    }
  ],
  createdDate: "8/20/2026"
}
```

#### **ui.js** - Utility Functions
Functions:
- `showSection(sectionId)` - Show/hide page sections
- `showNotification(message)` - Toast message at bottom
- `createUniqueId()` - Generate unique ID
- `getFormValue(elementId)` - Get input value
- `setFormValue(elementId, value)` - Set input value
- `clearElement(elementId)` - Clear element innerHTML
- `validateQuizData(title, questions)` - Validate quiz before save

**Called by:** All other modules

#### **createQuiz.js** - Create New Quizzes
Global Variables:
- `currentQuestions = []` - Questions being created

Functions:
- `initCreateQuiz()` - Reset form, show first question
- `addQuestion()` - Add new question
- `renderQuestionCard(questionObject)` - Render question card
- `renderAnswers(questionId)` - Render answer options
- `addAnswer(questionId)` - Add answer option
- `changeAnswerType(questionId, newType)` - Switch MC/Fill-blank
- `removeQuestion(questionId)` - Delete question
- `removeAnswer(questionId, answerId)` - Delete answer option
- `updateAnswerCorrectStatus(questionId, answerId, isCorrect)` - Mark correct
- `saveQuiz()` - Save quiz to storage

**Depends on:** storage.js, ui.js

#### **editQuiz.js** - Edit Existing Quizzes
Global Variables:
- `currentEditingQuizId = null`
- `currentEditingQuestions = []`

Functions:
- `loadQuizzesForEditing()` - List all quizzes
- `displayEditFolder(folderName, container)` - Show folder
- `toggleEditFolderDisplay(folderName, button)` - Expand/collapse folder
- `displayEditQuizCard(quiz, container)` - Quiz card with Edit/Delete
- `startEditingQuiz(quizId)` - Load quiz into editor
- `renderEditQuestionCard(questionObject)` - Render question
- `renderEditAnswers(questionId)` - Render answers
- `addEditQuestion()` - Add question while editing
- `removeEditQuestion(questionId)` - Delete question
- `changeEditAnswerType(questionId, newType)` - Switch type
- `addEditAnswer(questionId)` - Add answer
- `removeEditAnswer(questionId, answerId)` - Delete answer
- `updateEditAnswerCorrectStatus(questionId, answerId, isCorrect)` - Mark correct
- `saveEditedQuiz()` - Save changes to storage

**Depends on:** storage.js, ui.js

#### **startQuiz.js** - Take Quizzes
Global Variables:
- `currentTakingQuizId = null`
- `currentQuestionIndex = 0`
- `userAnswers = []`
- `hintShown = false`

Functions:
- `loadQuizzes()` - List all quizzes
- `displayFolder(folderName, container)` - Show folder
- `toggleFolderDisplay(folderName, button)` - Expand/collapse
- `displayQuizCard(quiz, container)` - Quiz card with Start button
- `startTakingQuiz(quizId)` - Begin quiz
- `displayQuestion()` - Show current question
- `toggleHint(hintText, button)` - Show/hide hint overlay
- `displayMultipleChoice(question)` - Render MC options
- `displayFillBlank(question)` - Render text input
- `updateNavigationButtons(quiz)` - Update prev/next/finish buttons
- `goToPreviousQuestion()` - Previous question
- `goToNextQuestion()` - Next question
- `finishQuiz()` - End quiz
- `displayResults(quiz, correctCount, totalQuestions, percentage)` - Show results

**Depends on:** storage.js, ui.js

#### **printQuiz.js** - Download Quizzes
Functions:
- `loadQuizzesForPrinting()` - List all quizzes
- `displayPrintFolder(folderName, container)` - Show folder
- `togglePrintFolderDisplay(folderName, button)` - Expand/collapse
- `displayPrintQuizCard(quiz, container)` - Quiz card with Download button

**Depends on:** storage.js, ui.js

#### **app.js** - Event Listeners ONLY
**PURPOSE:** Connect HTML buttons to functions from other modules
**RULE:** Only add event listeners here, NO logic

Example structure:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            loadQuizzes();        // Call from startQuiz.js
            showSection('startQuizSection');  // Call from ui.js
        });
    }
});
```

**Current listeners:**
- startQuizBtn → loadQuizzes + showSection
- createQuizBtn → initCreateQuiz + showSection
- editQuizBtn → loadQuizzesForEditing + showSection
- printQuizBtn → loadQuizzesForPrinting + showSection
- All back buttons → showSection('dashboard')
- All add/save buttons → respective functions

#### **mainDashboard.js** - Main Dashboard Logic
Functions:
- `updateThemeButton()` - Update button text based on theme
- `showSection(sectionId)` - Show/hide page sections
- `showNotification(message)` - Toast message
- Event listeners:
  - studyBtn → redirect to index.html
  - eatBtn → show eatDashboard section
  - backToMainFromEatBtn → show mainDashboard section
  - dailyIntakeBtn → notification (coming soon)
  - progressBtn → notification (coming soon)

**Theme Storage:**
- Key: `app-theme`
- Values: `light-theme` or `dark-theme`
- Persists across page refreshes

---

### Styling

#### **style.css**
One file containing:
1. **Global styles** - body, page, button, input
2. **Dashboard** - .dashboard-page, .dashboard-card, .dashboard-buttons
3. **Quiz creation** - .question-card, .answer-section, .creator-container
4. **Quiz taking** - .quiz-question-card, .quiz-options, .quiz-navigation
5. **Results** - .result-area, .quiz-review-container, .quiz-review-question
6. **Printing** - .quiz-library, .quiz-library-card
7. **Main dashboard** - .main-dashboard-page, .main-dashboard-buttons, .eat-dashboard-page
8. **Theme toggle** - .theme-toggle, .light-theme, .dark-theme
9. **Responsive** - @media (max-width: 700px)

**Theme Classes:**
- `body.light-theme` - Light mode (default)
- `body.dark-theme` - Dark mode

---

## 🔧 HOW TO MODIFY SAFELY

### Adding a new button in app.js:
```javascript
const myNewBtn = document.getElementById('myNewBtn');
if (myNewBtn) {
    myNewBtn.addEventListener('click', function() {
        existingFunction();  // Call from another module
        showSection('somePage');
    });
}
```

### Adding a new quiz field (e.g., difficulty):
1. Add to storage.js quiz structure
2. Update createQuiz.js form
3. Update editQuiz.js form
4. Update storage functions if needed

### Modifying theme colors:
Edit `style.css` - search for `body.dark-theme` sections

### Adding a new page/section:
1. Add HTML in `index.html`
2. Add CSS in `style.css` for `.your-section-page`
3. Add event listener in `app.js`
4. Use `showSection('yourSectionId')` to show it

---

## 🌐 DEPLOYMENT

### GitHub Pages Setup:
1. Push to main branch
2. Go to repo Settings → Pages
3. Source: main branch, root folder
4. Wait 1-2 minutes

### URLs:
- **Main Entry:** `https://yourusername.github.io/repo-name/mainDashboard.html`
- **QuizCall:** `https://yourusername.github.io/repo-name/index.html`

## GitHub Pages Path Note
If your repo is NOT at the root (e.g., https://username.github.io/quizCall/):
- Use absolute paths: window.location.href = '/quizCall/quizCall.html';
- Not relative paths: window.location.href = 'quizCall.html';

**Note:** Users should visit mainDashboard.html first for theme toggle

---

## 📊 QUIZ DATA FLOW

```
User creates quiz
    ↓
createQuiz.js builds question objects
    ↓
storage.js saves to localStorage
    ↓
app.js handles UI updates
    ↓
User sees "✓ Quiz saved"
    ↓
startQuiz.js retrieves from localStorage
    ↓
User takes quiz
    ↓
Answers stored in userAnswers array
    ↓
startQuiz.js calculates score
    ↓
Results displayed
```

---

## ⚠️ IMPORTANT RULES

1. **Script load order in index.html matters** - Don't reorder
2. **app.js is ONLY event listeners** - Keep it lean
3. **Each .js file has one job** - Don't mix functionality
4. **style.css is ONE file** - No separate stylesheets
5. **localStorage key is 'quizzes_data'** - Don't change
6. **theme is stored as 'app-theme'** - Don't change
7. **mainDashboard.html is separate** - Don't mix with index.html

---

## 🐛 COMMON ISSUES & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| Start/Edit/Print buttons don't work | Missing function call in app.js | Check function exists in respective .js file |
| Quiz doesn't save | localStorage full or validation error | Check browser console for error |
| Theme not persisting | localStorage key wrong | Verify key is `app-theme` |
| Buttons unresponsive | Script load order wrong | Verify order in index.html |
| CSS not applying | Class name typo | Check spelling in HTML vs CSS |

---

## 📝 SUMMARY

- **mainDashboard.html** = Entry point with theme toggle
- **index.html** = QuizCall app (loads 7 JS files)
- **style.css** = All styling including dark mode
- **7 JS modules** = Each handles one feature
- **app.js** = Only event listeners
- **mainDashboard.js** = Theme + navigation logic

**Key concept:** Each file does ONE thing. Don't mix concerns.

---

## 🎯 NEXT STEPS

When starting new work:
1. Provide this ARCHITECTURE.md file
2. Specify what you want to add/change
3. Mention which file needs modification
4. AI will make minimal, focused changes

This keeps things organized and prevents breaking existing code!