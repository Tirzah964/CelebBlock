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
        el.style.color = "blur"; // Hide text by setting color to transparent
        el.style.backgroundColor = "black"; // Set background to black for visibility
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
