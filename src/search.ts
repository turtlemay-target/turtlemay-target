/**
 * @file Select and clear input field.
 */

addEventListener("keydown", onKeyDown);

function onKeyDown(event: KeyboardEvent) {
	const RESET_KEY = "`";

	const elem: HTMLInputElement | null =
		document.querySelector("input#search");

	if (!elem) {
		return;
	}

	if (event.key === RESET_KEY) {
		event.preventDefault();
		elem.focus();
		elem.value = "";
	}

	// Focus input if not focused.
	if (document.activeElement?.nodeName !== "INPUT") {
		if (event.key === "Enter") {
			event.preventDefault();
			elem.focus();
			elem.value = "";
		}
		else if (event.key.match(/^([a-zA-Z])$/)?.[1] && !event.ctrlKey && !event.altKey) {
			elem.focus();
		}
	}
}
