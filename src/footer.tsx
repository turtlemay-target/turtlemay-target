/**
 * @file Add our info to the site footer.
 */

import * as React from "react";
import { createRoot } from "react-dom/client";
import packageJson from "../package.json";
import manifestJson from "../manifest.json";

const footerAdjacentElemSelector = (
	'div[data-test="@web/component-footer/SubFooter"] ' +
	'a[data-test="@web/component-footer/LegalLink"]:last-of-type'
);

const myEl = document.createElement("p");
myEl.className = "h-text-white h-padding-r-tight";

const reactRoot = createRoot(myEl);

render();

new MutationObserver((mutations, observer) => {
	if (!document.body.contains(myEl)) {
		render();
	}
}).observe(document.body, {
	childList: true,
	subtree: true,
});

async function render(adjacentElem = document.querySelector(footerAdjacentElemSelector)) {
	if (!adjacentElem) {
		return;
	}

	adjacentElem.insertAdjacentElement("afterend", myEl);

	reactRoot.render(
		<span className="turtlemay__footerText">
			<a className="Link__StyledLink-sc-4b9qcv-0 ghasId" href={packageJson.repository} target="_blank">
				<span className="turtlemay__footerTextIcon">🧩</span>
				<span>&nbsp;</span>
				<span>{manifestJson.name}</span>
			</a>
			<span>&nbsp;</span>
			<span className="turtlemay__footerTextVersion">{manifestJson.version}</span>
		</span>
	);
}
