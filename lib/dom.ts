/**
 * @file DOM helper functions.
 */

/** Check for elements in order and get the first one found. */
export function querySelectorFirst<T extends Element>(
	obj: Pick<T, "querySelector">,
	selectors: string[],
): T | null {
	for (const s of selectors) {
		const el = obj.querySelector<T>(s);
		if (el) {
			return el;
		}
	}
	return null;
}

export function waitForElement(selector: string): Promise<Element> {
	return new Promise((resolve, reject) => {
		let elem = document.querySelector(selector);
		if (elem) {
			resolve(elem);
			return;
		}
		void new MutationObserver((mutationRecords, observer) => {
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
