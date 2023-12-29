/**
 * @file Add a button to open a search page for copied text.
 */

import React from "jsx-dom";

initClipboardButton();

void new MutationObserver(initClipboardButton)
	.observe(document.body, { childList: true, subtree: true });

function initClipboardButton() {
	if (document.getElementById("turtlemay__clipboardButtonRoot")) {
		return;
	}

	// Only render when product search box is present.
	if (!document.querySelector(`form[action="/s"]`)) {
		return;
	}

	// We will copy styles from an existing element.
	const refEl = document.querySelector(`#headerPrimary [data-test="@web/CartLink"]`);

	if (!refEl) {
		return;
	}

	const adjacentEl = document.querySelector(
		`#headerPrimary [data-test="@web/AccountLinkMobile"],` +
		`#headerPrimary [data-test="@web/AccountLink"]`
	);

	adjacentEl?.insertAdjacentElement("beforebegin", (
		<a id="turtlemay__clipboardButtonRoot" class={`turtlemay__clipboardButton ${refEl.className}`} href="#" title="Search for the copied text" onClick={onClick}>
			<span class="turtlemay__clipboardButtonIcon">📋</span>
		</a>
	));
}

async function onClick() {
	const clipboardText = await navigator.clipboard.readText();

	if (clipboardText) {
		const s = encodeURIComponent(clipboardText);
		location.href = `https://www.target.com/s?searchTerm=${s}`;
	}
}
