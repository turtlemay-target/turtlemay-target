export function waitForElement(selector: string): Promise<Element> {
	return new Promise((resolve, reject) => {
		const elem = document.querySelector(selector);
		if (elem) {
			resolve(elem);
			return;
		}
		new MutationObserver((mutationRecords, observer) => {
			for (const v of document.querySelectorAll(selector)) {
				resolve(v);
				observer.disconnect();
				break;
			}
		}).observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	});
}
