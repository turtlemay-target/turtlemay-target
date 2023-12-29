/**
 * @file Render a button to open our dashboard.
 */

import React from "jsx-dom";

initDashboardButton();

void new MutationObserver(initDashboardButton)
	.observe(document.body, { childList: true, subtree: true });

function initDashboardButton() {
	if (document.getElementById("turtlemay__dashboardButtonRoot")) {
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
		<a id="turtlemay__dashboardButtonRoot" class={`turtlemay__dashboardButton ${refEl.className}`} data-turtlemay-dashboard-opener title="Open Turtlemay's dashboard" href="#">
			<span class="turtlemay__dashboardButtonIcon">🐢</span>
		</a>
	));
}
