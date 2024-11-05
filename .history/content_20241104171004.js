
// Function to hide elements containing blocked keywords
function applyBlockList(blockList) {
  blockList.forEach((keyword) => {
    const elements = document.querySelectorAll("body *");
    elements.forEach((el) => {
      if (el.textContent.toLowerCase().includes(keyword.toLowerCase())) {
        el.style.display = "none"; // Hide the element
      }
    });
  });
}

// Load and apply the current block list on page load
browser.storage.local.get("blockList").then((data) => {
  const blockList = data.blockList || [];
  applyBlockList(blockList);
});

// Listen for updates to the block list from background.js
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "applyBlockList") {
    applyBlockList(message.blockList);
  }
});
