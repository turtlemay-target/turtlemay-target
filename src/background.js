chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		chrome.tabs.sendMessage(tabId, {
			type: "CHANGED_URL",
			url: changeInfo.url,
		});
	}
});
