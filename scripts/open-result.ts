/**
 * @file Use number keys to select search result.
 */

addEventListener("keydown", (event: KeyboardEvent) => {
	const numberTest = /^[0-9]$/i;

	const locationCheck = (
		location.search.startsWith("?searchTerm=") ||
		location.pathname.startsWith("/c/") ||
		location.pathname.startsWith("/pl/")
	);

	if (locationCheck && numberTest.test(event.key)) {
		const elems = document.querySelectorAll<HTMLAnchorElement>('div[class*="StyledCol"]:not(:has(p[data-test="sponsoredText"])) div[class^="ProductCardImage__Content"] a');

		const n = Number(event.key);
		const i = n === 0 ? 9 : n - 1;

		const clickEl = elems?.[i] as HTMLAnchorElement | undefined;

		// Hold ctrl to open in new window.
		if (event.ctrlKey && clickEl?.href) {
			window.open(clickEl.href, "_blank");
		} else {
			clickEl?.click();
		}
	}
});
