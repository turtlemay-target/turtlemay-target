/**
 * @file Long press on the search button to open in a new window.
 */

import { createLongPointerDownListener } from "../lib/long-press";

addEventListener("pointerdown", createLongPointerDownListener({
	longPressableAttr: "data-turtlemay-searchNewWindowLongPressable",
	longPressedAttr: "data-turtlemay-searchNewWindowLongPressed",

	longPressableEl: (elem) => ((
		elem instanceof HTMLButtonElement &&
		elem.getAttribute("type") === "submit") && (
			elem.getAttribute("aria-label") === "search" ||
			elem.getAttribute("data-test") === "@web/SearchButtonOverlayMobile")
	),

	onLongPressed: (elem) => {
		const inputEl = elem.closest(`form[action="/s"]`)?.querySelector("input");

		if (inputEl?.value) {
			const s = encodeURIComponent(inputEl.value);
			window.open(`https://www.target.com/s?searchTerm=${s}`, "_blank");
		} else {
			inputEl?.select();
		}

		// Prevent activating button.
		elem.setAttribute("disabled", "");
		requestAnimationFrame(() => elem.removeAttribute("disabled"));
	},
}));
