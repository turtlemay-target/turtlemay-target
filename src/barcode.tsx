/**
 * @file Render barcode on product pages.
 */

import * as React from "react";
import { createRoot } from "react-dom/client";
import { BarcodeWidget } from "../components/BarcodeWidget";

const barcodeWidgetRootElem = document.createElement("div");
barcodeWidgetRootElem.className = "turtlemay__barcodeWidgetRoot";

const reactRoot = createRoot(barcodeWidgetRootElem);
reactRoot.render(React.createElement(BarcodeApplication));

insertBarcodeApplication();

const observer = new MutationObserver((mutations) => {
	if (!document.body.contains(barcodeWidgetRootElem)) {
		insertBarcodeApplication();
	}
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});

async function insertBarcodeApplication() {
	const adjacentEl = document.querySelector(`[data-test="product-title"], h1`);
	adjacentEl?.insertAdjacentElement("afterend", barcodeWidgetRootElem);
}

function BarcodeApplication() {
	const [itemInfo, setItemInfo] = React.useState(extractItemInfo(document.body.textContent));
	const prevLocation = React.useRef(location.href);

	React.useEffect(initObserver, []);
	React.useEffect(update, [location.href]);

	return <BarcodeWidget itemInfo={itemInfo} />;

	function initObserver() {
		const observer = new MutationObserver((mutations) => {
			// Detect changed location.
			if (location.href !== prevLocation.current) {
				prevLocation.current = location.href;
				setItemInfo(extractItemInfo(document.body.textContent));
			}

			for (const mutation of mutations) {
				// Detect selected item variation.
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "aria-label" &&
					mutation.target instanceof HTMLElement &&
					mutation.target.getAttribute("aria-label")?.includes("pressed")
				) {
					setItemInfo(extractItemInfo(document.body.textContent));
					break;
				}

				// Detect changed product details.
				if (mutation.target instanceof HTMLElement) {
					const productDetailRootSelectors = [
						"#product-detail-tabs",
						"#tabContent-tab-Details",
						"#specAndDescript",
						`[data-test="detailsTab"]`,
						`[data-test="item-details-specifications"]`,
					];
					if (mutation.target.querySelector(productDetailRootSelectors.join(", "))) {
						setItemInfo(extractItemInfo(mutation.target.textContent));
						break;
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true,
		});

		return () => observer.disconnect();
	}

	function update() {
		setItemInfo(extractItemInfo(document.body.textContent));
	}
}

function extractItemInfo(str: string | null): IItemInfo | null {
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
