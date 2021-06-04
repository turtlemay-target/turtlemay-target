export function waitForElement(selector: string): Promise<Element> {
	return new Promise((resolve, reject) => {
		const elem = document.querySelector(selector);
		if (elem) {
			resolve(elem);
		}
		new MutationObserver((mutationRecords, observer) => {
			Array.from(document.querySelectorAll(selector)).forEach((v) => {
				resolve(v);
				observer.disconnect();
			});
		}).observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	});
}
