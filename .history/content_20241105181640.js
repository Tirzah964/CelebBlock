let selectionMode = false;

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "enableSelectionMode") {
    selectionMode = true;
    document.body.style.cursor = "text"; // Change cursor to indicate selection mode
  }
});

// Event listener to capture selected text in selection mode
document.addEventListener(
  "click",
  (event) => {
    if (selectionMode) {
      event.preventDefault(); // Prevent default actions, e.g., links opening

      // Get the exact selected text
      const selectedText = window.getSelection().toString().trim();

      if (selectedText) {
        // Add the selected text to storage
        browser.storage.local.get("blockList").then((data) => {
          const blockList = data.blockList || [];
          blockList.push(selectedText);
          browser.storage.local.set({ blockList });

          // Notify background.js to update the list across all scripts
          browser.runtime.sendMessage({ type: "updateBlockList", blockList });
        });

        // Disable selection mode and reset cursor
        selectionMode = false;
        document.body.style.cursor = "default";
        alert(`Added "${selectedText}" to the block list.`);

        // Notify background.js to disable selection mode
        browser.runtime.sendMessage({ type: "disableSelectionMode" });
      }
    }
  },
  true
);

// Function to hide or obscure elements containing blocked keywords
function applyBlockList(blockList) {
  blockList.forEach((keyword) => {
    const elements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, img, div, title, a"
    );

    elements.forEach((el) => {
      if (
        el.textContent &&
        el.textContent.toLowerCase().includes(keyword.toLowerCase())
      ) {
        el.style.color = "transparent"; // Hide text by setting color to transparent
        el.style.borderRadius = "4px"; // Optional, for a cleaner look
      }

      if (
        el.tagName === "IMG" &&
        el.alt &&
        el.alt.toLowerCase().includes(keyword.toLowerCase())
      ) {
        el.style.filter = "blur(10px)"; // Blur the image
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
