/**
 * @file Select and clear input field.
 */

addEventListener("keydown", onKeyDown);

let inputEl: HTMLInputElement | null;

function onKeyDown(event: KeyboardEvent) {
	const RESET_KEY = "`";

	inputEl ??= document.querySelector("input#search");

	if (!inputEl) {
		return;
	}

	if (event.key === RESET_KEY) {
		event.preventDefault();
		inputEl.focus();
		inputEl.value = "";
	}

	// Focus input if not focused.
	if (document.activeElement?.nodeName !== "INPUT") {
		if (event.key === "Enter") {
			event.preventDefault();
			inputEl.focus();
			inputEl.value = "";
		}
		else if (event.key.match(/^([a-zA-Z])$/)?.[1] && !event.ctrlKey && !event.altKey) {
			inputEl.focus();
		}
	}
}
