/**
 * @file Use number keys to select search result.
 */

const numberTest = /^[0-9]$/i;

addEventListener("keydown", (event: KeyboardEvent) => {
	if (!location.search.startsWith("?searchTerm=")) {
		return;
	}

	if (numberTest.test(event.key)) {
		const elems = document.querySelectorAll('div[class^="ProductCardImage__Content"] a') as NodeListOf<HTMLAnchorElement>;
		const n = Number(event.key);
		const i = n === 0 ? 9 : n - 1;
		const clickEl: HTMLAnchorElement | undefined = elems[i];
		clickEl?.click();
	}
});
