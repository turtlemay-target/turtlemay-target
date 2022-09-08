/**
 * @file Add our info to the site footer.
 */

import * as React from "jsx-dom";
import packageJson from "../package.json";
import manifestJson from "../manifest.json";

const elem = (
	<p className="turtlemay__footerText h-text-white h-padding-r-tight">
		<a className="Link__StyledLink-sc-4b9qcv-0 ghasId" href={packageJson.repository} target="_blank">
			<span className="turtlemay__footerTextIcon">🧩</span>
			<span>&nbsp;</span>
			<span>{manifestJson.name}</span>
		</a>
		<span>&nbsp;</span>
		<span className="turtlemay__footerTextVersion">{manifestJson.version}</span>
	</p>
);

insertFooterElem(elem);

new MutationObserver((mutations, observer) => {
	if (!document.body.contains(elem)) {
		insertFooterElem(elem);
	}
}).observe(document.body, {
	childList: true,
	subtree: true,
});

function insertFooterElem(elem: Element) {
	const adjacentElem = document.querySelector(
		'div[data-test="@web/component-footer/SubFooter"] ' +
		'a[data-test="@web/component-footer/LegalLink"]:last-of-type'
	);
	adjacentElem?.insertAdjacentElement("afterend", elem);
}
