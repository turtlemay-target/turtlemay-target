/**
 * @file Add our info to the site footer.
 */

import React from "jsx-dom";
import packageJson from "../package.json";
import manifestJson from "../manifest.json";

initFooter();

void new MutationObserver(initFooter)
	.observe(document.body, { childList: true, subtree: true });

function initFooter() {
	if (document.getElementById("turtlemay__footerRoot")) {
		return;
	}

	// We will copy our styles from an existing link.
	const refEl = document.querySelector(
		`div[data-test*="@web/component-footer"] ` +
		`a[href*="terms-conditions"]`
	);

	if (!refEl) {
		return;
	}

	const adjacentEl = document.querySelector(
		`div[data-test*="@web/component-footer"] ` +
		`a[data-test="@web/component-footer/LegalLink"]:last-of-type`
	);

	adjacentEl?.insertAdjacentElement("afterend", (
		<span id="turtlemay__footerRoot">
			<a class={`turtlemay__footerText ${refEl.className}`} href={packageJson.repository} target="_blank">
				<span class="turtlemay__footerTextIcon">🧩</span>
				<span>{manifestJson.name}</span>
				<span class="turtlemay__footerTextVersion">{manifestJson.version}</span>
			</a>
		</span>
	));
}
