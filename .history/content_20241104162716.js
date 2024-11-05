// Get blocked keywords from storage and hide matching elements
function applyBlockList(blockList) {
    blockList.forEach((keyword) => {
      const elements = document.querySelectorAll('body *');
      elements.forEach((el) => {
        if (el.textContent.toLowerCase().includes(keyword.toLowerCase())) {
          el.style.display = 'none'; // Hide the element
        }
      });
    });
  }
  
  // Run the blocking function each time the script is injected
  browser.storage.local.get('blockList').then((data) => {
    const blockList = data.blockList || [];
    applyBlockList(blockList);
  });
  
  // Listen for updates to the block list and reapply it if needed
  browser.storage.onChanged.addListener((changes) => {
    if (changes.blockList) {
      applyBlockList(changes.blockList.newValue);
    }
  });
  