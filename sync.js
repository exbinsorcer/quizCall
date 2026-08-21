/* ============================================
   SYNC MODULE
   Handles export/import of quizzes across devices
   ============================================ */

const BACKUP_VERSION = '1.0';

function getFormattedDate() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

function exportAllData() {
    try {
        // Gather all data from localStorage
        const quizzesData = localStorage.getItem('quizzes_data');
        const reviewData = localStorage.getItem('review_data');
        const reminders = localStorage.getItem('reminders');
        const theme = localStorage.getItem('app-theme');
        const nutritionData = localStorage.getItem('nutrition_data');
        
        // Build backup object
        const backup = {
            version: BACKUP_VERSION,
            exportedAt: new Date().toISOString(),
            quizzes: quizzesData ? JSON.parse(quizzesData) : [],
            reviewData: reviewData ? JSON.parse(reviewData) : null,
            nutritionData: nutritionData ? JSON.parse(nutritionData) : null,
            reminders: reminders ? JSON.parse(reminders) : [],
            theme: theme || 'light-theme'
        };
        
        // Convert to JSON string
        const jsonString = JSON.stringify(backup, null, 2);
        
        // Trigger download
        const filename = `QuizCall-Backup-${getFormattedDate()}.json`;
        downloadFile(jsonString, filename, 'application/json');
        
        showNotification(`✅ Exported ${backup.quizzes.length} quizzes successfully`);
    } catch (error) {
        console.error('Export error:', error);
        showNotification('❌ Export failed. Please try again.');
    }
}

function downloadFile(content, filename, mimeType) {
    // Create a blob
    const blob = new Blob([content], { type: mimeType });
    
    // Create a temporary URL
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function handleImportFile(file) {
    if (!file) return;
    
    // Validate file type
    if (!file.name.endsWith('.json')) {
        showNotification('❌ Please select a .json file');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const content = event.target.result;
            const backup = JSON.parse(content);
            
            // Validate backup structure
            if (!validateBackup(backup)) {
                showNotification('❌ Invalid backup file format');
                return;
            }
            
            // Show merge/replace dialog
            showImportDialog(backup);
        } catch (error) {
            console.error('Import error:', error);
            showNotification('❌ Failed to read file. Please ensure it\'s a valid backup.');
        }
    };
    
    reader.readAsText(file);
}

function validateBackup(backup) {
    // Check version
    if (!backup.version) {
        return false;
    }
    
    // Check if it has at least quizzes
    if (!Array.isArray(backup.quizzes)) {
        return false;
    }
    
    return true;
}

function showImportDialog(backup) {
    // Create dialog overlay
    const overlay = document.createElement('div');
    overlay.className = 'import-dialog-overlay';
    overlay.id = 'importDialogOverlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'import-dialog';
    
    const title = document.createElement('h2');
    title.textContent = '📥 Import Quizzes';
    dialog.appendChild(title);
    
    const info = document.createElement('p');
    info.textContent = `This backup contains ${backup.quizzes.length} quiz(zes) created on ${new Date(backup.exportedAt).toLocaleDateString()}`;
    dialog.appendChild(info);
    
    const question = document.createElement('p');
    question.style.fontWeight = '600';
    question.style.marginTop = '20px';
    question.textContent = 'What would you like to do?';
    dialog.appendChild(question);
    
    // Merge button
    const mergeBtn = document.createElement('button');
    mergeBtn.className = 'primary-button';
    mergeBtn.textContent = '➕ Merge with existing quizzes';
    mergeBtn.onclick = () => {
        importData(backup, 'merge');
        closeImportDialog();
    };
    dialog.appendChild(mergeBtn);
    
    // Replace button
    const replaceBtn = document.createElement('button');
    replaceBtn.className = 'secondary-button';
    replaceBtn.style.marginTop = '12px';
    replaceBtn.textContent = '🔄 Replace all quizzes';
    replaceBtn.onclick = () => {
        if (confirm('⚠️ This will replace all your current quizzes. Are you sure?')) {
            importData(backup, 'replace');
            closeImportDialog();
        }
    };
    dialog.appendChild(replaceBtn);
    
    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'secondary-button';
    cancelBtn.style.marginTop = '12px';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => closeImportDialog();
    dialog.appendChild(cancelBtn);
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

function closeImportDialog() {
    const overlay = document.getElementById('importDialogOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function importData(backup, mode) {
    try {
        if (mode === 'merge') {
            mergeBackupData(backup);
        } else if (mode === 'replace') {
            replaceAllData(backup);
        }
        
        // Show success message
        showNotification(`✅ Imported ${backup.quizzes.length} quizzes successfully`);
        
        // Refresh the dashboard
        setTimeout(() => {
            loadQuizzes();
        }, 500);
    } catch (error) {
        console.error('Import error:', error);
        showNotification('❌ Import failed. Please try again.');
    }
}

function mergeBackupData(backup) {
    // Get existing quizzes
    const existingData = JSON.parse(localStorage.getItem('quizzes_data') || '[]');
    const existingIds = new Set(existingData.map(q => q.id));
    
    // Add new quizzes from backup (skip duplicates)
    const quizzesToAdd = backup.quizzes.filter(q => !existingIds.has(q.id));
    const mergedQuizzes = [...existingData, ...quizzesToAdd];
    
    // Save merged data
    localStorage.setItem('quizzes_data', JSON.stringify(mergedQuizzes));
    
    // Merge review data if it exists
    if (backup.reviewData) {
        const existingReview = JSON.parse(localStorage.getItem('review_data') || '{"questions": {}, "settings": {}}');
        const mergedReview = {
            questions: { ...existingReview.questions, ...backup.reviewData.questions },
            settings: { ...existingReview.settings, ...backup.reviewData.settings }
        };
        localStorage.setItem('review_data', JSON.stringify(mergedReview));
    }
    
    // Merge reminders if they exist
    if (backup.reminders && Array.isArray(backup.reminders)) {
        const existingReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        const mergedReminders = [...existingReminders, ...backup.reminders];
        localStorage.setItem('reminders', JSON.stringify(mergedReminders));
    }
}

function replaceAllData(backup) {
    // Save quizzes
    localStorage.setItem('quizzes_data', JSON.stringify(backup.quizzes));
    
    // Replace review data if it exists
    if (backup.reviewData) {
        localStorage.setItem('review_data', JSON.stringify(backup.reviewData));
    }
    
    // Replace reminders if they exist
    if (backup.reminders && Array.isArray(backup.reminders)) {
        localStorage.setItem('reminders', JSON.stringify(backup.reminders));
    }
    
    // Optionally restore theme
    if (backup.theme) {
        localStorage.setItem('app-theme', backup.theme);
        // Apply theme if function exists
        if (typeof applyTheme === 'function') {
            applyTheme(backup.theme);
        }
    }
}
