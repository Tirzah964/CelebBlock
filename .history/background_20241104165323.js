// Listen for messages from the popup to update the block list
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateBlockList") {
    // Update the block list in storage
    browser.storage.local.set({ blockList: message.blockList }).then(() => {
      console.log("Block list updated:", message.blockList);
    });

    // Send a message to all open tabs to apply the new block list
    browser.tabs.query({}).then((tabs) => {
      for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, {
          type: "applyBlockList",
          blockList: message.blockList,
        });
      }
    });
    sendResponse({ status: "blockList updated" });
  }
});
