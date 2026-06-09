/* ============================================
   BAYARAS PISO WIFI PORTAL - COMPLETE JAVASCRIPT
   ============================================ */

// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

const STORAGE_KEY = 'bayaras_wifi_data';

const defaultUserData = {
    credits: 50.00,
    remainingTime: 0,
    isConnected: true,
    isPaused: false,
    ip: '192.168.1.1',
    mac: '00:00:00:00:00:00',
    lastUpdated: new Date().toISOString()
};

function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUserData));
    }
    updateAllDisplays();
}

function getUserData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultUserData;
}

function saveUserData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateAllDisplays();
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateAllDisplays() {
    const userData = getUserData();
    
    // Update credits
    document.getElementById('user-credits').textContent = '₱' + userData.credits.toFixed(2);
    document.getElementById('modal-credits').textContent = '₱' + userData.credits.toFixed(2);
    
    // Update IP and MAC
    document.getElementById('user-ip').textContent = userData.ip;
    document.getElementById('user-mac').textContent = userData.mac;
    
    // Update status
    updateConnectionStatus(userData);
    
    // Update time display
    displayTime();
}

function updateConnectionStatus(userData) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('connection-status');
    const connectionInfo = document.getElementById('connection-info');
    
    if (userData.isPaused) {
        statusDot.style.color = '#ff4444';
        statusText.textContent = '⚠️ PAUSED';
        connectionInfo.textContent = 'Connection Paused';
        statusDot.style.animation = 'none';
    } else if (userData.isConnected && userData.remainingTime > 0) {
        statusDot.style.color = '#00ff00';
        statusText.textContent = '✓ CONNECTED';
        connectionInfo.textContent = 'Active Connection';
        statusDot.style.animation = 'pulse 1.5s infinite';
    } else {
        statusDot.style.color = '#ffaa00';
        statusText.textContent = '⚠️ NO TIME LEFT';
        connectionInfo.textContent = 'No Time Available';
        statusDot.style.animation = 'none';
    }
}

// ============================================
// TIMER FUNCTIONS
// ============================================

let timerInterval = null;

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        const userData = getUserData();
        
        if (!userData.isPaused && userData.remainingTime > 0) {
            userData.remainingTime--;
            saveUserData(userData);
        } else if (userData.remainingTime <= 0 && !userData.isPaused) {
            userData.isConnected = false;
            saveUserData(userData);
        }
    }, 1000);
}

function displayTime() {
    const userData = getUserData();
    const seconds = userData.remainingTime;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('remaining-time').textContent = timeString;
}

// ============================================
// COIN SOUND FUNCTION
// ============================================

