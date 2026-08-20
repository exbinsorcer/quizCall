# QuizCall - File Dependencies Map

**Last Updated:** August 20, 2026

This document shows which files are affected when you want to add or modify features.

---

## 🎯 QUICK REFERENCE: "If I want to add X, which files do I change?"

### Add a New Main Dashboard Button
**Files to change:**
1. `index.html` - Add button HTML (inside `<div class="main-dashboard-buttons">`)
2. `style.css` - Add button styling (`.your-new-btn-class`)
3. `mainDashboard.js` - Add event listener for the button

**Example:** Adding a "Settings" button
```
index.html: <button class="main-dashboard-btn settings-btn" id="settingsBtn">⚙️ Settings</button>
style.css: .settings-btn { background: #6366f1; color: white; }
mainDashboard.js: Add click listener for settingsBtn that calls showSection('settingsPage')
```

---

### Add a New Page/Section
**Files to change:**
1. `index.html` - Add new `<div class="page" id="newSection">` with all HTML content
2. `style.css` - Add CSS for `.new-section-page` and any child elements
3. `mainDashboard.js` - Add event listener + back button handler
4. (Optional) `app.js` - Only if it's a QUIZ-related page

**Example:** Adding a "Settings" page
```
index.html: Add <div class="page" id="settingsPage" style="display: none;">...</div>
style.css: Add .settings-page { ... } styling
mainDashboard.js: Add button click handler and back button handler
```

---

### Modify Existing Theme/Colors
**Files to change:**
1. `style.css` - Only file (modify color values)

**No other files need changes** - theme colors live entirely in CSS.

---

### Modify Navigation/Button Behavior
**Files to change:**
1. `mainDashboard.js` - Modify the event listener logic
2. `style.css` - (If styling changes)
3. `index.html` - (If HTML structure changes)

---

## 📊 DETAILED DEPENDENCY CHART

### index.html (THE MAIN FILE)
**What it contains:**
- All HTML for all pages
- All section IDs (`mainDashboard`, `quizDashboard`, `eatDashboard`, `dailyIntakePage`, `remindersPage`)
- All button IDs and form input IDs
- Script load order

**What depends on it:**
- EVERYTHING - all other files reference elements by ID from index.html
- JavaScript files use `document.getElementById()` to find buttons/inputs
- CSS files use class names and IDs that exist in index.html

**If you change index.html:**
- ✅ Add a new button → update `mainDashboard.js` and `style.css`
- ✅ Change a button ID → update the JavaScript file that references it
- ✅ Add a new page section → add CSS and JavaScript to handle it
- ✅ Change class names → update `style.css`

---

### mainDashboard.js (MAIN NAVIGATION HUB)
**What it handles:**
- Main dashboard button clicks (Study, Eat, Reminders)
- Navigation between pages (calls `showSection()`)
- Dark/Light mode toggle
- Reminders functionality (add, delete, load, display)
- Daily Intake initialization
- All back buttons from main sections

**What it depends on:**
- `index.html` - button and form IDs must exist
- `ui.js` - uses `showSection()` and `showNotification()`
- `nutrition.js` - calls `initDailyIntake()` when Daily Intake clicked

**If you change mainDashboard.js:**
- ✅ Add new button behavior
- ✅ Modify navigation flow
- ✅ Change which page shows first
- ✅ Modify reminders logic

**If you change it, also check:**
- That all IDs referenced actually exist in `index.html`
- That `showSection()` is called correctly

---

### style.css (ALL STYLING)
**What it handles:**
- ALL visual styling
- Colors, fonts, layouts
- Dark theme support
- Responsive design

**What it depends on:**
- `index.html` - class names and IDs must match

**If you change style.css:**
- ✅ Change colors/themes
- ✅ Modify button appearance
- ✅ Change page layouts
- ✅ Add styling for new sections

**If you add new section in index.html:**
- ✅ You MUST add CSS in style.css for that section

---

### app.js (QUIZ EVENT LISTENERS ONLY)
**What it handles:**
- Quiz buttons (Start, Create, Edit, Print)
- Quiz navigation and interactions
- Quiz question management
- Quiz results display

**What it depends on:**
- `index.html` - quiz button/section IDs
- `ui.js` - uses `showSection()`
- `storage.js`, `createQuiz.js`, `editQuiz.js`, `startQuiz.js`, `printQuiz.js` - calls their functions

**IMPORTANT:** app.js does NOT initialize any page at the end anymore - that's mainDashboard.js's job.

**If you change app.js:**
- ✅ Modify quiz button behavior
- ✅ Add new quiz features
- ❌ Do NOT add `showSection()` call at the end

---

### ui.js (CORE UTILITIES)
**What it provides:**
- `showSection(sectionId)` - show/hide pages
- `showNotification(message)` - toast messages
- Form utilities: `getFormValue()`, `setFormValue()`, `clearElement()`
- Validation: `validateQuizData()`

