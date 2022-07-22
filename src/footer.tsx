/**
 * @file Add our info to the site footer.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import packageJson from "../package.json";
import manifestJson from "../manifest.json";
import { waitForElement } from "../lib/util";

waitForElement('div[data-test="@web/component-footer/SubFooter"] a[data-test="@web/component-footer/LegalLink"]:last-of-type').then(el => {
	const myEl = document.createElement("p");
	myEl.classList.add("h-text-white");
	myEl.classList.add("h-padding-r-tight");

	el.insertAdjacentElement("afterend", myEl);

	ReactDOM.render(
		<span className="turtlemay__footerText">
			<a className="Link__StyledLink-sc-4b9qcv-0 ghasId" href={packageJson.repository} target="_blank">
				{manifestJson.name}
			</a>
			&nbsp;{manifestJson.version}
		</span>,
		myEl
	);
});
