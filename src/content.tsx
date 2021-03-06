import * as React from "react";
import * as ReactDOM from "react-dom";
import { BarcodeWidget } from "../components/BarcodeWidget";
import { waitForElement } from "../lib/util";

import "./search";
import "./remove-ads";

const barcodeWidgetRootElem = document.createElement("div");
barcodeWidgetRootElem.className = "turtlemay__barcodeWidgetRoot";

waitForElement("#product-details-tabs").then((el) => {
	render(processItemInfo(el.textContent));
});

const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (
			mutation.type === "attributes" &&
			mutation.attributeName === "aria-label" &&
			mutation.target instanceof HTMLElement &&
			mutation.target.getAttribute("aria-label")?.includes("checked")
		) {
			render(processItemInfo(document.body.textContent));
			return;
		}
		if (mutation.target instanceof HTMLElement) {
			if (mutation.target.querySelector("#product-details-tabs")) {
				render(processItemInfo(mutation.target.textContent));
				return;
			}
		}
	});
}).observe(document.body, {
	childList: true,
	subtree: true,
	attributes: true,
	characterData: true,
});

async function render(itemInfo: IItemInfo | null) {
	const v = await waitForElement(".l-container-fixed h1");
	v.insertAdjacentElement("afterend", barcodeWidgetRootElem);
	ReactDOM.render(
		<BarcodeWidget itemInfo={itemInfo} />,
		barcodeWidgetRootElem
	);
}

function processItemInfo(str: string | null): IItemInfo | null {
	const foundItemInfo: IItemInfo = {
		upc: matchUPC(str),
		dpci: matchDPCI(str),
		tcin: matchTCIN(str),
	};
	if (foundItemInfo.upc || foundItemInfo.dpci || foundItemInfo.tcin) {
		return foundItemInfo;
	} else {
		return null;
	}
}

function matchUPC(str: string | null): string | null {
	return str?.match(/UPC:\ (\d{12,13})/)?.[1] || null;
}

function matchDPCI(str: string | null): string | null {
	return str?.match(/\(?DPCI\)?:\ (\d+-\d+-\d+)/)?.[1] || null;
}

function matchTCIN(str: string | null): string | null {
	return str?.match(/TCIN:\ (\d{8})/)?.[1] || null;
}
