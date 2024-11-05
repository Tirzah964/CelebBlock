document.getElementById('blockButton').addEventListener('click', () => {
    const input = document.getElementById('blockInput').value.trim();
    if (input) {
      browser.storage.local.get('blockList').then((data) => {
        const blockList = data.blockList || [];
        blockList.push(input);
        browser.storage.local.set({ blockList });
        updateBlockListUI(blockList);
        document.getElementById('blockInput').value = '';
      });
    }
  });
  
  function updateBlockListUI(blockList) {
    const blockListUI = document.getElementById('blockList');
    blockListUI.innerHTML = '';
    blockList.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      blockListUI.appendChild(listItem);
    });
  }
  
  // Load the current block list on popup load
  browser.storage.local.get('blockList').then((data) => {
    updateBlockListUI(data.blockList || []);
  });
  