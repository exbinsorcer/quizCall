// ============================================================
// NUTRITION MODULE
// Handles daily intake tracking (calories, protein, carbs)
// ============================================================

// STORAGE FUNCTIONS
function getAllIntakeData() {
    const data = localStorage.getItem('nutrition_data');
    return data ? JSON.parse(data) : {};
}

function saveIntakeData(intakeData) {
    const allData = getAllIntakeData();
    const date = intakeData.date || new Date().toISOString().split('T')[0];
    allData[date] = intakeData;
    localStorage.setItem('nutrition_data', JSON.stringify(allData));
    return allData[date];
}

function getIntakeByDate(date) {
    const allData = getAllIntakeData();
    return allData[date] || null;
}

function deleteIntakeByDate(date) {
    const allData = getAllIntakeData();
    delete allData[date];
    localStorage.setItem('nutrition_data', JSON.stringify(allData));
}

// INITIALIZE DAILY INTAKE PAGE
function initDailyIntake() {
    // Set date input to today
    const dateInput = document.getElementById('intakeDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Load data for today if exists
    loadIntakeDataForDate(today);
    
    // Add event listener to update data when date changes
    dateInput.addEventListener('change', function() {
        loadIntakeDataForDate(this.value);
    });
}

function loadIntakeDataForDate(date) {
    const intake = getIntakeByDate(date);
    
    if (intake) {
        document.getElementById('caloriesInput').value = intake.calories || '';
        document.getElementById('proteinInput').value = intake.protein || '';
        document.getElementById('carbsInput').value = intake.carbs || '';
    } else {
        document.getElementById('caloriesInput').value = '';
        document.getElementById('proteinInput').value = '';
        document.getElementById('carbsInput').value = '';
    }
}

function saveIntakeEntry() {
    const date = document.getElementById('intakeDate').value;
    const calories = parseInt(document.getElementById('caloriesInput').value) || 0;
    const protein = parseInt(document.getElementById('proteinInput').value) || 0;
    const carbs = parseInt(document.getElementById('carbsInput').value) || 0;
    
    if (!date) {
        showNotification('❌ Please select a date');
        return;
    }
    
    const intakeData = {
        date: date,
        calories: calories,
        protein: protein,
        carbs: carbs,
        savedTime: new Date().toLocaleTimeString()
    };
    
    saveIntakeData(intakeData);
    showNotification('✅ Entry saved successfully!');
}
