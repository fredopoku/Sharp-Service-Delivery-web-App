document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('tracking-form');
    const trackingNumberInput = document.getElementById('tracking-number');
    const resultMessage = document.getElementById('result-message');
    const loadingSpinner = document.getElementById('loading-spinner');
    const historyList = document.getElementById('history-list');
    const trackingHistory = document.getElementById('tracking-history');
    const progressBar = document.getElementById('progress-bar');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const trackButton = document.getElementById('track-btn');
    const clearHistoryButton = document.getElementById('clear-history');
    
    const trackingDataMap = {
        'DHL001': [
            { location: "Kumasi, Ghana", status: "Package Received", date: "2025-03-14 10:00 AM", emoji: "📦", color: "#F39C12" },
            { location: "Accra, Ghana", status: "Sorting", date: "2025-03-17 02:30 PM", emoji: "🔄", color: "#F1C40F" },
            { location: "Accra, Ghana", status: "Departed from Sorting Facility", date: "2025-03-17 08:00 AM", emoji: "🚚", color: "#E67E22" },
            { location: "London, UK", status: "Arrival at Customs", date: "2025-03-27 08:45 AM", emoji: "🛃", color: "#3498DB" },
        ]
    };
    
    function loadTrackingHistory() {
        const history = JSON.parse(localStorage.getItem('trackingHistory')) || [];
        historyList.innerHTML = '';
        history.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerText = item;
            historyList.appendChild(listItem);
        });
        if (history.length > 0) trackingHistory.classList.remove('hidden');
    }
    
    function saveToHistory(trackingNumber) {
        let history = JSON.parse(localStorage.getItem('trackingHistory')) || [];
        if (!history.includes(trackingNumber)) {
            history.push(trackingNumber);
            localStorage.setItem('trackingHistory', JSON.stringify(history));
        }
    }
    
    trackingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const trackingNumber = trackingNumberInput.value.trim().toUpperCase();
        if (!trackingNumber) return;
        
        resultMessage.innerHTML = '';
        historyList.innerHTML = '';
        loadingSpinner.classList.remove('hidden');
        trackingHistory.classList.add('hidden');
        progressBar.classList.add('hidden');
        trackButton.disabled = true;
        
        if (!trackingDataMap[trackingNumber]) {
            setTimeout(() => {
                loadingSpinner.classList.add('hidden');
                resultMessage.innerHTML = '<p class="error">Invalid tracking number. Please try again.</p>';
                trackButton.disabled = false;
            }, 1500);
            return;
        }
        
        setTimeout(() => {
            loadingSpinner.classList.add('hidden');
            const trackingData = trackingDataMap[trackingNumber];
            resultMessage.innerHTML = `<p>Tracking Number: ${trackingNumber}</p><p>Status: ${trackingData[trackingData.length - 1].status}</p>`;
            trackingHistory.classList.remove('hidden');
            progressBar.classList.remove('hidden');
            saveToHistory(trackingNumber);
            
            let progress = 0;
            trackingData.forEach((update, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span class="emoji" style="color:${update.color}">${update.emoji}</span> <strong>${update.location}</strong> - ${update.status} (${update.date})`;
                historyList.appendChild(listItem);
                
                progress = ((index + 1) / trackingData.length) * 100;
                progressBarFill.style.width = progress + '%';
            });
            trackButton.disabled = false;
        }, 1500);
    });
    
    clearHistoryButton.addEventListener('click', function() {
        localStorage.removeItem('trackingHistory');
        historyList.innerHTML = '';
        trackingHistory.classList.add('hidden');
    });
    
    loadTrackingHistory();
});
