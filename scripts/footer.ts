/**
 * @file Add our info to the site footer.
 */

import packageJson from "../package.json";
import manifestJson from "../manifest.json";

const elem = document.createElement("span");
elem.id = "turtlemay__footerRoot";

initFooter();

void new MutationObserver(initFooter)
	.observe(document.body, { childList: true, subtree: true });

async function initFooter() {
	if (document.body.contains(elem)) {
		return;
	}

	// We will copy our styles from an existing link.
	const refEl = document.querySelector(`[data-test*="@web/component-footer"] a[href*="terms-conditions"]`);

	if (!refEl) {
		return;
	}

	elem.innerHTML = `
		<a class="turtlemay__footerText ${refEl.className}" href="${packageJson.repository}" target="_blank">
			<span class="turtlemay__footerTextIcon">🧩</span>
			<span>${manifestJson.name}</span>
			<span class="turtlemay__footerTextVersion">${manifestJson.version}</span>
		</a>
	`;

	const adjacentElem = document.querySelector(
		'div[data-test="@web/component-footer/SubFooter"] ' +
		'a[data-test="@web/component-footer/LegalLink"]:last-of-type'
	);

	adjacentElem?.insertAdjacentElement("afterend", elem);
}