function playAudio(type = 'coin') {
    try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (type === 'coin') {
            // Coin drop sound effect
            const now = audioContext.currentTime;
            
            // First note
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 800;
            osc1.type = 'sine';
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc1.start(now);
            osc1.stop(now + 0.2);
            
            // Second note
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1200;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.3, now + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc2.start(now + 0.1);
            osc2.stop(now + 0.3);
        } else if (type === 'success') {
            // Success beep
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = 1000;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.15);
        }
    } catch (e) {
        console.log('Audio not available:', e);
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-overlay-backdrop');
    
    if (modal) {
        modal.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-overlay-backdrop');
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    const allModals = document.querySelectorAll('.modal.active');
    if (allModals.length === 0) {
        backdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    const backdrop = document.getElementById('modal-overlay-backdrop');
    
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    backdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// CREDITS FUNCTIONS
// ============================================

function addCredits(amount) {
    const userData = getUserData();
    userData.credits += amount;
    saveUserData(userData);
    
    playAudio('coin');
    showNotification(`✓ Added ₱${amount}.00 to your account!`, 'success');
    console.log(`Added ₱${amount}.00. New balance: ₱${userData.credits.toFixed(2)}`);
}

function addCustomCredits() {
    const input = document.getElementById('custom-amount-input');
    const amount = parseFloat(input.value);
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('✗ Please enter a valid amount', 'error');
        return;
    }
    
    if (amount > 500) {
        showNotification('✗ Maximum amount is ₱500', 'error');
        return;
    }
    
    addCredits(amount);
    input.value = '';
    
    setTimeout(() => {
        closeModal('insert-money-modal');
    }, 1000);
}

// ============================================
// WIFI RATES / BUY PLAN FUNCTIONS
// ============================================

function buyPlan(cost, minutes) {
    const userData = getUserData();
    
    if (userData.credits < cost) {
        showNotification('✗ Insufficient credits! Please add more money.', 'error');
        return;
    }
    
    // Deduct credits
    userData.credits -= cost;
    
    // Add time
    userData.remainingTime += (minutes * 60);
    userData.isConnected = true;
    userData.isPaused = false;
    
    saveUserData(userData);
    
    playAudio('success');
    showNotification(`✓ Purchased ${minutes} minutes for ₱${cost}!`, 'success');
    console.log(`Plan purchased: ${minutes} min for ₱${cost}. New balance: ₱${userData.credits.toFixed(2)}`);
    
    setTimeout(() => {
        closeModal('wifi-rates-modal');
    }, 1500);
}

// ============================================
// PAUSE TIME FUNCTIONS
// ============================================

function confirmPause() {
    const userData = getUserData();
    userData.isPaused = !userData.isPaused;
    saveUserData(userData);
    
    const pauseText = userData.isPaused ? '✓ Connection paused!' : '✓ Connection resumed!';
    showNotification(pauseText, 'success');
    playAudio('success');
    
    closeModal('pause-confirmation-modal');
    console.log('Pause status:', userData.isPaused);
}

// ============================================
// CHATBOX FUNCTIONS
// ============================================

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botResponses = [
            'Thank you for contacting BAYARAS PISO WIFI Support!',
            'We are here to help you. What is your concern?',
            'For technical issues, please restart your connection.',
            'Your connection is stable and running smoothly.',
            'Have a great day! Enjoy your internet connection!',
            'Contact us anytime for assistance.',
            'Your feedback is important to us!',
            'Is there anything else I can help you with?',
            'Thank you for using BAYARAS PISO WIFI!'
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        addChatMessage(randomResponse, 'bot');
        playAudio('success');
    }, 500);
}

function addChatMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? 'YOU' : 'BOT';
    
    const messageParagraph = document.createElement('div');
    messageParagraph.className = 'message-text';
    messageParagraph.textContent = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageParagraph);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ============================================
// BUY LOAD FUNCTIONS
// ============================================

let selectedLoadAmount = 0;
let selectedLoadName = '';

function selectLoadPackage(amount, name) {
    selectedLoadAmount = amount;
    selectedLoadName = name;
    
    const buttons = document.querySelectorAll('.package-btn');
    buttons.forEach(btn => btn.style.opacity = '0.5');
    event.target.closest('.package-btn').style.opacity = '1';
    
    showNotification(`✓ ${name} selected`, 'success');
}

function buyLoad() {
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const userData = getUserData();
    
    if (!phoneNumber || phoneNumber.length < 11) {
        showNotification('✗ Please enter a valid phone number', 'error');
        return;
    }
    
    if (selectedLoadAmount === 0) {
        showNotification('✗ Please select a load package', 'error');
        return;
    }
    
    if (userData.credits < selectedLoadAmount) {
        showNotification('✗ Insufficient credits for this transaction', 'error');
        return;
    }
    
    // Deduct credits
    userData.credits -= selectedLoadAmount;
    saveUserData(userData);
    
    playAudio('success');
    showNotification(`✓ Load ${selectedLoadName} sent to ${phoneNumber}!`, 'success');
    console.log(`Load purchased: ${selectedLoadName} (₱${selectedLoadAmount}) for ${phoneNumber}`);
    
    // Reset form
    document.getElementById('phone-number').value = '';
    selectedLoadAmount = 0;
    selectedLoadName = '';
    
    setTimeout(() => {
        closeModal('buyload-modal');
    }, 1500);
}

// ============================================
// CHECK BALANCE FUNCTIONS
// ============================================

