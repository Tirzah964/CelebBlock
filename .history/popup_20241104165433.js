// document.getElementById('blockButton').addEventListener('click', () => {
//     const input = document.getElementById('blockInput').value.trim();
//     if (input) {
//       browser.storage.local.get('blockList').then((data) => {
//         const blockList = data.blockList || [];
//         blockList.push(input);
//         browser.storage.local.set({ blockList });
//         updateBlockListUI(blockList);
//         document.getElementById('blockInput').value = '';
//       });
//     }
//   });
  


document.getElementById('blockButton').addEventListener('click', () => {
    const input = document.getElementById('blockInput').value.trim();
    if (input) {
      browser.storage.local.get('blockList').then((data) => {
        const blockList = data.blockList || [];
        blockList.push(input);
        
        // Send the updated block list to background.js
        browser.runtime.sendMessage({ type: "updateBlockList", blockList }).then((response) => {
          console.log(response.status);
          updateBlockListUI(blockList); // Update the UI with the new list
          document.getElementById('blockInput').value = ''; // Clear the input
        });
      });
    }
  });
  