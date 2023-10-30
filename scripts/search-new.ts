/**
 * @file Long press on the search button to open in a new window.
 */

const LONG_PRESS_TIME = 500;

addEventListener("pointerdown", pointerDownListener);

function pointerDownListener(event: PointerEvent) {
	const pointedSearchButton = ((
		event.target instanceof HTMLButtonElement &&
		event.target.getAttribute("type") === "submit") && (
			event.target.getAttribute("aria-label") === "search" ||
			event.target.getAttribute("data-test") === "@web/SearchButtonOverlayMobile")
	);

	if (pointedSearchButton) {
		const searchButtonEl = event.target as HTMLElement;
		const inputEl = searchButtonEl.closest(`form[action="/s"]`)?.querySelector("input");

		if (!inputEl) {
			return;
		}

		const pointerDownTime = Date.now();

		let longPressTimeout = setTimeout(onLongPressTimeout, LONG_PRESS_TIME);

		searchButtonEl.addEventListener("pointerup", onPointerUp, { once: true });
		searchButtonEl.addEventListener("pointerout", onPointerOut, { once: true });

		searchButtonEl.setAttribute("data-turtlemay-searchNewWindowLongPressable", "");

		function onLongPressTimeout() {
			searchButtonEl.setAttribute("data-turtlemay-searchNewWindowLongPressed", "");
		}

		function onPointerUp(event: PointerEvent) {
			clearTimeout(longPressTimeout);

			searchButtonEl.removeAttribute("data-turtlemay-searchNewWindowLongPressed");

			if (event.target === searchButtonEl && inputEl) {
				if (Date.now() - pointerDownTime > LONG_PRESS_TIME) {
					const s = encodeURIComponent(inputEl.value);
					window.open(`https://www.target.com/s?searchTerm=${s}`, "_blank");
				}
			}
		}

		function onPointerOut(event: PointerEvent) {
			if (event.target === searchButtonEl) {
				clearTimeout(longPressTimeout);

				searchButtonEl.removeAttribute("data-turtlemay-searchNewWindowLongPressed");
			}
		}
	}
}