**What depends on it:**
- `mainDashboard.js` - uses all functions
- `app.js` - uses `showSection()`
- `nutrition.js` - uses `showNotification()`
- All quiz files - use these utilities

**If you change ui.js:**
- ✅ Modify how pages show/hide
- ✅ Change notification behavior
- ❌ Be careful - many files depend on these functions

---

### nutrition.js (DAILY INTAKE)
**What it handles:**
- Daily Intake form initialization
- Storage of nutrition data (localStorage key: `nutrition_data`)
- Form value management

**What it depends on:**
- `index.html` - Daily Intake form IDs
- `ui.js` - uses `showNotification()`

**If you change nutrition.js:**
- ✅ Modify how Daily Intake data is saved
- ✅ Add new nutrition fields
- ✅ Change data storage structure

**If you add new nutrition fields:**
- ✅ Add HTML in `index.html`
- ✅ Add CSS in `style.css`
- ✅ Update `nutrition.js` to handle new fields

---

### Other Files (storage.js, createQuiz.js, editQuiz.js, startQuiz.js, printQuiz.js)
**What they handle:**
- Quiz data management and creation
- Quiz editing and display
- Quiz taking and results

**What they depend on:**
- `index.html` - quiz section IDs
- `ui.js` - utilities
- `app.js` - event listeners

**If you change these:**
- ✅ Modify quiz functionality
- ✅ Change how quiz data is stored
- ✅ Add new quiz features

---

## 🔄 COMMON SCENARIOS

### Scenario 1: Add a New Feature Button to Main Dashboard

1. **index.html** - Add button HTML:
```html
<button class="main-dashboard-btn feature-btn" id="featureBtn">🎯 Feature</button>
```

2. **style.css** - Add button styling:
```css
.feature-btn {
    background: #your-color;
    color: white;
}
```

3. **mainDashboard.js** - Add event listener:
```javascript
const featureBtn = document.getElementById('featureBtn');
if (featureBtn) {
    featureBtn.addEventListener('click', function() {
        showSection('featurePage');
    });
}
```

4. **index.html** - Add the feature page section:
```html
<div class="page" id="featurePage" style="display: none;">
    <!-- feature content here -->
</div>
```

5. **style.css** - Add feature page styling:
```css
.feature-page {
    display: flex;
    /* styling here */
}
```

---

### Scenario 2: Modify Quiz Behavior

1. **app.js** - Modify the event listener for quiz buttons
2. **quiz JS files** (createQuiz.js, etc.) - Modify the actual functionality
3. **style.css** - (If visual changes needed)
4. **index.html** - (If HTML changes needed)

---

### Scenario 3: Change Overall Color Scheme

1. **style.css** - ONLY FILE NEEDED
   - Change colors in CSS variables or class definitions
   - Both light and dark theme support built-in

---

### Scenario 4: Add a New Form Field to Daily Intake

1. **index.html** - Add input HTML to Daily Intake form
2. **style.css** - Add styling for new input (usually inherits from `.intake-input`)
3. **nutrition.js** - Add code to read/save the new field

---

## 📌 KEY RULES TO REMEMBER

**Rule 1:** Every element in HTML needs matching styling in CSS
- If you add `<div id="newThing">`, add `.new-thing { ... }` in CSS

**Rule 2:** Every clickable element needs an event listener
- If you add a button, add `addEventListener` in the appropriate JS file

**Rule 3:** Every page section needs a unique ID
- Format: `id="pageName"` (e.g., `id="settingsPage"`)
- Class for styling: `class="page settings-page"`

**Rule 4:** Navigation always uses `showSection()`
- Don't use `window.location.href` anymore (old approach)
- Always call `showSection('pageId')` from mainDashboard.js

**Rule 5:** app.js is quiz-only
- Don't add main dashboard logic there
- Don't call `showSection()` at the end of app.js

---

## 🎯 SUMMARY TABLE

| Feature | index.html | style.css | mainDashboard.js | app.js | Other Files |
|---------|-----------|-----------|------------------|--------|-------------|
| New main button | ✅ HTML | ✅ Styling | ✅ Listener | ❌ | |
| New page section | ✅ HTML | ✅ Styling | ✅ Navigation | ❌ | |
| Change colors | ❌ | ✅ | ❌ | ❌ | |
| Quiz features | ✅ HTML | ✅ Styling | ❌ | ✅ Listeners | ✅ Quiz files |
| Reminders | ✅ HTML | ✅ Styling | ✅ Logic | ❌ | |
| Daily Intake | ✅ HTML | ✅ Styling | ✅ Init | ❌ | ✅ nutrition.js |

---

## ✨ QUICK CHECKLIST FOR ADDING FEATURES

```
[ ] Added HTML in index.html
[ ] Added CSS styling in style.css
[ ] Added event listeners in mainDashboard.js or app.js
[ ] All IDs in HTML match JavaScript references
[ ] All class names in HTML match CSS selectors
[ ] Dark theme support added if applicable
[ ] Back button added to return to previous page
[ ] Tested locally before pushing to git
```

EOF
