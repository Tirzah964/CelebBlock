let selectionMode = false;

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "enableSelectionMode") {
    selectionMode = true;
    document.body.style.cursor = "text"; // Change cursor to indicate selection mode
    console.log("Selection mode enabled in content script");
  }
});

// Event listener to capture clicked text in selection mode
document.addEventListener(
  "click",
  (event) => {
    if (selectionMode) {
      event.preventDefault(); // Prevent default actions, e.g., links opening

      const selectedText = event.target.textContent.trim();
      console.log("Text selected:", selectedText);
      if (selectedText) {
        // Add the selected text to storage
        browser.storage.local.get("blockList").then((data) => {
          console.log("",data.blockList);
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

// This works
// Function to hide or obscure elements containing blocked keywords
function applyBlockList(blockList) {
  blockList.forEach((keyword) => {
    const elements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, img, div"
    );

    elements.forEach((el) => {
      if (
        el.textContent &&
        el.textContent.toLowerCase().includes(keyword.toLowerCase())
      ) {
        el.style.color = "transparent"; // Hide text by setting color to transparent
        // el.style.backgroundColor = "black"; // Set background to black for visibility
        el.style.borderRadius = "4px"; // Optional, for a cleaner look
      }

      // If the element is an image with a matching alt attribute
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
