document.getElementById('tracking-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const trackingNumber = document.getElementById('tracking-number').value.trim().toUpperCase();
    const resultMessage = document.getElementById('result-message');
    const loadingSpinner = document.getElementById('loading-spinner');
    const historyList = document.getElementById('history-list');
    const trackingHistory = document.getElementById('tracking-history');
    const progressBar = document.getElementById('progress-bar');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const trackButton = document.getElementById('track-btn');
    
    // Reset previous results
    resultMessage.innerHTML = '';
    historyList.innerHTML = '';
    loadingSpinner.classList.remove('hidden');
    trackingHistory.classList.add('hidden');
    progressBar.classList.add('hidden');
    trackButton.disabled = true;
    
    const trackingDataMap = {
        'DHL001': [
            { location: "Kumasi, Ghana", status: "Package Received", date: "2025-02-01 10:00 AM", emoji: "📦", color: "#F39C12" },
            { location: "Accra, Ghana", status: "Sorting", date: "2025-02-02 02:30 PM", emoji: "🔄", color: "#F1C40F" },
            { location: "Accra, Ghana", status: "Departed from Sorting Facility", date: "2025-02-03 08:00 AM", emoji: "🚚", color: "#E67E22" },
            { location: "London, UK", status: "Arrival at Customs", date: "2025-02-05 08:45 AM", emoji: "🛃", color: "#3498DB" },
            { location: "New York, USA", status: "Out for Delivery", date: "2025-02-07 03:15 PM", emoji: "📦", color: "#9B59B6" },
            { location: "San Francisco, USA", status: "Package Delivered", date: "2025-02-09 09:00 AM", emoji: "✅", color: "#2ECC71" }
        ]
    };
    
    if (!trackingDataMap[trackingNumber]) {
        loadingSpinner.classList.add('hidden');
        resultMessage.innerHTML = '<p class="error">Invalid tracking number. Please try again.</p>';
        trackButton.disabled = false;
        return;
    }
    
    setTimeout(function() {
        loadingSpinner.classList.add('hidden');
        const trackingData = trackingDataMap[trackingNumber];
        resultMessage.innerHTML = `<p>Tracking Number: ${trackingNumber}</p><p>Status: ${trackingData[trackingData.length - 1].status}</p>`;
        trackingHistory.classList.remove('hidden');
        progressBar.classList.remove('hidden');
        
        let progress = 0;
        trackingData.forEach((update, index) => {
            const listItem = document.createElement('li');
            const timeAgo = getTimeAgo(update.date);
            listItem.innerHTML = `<span class="emoji" style="color:${update.color}">${update.emoji}</span><strong>${timeAgo}</strong> - ${update.location} (${update.status})`;
            listItem.classList.add('history-item');
            historyList.appendChild(listItem);

            // Update progress bar
            progress = ((index + 1) / trackingData.length) * 100;
            progressBarFill.style.width = progress + '%';
        });
        
        trackButton.disabled = false;
    }, 1500);
});

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day(s) ago`;
    if (diffInHours > 0) return `${diffInHours} hour(s) ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute(s) ago`;
    return `${diffInSeconds} second(s) ago`;
}
