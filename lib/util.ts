export function waitForElement(selector: string): Promise<Element> {
	return new Promise((resolve, reject) => {
		let elem = document.querySelector(selector);
		if (elem) {
			resolve(elem);
			return;
		}
		new MutationObserver((mutationRecords, observer) => {
			elem ??= document.querySelector(selector);
			if (elem) {
				resolve(elem);
				observer.disconnect();
			}
		}).observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	});
}
