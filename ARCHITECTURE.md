# QuizCall - Complete Architecture Documentation

**Last Updated:** August 20, 2026 (Final - After Merge)

---

## 📁 PROJECT STRUCTURE

```
QuizCall/
├── index.html                 # MAIN FILE - Contains all pages (merged)
├── style.css                  # All styling (global + components + theme)
├── Naluka.ttf                 # Custom font file
│
├── mainDashboard.js           # Main dashboard + Reminders + Eat navigation
├── nutrition.js               # Daily Intake functionality
├── storage.js                 # LocalStorage data management
├── ui.js                      # UI utility functions (showSection, etc)
├── createQuiz.js              # Create quiz functionality
├── editQuiz.js                # Edit quiz functionality
├── startQuiz.js               # Take quiz functionality
├── printQuiz.js               # Download quiz as .txt
└── app.js                     # Quiz event listeners (no page initialization)
```

---

## 🎯 HOW IT WORKS NOW (AFTER MERGE)

### All Pages in ONE HTML File
- `index.html` contains ALL sections (main dashboard, Eat, Daily Intake, Reminders, Quiz)
- Each section is a `<div class="page" id="sectionId">` that gets shown/hidden
- No more redirects = **smooth, fast navigation** + **no button position jumps**

### User Flow:
1. Opens `index.html` → sees **Main Dashboard** (Study, Eat, Reminders)
2. Click "Study" → `showSection('quizDashboard')` shows quiz app (Start, Create, Edit, Print)
3. Click "Eat" → shows Nutrition with Daily Intake and Progress buttons
4. Click "Daily Intake" → shows form (date, calories, protein, carbs)
5. Click "Reminders" → shows reminders page with today's date
6. Theme toggle (🌙/☀️) persists across ALL pages via localStorage

---

## 📋 FILE DESCRIPTIONS

### index.html
**THE MAIN FILE** - Contains:
- Main Dashboard page (Study, Eat, Reminders buttons)
- Eat/Nutrition section with Daily Intake & Progress
- Daily Intake form section
- Reminders section
- ALL Quiz sections (Dashboard, Create, Edit, Start, Print, Taking, Results)
- All script tags loading in correct order

**Script Load Order (CRITICAL):**
1. storage.js
2. ui.js
3. createQuiz.js
4. editQuiz.js
5. startQuiz.js
6. printQuiz.js
7. app.js (quiz event listeners only - NO showSection call at end)
8. nutrition.js
9. mainDashboard.js (main app navigation)

---

### style.css
One file containing:
- Global styles (body, page, button, input)
- Main Dashboard styling (.main-dashboard-page, buttons vertical)
- Quiz styling (all quiz sections)
- Eat/Nutrition styling
- Daily Intake styling (forms, inputs, labels)
- Reminders styling (list, items, buttons)
- Theme toggle styling (.dark-mode-toggle-btn, fixed top-right)
- Dark mode support (body.dark-theme classes)
- Responsive media queries

---

### JavaScript Modules (each handles ONE feature)

#### mainDashboard.js
**Main navigation hub** - Handles:
- Dark/Light mode toggle (reads/writes localStorage key `app-theme`)
- Study button → `showSection('quizDashboard')`
- Eat button → `showSection('eatDashboard')`
- Reminders button → displays date + loads reminders list
- Add/Delete reminders (localStorage key `reminders`)
- Daily Intake button → shows form
- Back buttons for all sections

#### app.js
**Quiz event listeners ONLY** - Handles:
- Start, Create, Edit, Print buttons
- Back buttons for each quiz section
- Question add/save/delete
- Quiz navigation (prev/next/finish)
- Results display
- **NO page initialization** (doesn't call showSection at end anymore)

#### ui.js
**Core utilities** - Provides:
- `showSection(sectionId)` - hides all .page, shows target
- `showNotification(message)` - toast messages
- `getFormValue()`, `setFormValue()`, `clearElement()`
- `validateQuizData()`

#### storage.js, createQuiz.js, editQuiz.js, startQuiz.js, printQuiz.js, nutrition.js
Same as before - unchanged functionality

---

## 🌐 DEPLOYMENT

### GitHub Pages Setup:
1. Push to main branch
2. Settings → Pages → main branch, root folder
3. Wait 1-2 minutes

### URLs:
- **Main entry:** `https://yourusername.github.io/quizCall/` (serves index.html)
- No more separate quizCall.html file

---

## ⚠️ IMPORTANT RULES (UPDATED)

1. **ONE HTML FILE** - All content lives in index.html
2. **Script order matters** - Don't reorder the script tags
3. **app.js has NO showSection call at end** - This was causing the disappearing main dashboard
4. **showSection() from ui.js** - All navigation uses this function
5. **CSS classes match HTML IDs** - `id="quizDashboard"` uses CSS for `.dashboard-page`
6. **localStorage keys:**
   - `'quizzes_data'` → quiz questions/folders
   - `'app-theme'` → 'light-theme' or 'dark-theme'
   - `'reminders'` → array of reminder objects
   - `'nutrition_data'` → daily intake entries

---

## 🐛 COMMON ISSUES & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| Main dashboard disappears on load | app.js calling showSection at end | Remove that line (DONE) |
| Buttons jumping when clicked | Page redirect with window.location | Merged into index.html (DONE) |
| Dark mode not syncing | Theme stored in localStorage | Applied immediately in body class (DONE) |
| Daily Intake has no styling | CSS missing | Added complete CSS (DONE) |
| Quiz buttons don't work | Wrong section IDs | All use correct IDs (DONE) |

---

## 📝 SUMMARY

**BEFORE:** Separate index.html and quizCall.html, redirects, layout shifts
**AFTER:** Single index.html with all pages, smooth navigation, no flashing

Everything is merged, working, and styled. Ready for production! ✨