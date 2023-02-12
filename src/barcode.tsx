/**
 * @file Render barcode on product pages.
 */

import * as React from "react";
import JsBarcode from "jsbarcode";
import { Root, createRoot } from "react-dom/client";

let barcodeAppRootElem: HTMLElement | undefined;
let reactRoot: Root | undefined;

if (isProductPage())
	initBarcodeApp();

void new MutationObserver(update)
	.observe(document.body, { childList: true, subtree: true });

function update() {
	if (isProductPage())
		initBarcodeApp();
}

function initBarcodeApp() {
	if (!barcodeAppRootElem) {
		barcodeAppRootElem = document.createElement("div");
		barcodeAppRootElem.className = "turtlemay__barcodeWidgetRoot";
	}
	if (!reactRoot) {
		reactRoot = createRoot(barcodeAppRootElem);
		reactRoot.render(React.createElement(BarcodeApp));
	}
	if (!document.body.contains(barcodeAppRootElem)) {
		const adjacentEl = document.querySelector(`[data-test="product-title"], h1`);
		adjacentEl?.insertAdjacentElement("afterend", barcodeAppRootElem);
	}
}

function BarcodeApp() {
	const [itemInfo, setItemInfo] = React.useState(extractItemInfo(document.body.textContent));
	const prevLocation = React.useRef(location.href);

	React.useEffect(initObserver, []);
	React.useEffect(update, [location.href]);

	if (itemInfo) {
		return (
			<div className="turtlemay__barcodeWidget">
				<Barcode itemInfo={itemInfo} />
			</div>
		);
	}

	return null;

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

function Barcode(props: { className?: string; itemInfo: IItemInfo | null }) {
	const elemRef = React.createRef<HTMLCanvasElement>();

	React.useEffect(update, [
		props.itemInfo?.upc,
		props.itemInfo?.dpci,
		props.itemInfo?.tcin,
	]);

	function update() {
		let format = "code128";
		let value: string | undefined;

		if (props.itemInfo?.upc) {
			if (props.itemInfo.upc.length === 12) format = "upc";
			if (props.itemInfo.upc.length === 13) format = "ean13";
			value = props.itemInfo.upc;
		} else if (props.itemInfo?.dpci) {
			value = props.itemInfo.dpci;
		} else if (props.itemInfo?.tcin) {
			value = props.itemInfo.tcin;
		}

		if (value) {
			JsBarcode(elemRef.current as HTMLCanvasElement, value, {
				format: format,
				width: 2,
				height: 20,
				margin: 5,
				displayValue: true,
				fontSize: 15,
				background: "transparent",
			});
		}
	}

	return React.createElement("canvas", {
		className: `${props.className ?? ""} turtlemay__enterAnimation`,
		key: props.itemInfo?.upc ?? props.itemInfo?.dpci ?? props.itemInfo?.tcin,
		ref: elemRef,
	});
}

function isProductPage() {
	return Boolean(
		location.pathname.startsWith("/p") ||
		document.querySelector(`meta[content="product"]`)
	);
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
	return str?.match(/TCIN:\ (\d+)/)?.[1] || null;
}