function checkBalance() {
    const phoneNumber = document.getElementById('balance-phone').value.trim();
    
    if (!phoneNumber || phoneNumber.length < 11) {
        showNotification('✗ Please enter a valid phone number', 'error');
        return;
    }
    
    playAudio('success');
    showNotification('✓ Balance inquiry sent...', 'success');
    
    // Simulate balance check (in real system, this would call backend API)
    setTimeout(() => {
        const mockBalance = (Math.random() * 500 + 50).toFixed(2);
        document.getElementById('balance-amount').textContent = '₱' + mockBalance;
        document.getElementById('balance-result').style.display = 'block';
        console.log(`Balance for ${phoneNumber}: ₱${mockBalance}`);
    }, 1000);
}

// ============================================
// VOUCHER FUNCTION
// ============================================

function submitVoucher() {
    const voucherCode = document.getElementById('voucher-code').value.trim();
    
    if (!voucherCode) {
        showNotification('✗ Please enter a voucher code', 'error');
        return;
    }
    
    const userData = getUserData();
    
    // Mock voucher validation (in real system, validate against backend)
    const voucherValue = Math.random() > 0.5 ? 30 : 60; // Random voucher worth
    
    // Add time based on voucher
    userData.remainingTime += (voucherValue * 60);
    userData.isConnected = true;
    saveUserData(userData);
    
    playAudio('success');
    showNotification(`✓ Voucher redeemed! +${voucherValue} minutes added!`, 'success');
    document.getElementById('voucher-code').value = '';
    console.log(`Voucher ${voucherCode} redeemed: +${voucherValue} minutes`);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'success') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 68, 68, 0.9)'};
        color: ${type === 'success' ? '#000' : '#fff'};
        border-radius: 8px;
        border: 2px solid ${type === 'success' ? '#00ff00' : '#ff4444'};
        font-weight: bold;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 0 20px ${type === 'success' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 68, 68, 0.5)'};
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('BAYARAS PISO WIFI Portal Loaded');
    
    // Initialize
    initializeStorage();
    startTimer();
    
    // Insert Money Button
    const insertCoinBtn = document.getElementById('insert_coin_button');
    if (insertCoinBtn) {
        insertCoinBtn.addEventListener('click', () => {
            openModal('insert-money-modal');
        });
    }
    
    // Pause Time Button
    const pauseTimeBtn = document.getElementById('pfunc');
    if (pauseTimeBtn) {
        pauseTimeBtn.addEventListener('click', () => {
            openModal('pause-confirmation-modal');
        });
    }
    
    // WiFi Rates Button
    const wifiRatesBtn = document.getElementById('wifi_rates_button');
    if (wifiRatesBtn) {
        wifiRatesBtn.addEventListener('click', () => {
            openModal('wifi-rates-modal');
        });
    }
    
    // Chatbox Button
    const chatboxBtn = document.getElementById('chatbox_button');
    if (chatboxBtn) {
        chatboxBtn.addEventListener('click', () => {
            openModal('chatbox-modal');
        });
    }
    
    // Buy Load Button
    const buyloadBtn = document.getElementById('buyload_button');
    if (buyloadBtn) {
        buyloadBtn.addEventListener('click', () => {
            document.querySelectorAll('.package-btn').forEach(btn => btn.style.opacity = '0.5');
            selectedLoadAmount = 0;
            openModal('buyload-modal');
        });
    }
    
    // Check Balance Button
    const checkbalanceBtn = document.getElementById('checkbalance_button');
    if (checkbalanceBtn) {
        checkbalanceBtn.addEventListener('click', () => {
            document.getElementById('balance-result').style.display = 'none';
            openModal('checkbalance-modal');
        });
    }
    
    // Submit Voucher
    const submitVoucherBtn = document.getElementById('submit-voucher');
    if (submitVoucherBtn) {
        submitVoucherBtn.addEventListener('click', submitVoucher);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
    
    // Chat input - Enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
    
    // Custom amount input - Enter key
    const customInput = document.getElementById('custom-amount-input');
    if (customInput) {
        customInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCustomCredits();
        });
    }
    
    // Phone number inputs - numbers only
    document.querySelectorAll('#phone-number, #balance-phone').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });
});

// Update displays every 1 second
setInterval(() => {
    updateAllDisplays();
}, 1000);

// CSS Animation definitions (inject into page)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✓ Portal script loaded successfully!');
