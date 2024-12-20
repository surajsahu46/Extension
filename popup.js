// Format seconds into readable time
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  
  return parts.join(' ');
}

// Update popup with tab times
async function updateTabList() {
  const tabList = document.getElementById('tabList');
  tabList.innerHTML = '';
  
  const { tabTimes } = await chrome.storage.local.get(['tabTimes']);
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    if (tabTimes && tabTimes[tab.id]) {
      const tabElement = document.createElement('div');
      tabElement.className = 'tab-item';
      
      const favicon = document.createElement('img');
      favicon.src = tab.favIconUrl || 'icons/timer.png';
      favicon.className = 'favicon';
      
      const title = document.createElement('span');
      title.textContent = tab.title;
      title.className = 'tab-title';
      
      const time = document.createElement('span');
      time.textContent = formatTime(tabTimes[tab.id]);
      time.className = 'tab-time';
      
      tabElement.appendChild(favicon);
      tabElement.appendChild(title);
      tabElement.appendChild(time);
      tabList.appendChild(tabElement);
    }
  }
}

// Clear all stored data
document.getElementById('clearData').addEventListener('click', () => {
  chrome.storage.local.set({ tabTimes: {} }, () => {
    updateTabList();
  });
});

// Update list when popup opens
document.addEventListener('DOMContentLoaded', updateTabList);

// Refresh data every second
setInterval(updateTabList, 1000);