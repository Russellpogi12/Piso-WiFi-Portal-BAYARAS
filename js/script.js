/* ============================================
   BAYARAS PISO WIFI PORTAL - JAVASCRIPT
   ============================================ */

// DOM Elements
const insertCoinBtn = document.getElementById('insert_coin_button');
const pauseTimeBtn = document.getElementById('pfunc');
const wifiRatesBtn = document.querySelector('.wifi-rates-btn');
const chatboxBtn = document.querySelector('.chatbox-btn');

// ============================================
// Button Event Listeners
// ============================================

if (insertCoinBtn) {
    insertCoinBtn.addEventListener('click', function() {
        console.log('INSERT MONEY button clicked');
        handleInsertCoin();
    });
}

if (pauseTimeBtn) {
    pauseTimeBtn.addEventListener('click', function() {
        console.log('PAUSE TIME button clicked');
        handlePauseTime();
    });
}

if (wifiRatesBtn) {
    wifiRatesBtn.addEventListener('click', function() {
        console.log('WIFI RATES button clicked');
        handleWifiRates();
    });
}

if (chatboxBtn) {
    chatboxBtn.addEventListener('click', function() {
        console.log('CHATBOX button clicked');
        handleChatbox();
    });
}

// ============================================
// Button Functions (Placeholder Logic)
// ============================================

function handleInsertCoin() {
    // TODO: Add your insert coin logic here
    // Example: Open payment modal, process payment, etc.
    alert('Insert Money - Feature Coming Soon');
}

function handlePauseTime() {
    // TODO: Add pause time logic here
    // Example: Send request to backend to pause internet
    alert('Pause Time - Feature Coming Soon');
}

function handleWifiRates() {
    // TODO: Add WiFi rates display logic here
    // Example: Open modal showing WiFi plans and pricing
    alert('WiFi Rates - Feature Coming Soon');
}

function handleChatbox() {
    // TODO: Add chatbox logic here
    // Example: Open chat window with support
    alert('Chatbox - Feature Coming Soon');
}

// ============================================
// Add Button Click Animation
// ============================================

function addClickAnimation(button) {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
}

// Apply animation to all buttons
document.querySelectorAll('.btn').forEach(btn => {
    addClickAnimation(btn);
});

// ============================================
// Timer Update Function (Optional)
// ============================================

function updateTimer() {
    // TODO: Update timer display every second
    // This would typically fetch from your backend
    setInterval(() => {
        // Update timer value here
    }, 1000);
}

// ============================================
// Credits Update Function (Optional)
// ============================================

function updateCredits() {
    // TODO: Fetch and update credits from backend
    // Example: Fetch user remaining credit via API
    console.log('Credits updated');
}

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('BAYARAS PISO WIFI Portal Loaded');
    // Add initialization logic here
});
