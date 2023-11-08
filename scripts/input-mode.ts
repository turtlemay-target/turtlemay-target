/**
 * @file Toggle input mode between number and text.
 */

import { createLongPointerDownListener } from "../lib/long-press";

addEventListener("pointerdown", createLongPointerDownListener({
	longPressableClass: "turtlemay__inputButtonLongPressable",
	longPressedClass: "turtlemay__inputButtonLongPressable--pressed",

	longPressableEl: (elem) => (
		elem instanceof HTMLButtonElement && (
			elem.getAttribute("aria-label") === "search by voice" ||
			elem.getAttribute("data-test") === "@web/Search/Microphone")
	),

	onLongPressed: (elem) => {
		const inputEl = elem.closest(`form[action="/s"]`)?.querySelector("input");

		if (inputEl) {
			toggleInputMode(inputEl);
			inputEl.select();
		}

		// Prevent activating button.
		elem.setAttribute("disabled", "");
		requestAnimationFrame(() => elem.removeAttribute("disabled"));
	},
}));

function toggleInputMode(el: HTMLInputElement) {
	if (el.inputMode !== "numeric") {
		el.inputMode = "numeric";
	} else {
		el.inputMode = "text";
	}
}
