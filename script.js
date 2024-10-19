document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('web-view');
    const tabs = document.querySelector('.tabs');
    const newTabButton = document.getElementById('new-tab');
    const urlInput = document.getElementById('url-input');
    const goButton = document.getElementById('go-btn');
    const backButton = document.getElementById('back-btn');
    const forwardButton = document.getElementById('forward-btn');
    const historyModal = document.getElementById('history-modal');
    const historyList = document.getElementById('history-list');
    const closeHistoryButton = document.getElementById('close-history');

    let historyStack = [];
    let currentIndex = -1;

    // Load default URL for the first tab
    loadUrl('https://example.com');

    function loadUrl(url) {
        if (!url.startsWith('http')) {
            url = 'http://' + url; // Add http if missing
        }
        if (historyStack[currentIndex] !== url) {
            if (currentIndex < historyStack.length - 1) {
                historyStack = historyStack.slice(0, currentIndex + 1);
            }
            historyStack.push(url);
            currentIndex++;
        }
        iframe.src = url;
        urlInput.value = url; // Update URL input
        updateActiveTab(url);
        updateHistoryList(); // Update the history list when a new URL is loaded
    }

    function createTab(url) {
        const newTab = document.createElement('button');
        newTab.className = 'tab';
        newTab.innerText = url;
        newTab.dataset.url = url;

        newTab.addEventListener('click', () => {
            loadUrl(newTab.dataset.url);
        });

        tabs.insertBefore(newTab, newTabButton); // Insert before the "+" button
        loadUrl(url);
        newTab.click();
    }

    function updateHistoryList() {
        historyList.innerHTML = ''; // Clear existing entries
        historyStack.forEach((url, index) => {
            const historyItem = document.createElement('li');
            historyItem.innerText = url;
            historyItem.addEventListener('click', () => loadUrl(url));
            historyList.appendChild(historyItem);
        });
    }

    function updateActiveTab(url) {
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            activeTab.classList.remove('active');
        }
        const currentTab = [...tabs.children].find(tab => tab.dataset.url === url);
        if (currentTab) {
            currentTab.classList.add('active');
        }
    }

    // Add event listeners
    newTabButton.addEventListener('click', () => {
        const newTabUrl = prompt('Enter URL:', 'https://');
        if (newTabUrl) {
            createTab(newTabUrl);
        }
    });

    // Go button action
    goButton.addEventListener('click', () => {
        const url = urlInput.value || 'https://';
        loadUrl(url);
    });

    backButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            loadUrl(historyStack[currentIndex]);
        }
    });

    forwardButton.addEventListener('click', () => {
        if (currentIndex < historyStack.length - 1) {
            currentIndex++;
            loadUrl(historyStack[currentIndex]);
        }
    });

    // Open history modal with Alt + H
    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'h') {
            event.preventDefault();
            historyModal.style.display = 'flex';
            updateHistoryList(); // Populate the history list when opening the modal
        }

        // Open new tab with Alt + +
        if (event.altKey && event.key === '+' || event.key === '=') {
            event.preventDefault();
            const newTabUrl = prompt('Enter URL for new tab:', 'https://');
            if (newTabUrl) {
                createTab(newTabUrl);
            }
        }

        // Close the current tab with Ctrl + W
        if (event.ctrlKey && event.key === 'w') {
            event.preventDefault();
            alert('Close current tab functionality can be implemented.');
            // Implement logic to close the current tab if you choose to support tabs closing.
        }

        // Reload the current page with Ctrl + R
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            iframe.src = iframe.src; // Reload the current URL
        }

        // Open history modal with Alt + H
        if (event.altKey && event.key === 'h') {
            event.preventDefault();
            historyModal.style.display = 'flex';
            updateHistoryList(); // Populate the history list when opening the modal
        }
    });

    closeHistoryButton.addEventListener('click', () => {
        historyModal.style.display = 'none';
    });
});
