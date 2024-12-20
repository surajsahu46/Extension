// Track active tabs and their time
let tabTimes = {};
let startTime = {};

// Initialize data from storage
chrome.storage.local.get(['tabTimes'], (result) => {
  if (result.tabTimes) {
    tabTimes = result.tabTimes;
  }
});

// Update time every second for active tab
setInterval(async () => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab && startTime[activeTab.id]) {
    const elapsed = Math.floor((Date.now() - startTime[activeTab.id]) / 1000);
    tabTimes[activeTab.id] = (tabTimes[activeTab.id] || 0) + elapsed;
    startTime[activeTab.id] = Date.now();
    
    // Save to storage
    chrome.storage.local.set({ tabTimes });
  }
}, 1000);

// Track tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  startTime[activeInfo.tabId] = Date.now();
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete startTime[tabId];
  delete tabTimes[tabId];
  chrome.storage.local.set({ tabTimes });
});