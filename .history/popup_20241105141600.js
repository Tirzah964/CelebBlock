document.getElementById("blockButton").addEventListener("click", () => {
  const input = document.getElementById("blockInput").value.trim();
  if (input) {
    browser.storage.local.get("blockList").then((data) => {
      const blockList = data.blockList || [];
      blockList.push(input);

      // Send the updated block list to background.js
      browser.runtime
        .sendMessage({ type: "updateBlockList", blockList })
        .then((response) => {
          console.log(response.status);
          updateBlockListUI(blockList); // Update the UI with the new list
          document.getElementById("blockInput").value = ""; // Clear the input
        });
    });
  }
});

document
  .getElementById("selectWithCursorButton")
  .addEventListener("click", () => {
    // Send message to enable selection mode
    browser.runtime.sendMessage({ type: "enableSelectionMode" });
    window.close(); // Close popup after enabling selection mode
  });

function updateBlockListUI(blockList) {
  const blockListUI = document.getElementById("blockList");
  blockListUI.innerHTML = "";
  blockList.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;

    // Create a delete button for each list item
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.style.marginLeft = "2px";
    deleteButton.onclick = () => {
      deleteFromBlockList(index);
    };

    listItem.appendChild(deleteButton);
    blockListUI.appendChild(listItem);
  });
}

// Function to delete an item from the block list
function deleteFromBlockList(index) {
  browser.storage.local.get("blockList").then((data) => {
    const blockList = data.blockList || [];
    if (index >= 0 && index < blockList.length) {
      blockList.splice(index, 1); // Remove the item from the array

      // Update storage and the UI
      browser.storage.local.set({ blockList }).then(() => {
        browser.runtime.sendMessage({ type: "updateBlockList", blockList });
        updateBlockListUI(blockList);
      });
    }
  });
}

// Load the current block list on popup load
browser.storage.local.get("blockList").then((data) => {
  updateBlockListUI(data.blockList || []);
});
