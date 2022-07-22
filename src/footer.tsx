/**
 * @file Add our info to the site footer.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import packageJson from "../package.json";
import manifestJson from "../manifest.json";

const FOOTER_SEL = (
	'div[data-test="@web/component-footer/SubFooter"] ' +
	'a[data-test="@web/component-footer/LegalLink"]:last-of-type'
);

const myEl = document.createElement("p");
myEl.className = "h-text-white h-padding-r-tight";

render(document.querySelector(FOOTER_SEL));

new MutationObserver((mutations, observer) => {
	if (!document.body.contains(myEl)) {
		render(document.querySelector(FOOTER_SEL));
	}
	observer.takeRecords();
}).observe(document.body, {
	childList: true,
	subtree: true,
});

async function render(elem?: Element | null) {
	if (!elem) {
		return;
	}

	elem.insertAdjacentElement("afterend", myEl);

	ReactDOM.render(
		<span className="turtlemay__footerText">
			<a className="Link__StyledLink-sc-4b9qcv-0 ghasId" href={packageJson.repository} target="_blank">
				{manifestJson.name}
			</a>
			&nbsp;{manifestJson.version}
		</span>,
		myEl
	);
}
