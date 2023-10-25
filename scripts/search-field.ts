/**
 * @file Select and clear input field.
 */

import { querySelectorFirst } from "../lib/dom";

const searchInputSelectors = [
	`input[data-test="@web/SearchInputOverlayMobile"]`,
	"input#search",
	"#headerPrimary input",
	"#searchForm input",
	"nav input",
	".search-input-form input",
	`input[type="search"]`,
];

addEventListener("keydown", onKeyDown);

function onKeyDown(event: KeyboardEvent) {
	const RESET_KEY = "`";

	if (event.key === RESET_KEY) {
		event.preventDefault();
		openMobileSearchModal();
		const inputEl = querySelectorFirst<HTMLInputElement>(document, searchInputSelectors);
		if (!inputEl) return;
		inputEl.focus();
		inputEl.value = "";
	}

	if (document.activeElement?.nodeName !== "INPUT") {
		if (event.key.match(/^([a-zA-Z])$/)?.[1] && !event.ctrlKey && !event.altKey) {
			openMobileSearchModal();
			const inputEl = querySelectorFirst<HTMLInputElement>(document, searchInputSelectors);
			if (!inputEl) return;
			inputEl.focus();
		}
	}
}

function openMobileSearchModal() {
	if (!document.body.classList.contains("ReactModal__Body--open")) {
		const clickEl = querySelectorFirst<HTMLElement>(document, [
			`input[data-test="@web/SearchInputMobile"]`,
			`input[readonly]`,
		]);
		clickEl?.click();
	}
}
