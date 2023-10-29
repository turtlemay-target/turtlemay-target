/**
 * @file Render barcode on product pages.
 */

import * as React from "react";
import JsBarcode from "jsbarcode";
import { Root, createRoot } from "react-dom/client";

let rootEl: HTMLElement | undefined;
let reactRoot: Root | undefined;

if (isProductPage())
	initBarcodeWidget();

void new MutationObserver(update)
	.observe(document.body, { childList: true, subtree: true });

function update() {
	if (isProductPage())
		initBarcodeWidget();
}

function initBarcodeWidget() {
	if (!rootEl) {
		rootEl = document.createElement("div");
		rootEl.className = "turtlemay__barcodeWidgetRoot";
	}
	if (!reactRoot) {
		reactRoot = createRoot(rootEl);
		reactRoot.render(React.createElement(BarcodeWidget));
	}
	if (!document.body.contains(rootEl)) {
		const adjacentEl = document.querySelector(`[data-test="product-title"], h1`);
		adjacentEl?.insertAdjacentElement("afterend", rootEl);
	}
}

function BarcodeWidget() {
	const [itemInfo, setItemInfo] = React.useState(extractItemInfo(document.body.textContent));
	const [activeItemInfoProp, setActiveItemInfoProp] = React.useState("upc");
	const prevLocation = React.useRef(location.href);

	React.useEffect(initObserver, []);

	if (itemInfo) {
		return (
			<div className="turtlemay__barcodeWidget">
				<div className="turtlemay__barcodeWidgetTabs">
					<BarcodeTab propName="upc" />
					<BarcodeTab propName="dpci" />
					<BarcodeTab propName="tcin" />
				</div>
				<div className="turtlemay__barcodeWidgetBarcodeContainer">
					<BarcodeCanvas className="turtlemay__barcodeWidgetCanvas turtlemay__enterAnimation" itemInfo={{ [activeItemInfoProp]: itemInfo[activeItemInfoProp] }} />
				</div>
			</div>
		);
	}

	return null;

	function BarcodeTab(o: { propName: string }) {
		if (!itemInfo?.[o.propName]) {
			return null;
		} else return (
			<a data-turtlemay-active={activeItemInfoProp === o.propName || null} onClick={() => setActiveItemInfoProp(o.propName)}>
				{o.propName.toUpperCase()}
			</a>
		);
	}

	function initObserver() {
		const observer = new MutationObserver((mutations) => {
			// Detect changed location.
			if (location.href !== prevLocation.current) {
				prevLocation.current = location.href;
				setItemInfo(extractItemInfo(document.body.textContent));
			}

			expandSpecifications();

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
}

function BarcodeCanvas(props: { className?: string; itemInfo: IItemInfo | null }) {
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
			JsBarcode(elemRef.current, value, {
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
		className: props.className,
		key: props.itemInfo?.upc ?? props.itemInfo?.dpci ?? props.itemInfo?.tcin,
		ref: elemRef,
		onClick: scrollToItemInfo,
		style: { cursor: "pointer" },
	});
}

function isProductPage() {
	return Boolean(
		location.pathname.startsWith("/p") ||
		document.querySelector(`meta[content="product"]`)
	);
}

/**
 * Expand the "Specifications" heading containing the barcode information we need.
 */
function expandSpecifications() {
	const expandableElems = document.querySelectorAll<HTMLElement>("[aria-expanded='false'] h3");
	const clickEl = Array.from(expandableElems).find(v => v.textContent === "Specifications");
	clickEl?.click();
}

/**
 * Scroll to the current barcode information if present.
 */
function scrollToItemInfo() {
	const elems = document.querySelectorAll<HTMLElement>("[data-test='item-details-specifications'] b");

	// We will play an animation to draw attention to these.
	const highlightElems = Array.from(elems).filter(v => {
		if (v.textContent === "UPC") return true;
		if (v.textContent === "TCIN") return true;
		if (v.textContent?.includes("DPCI")) return true;
		return false;
	});

	const scrollToEl = highlightElems[0];
	scrollToEl?.scrollIntoView({ block: "center" });

	for (const el of highlightElems) {
		// Apply CSS animation.
		el.classList.add("turtlemay__attentionTextAnimation");

		// CSS animation only works on block elements.
		if (el.style.display === "inline")
			el.style.display = "inline-block";

		// Reset animation.
		el.style.animation = "none";
		el.offsetWidth;
		el.style.animation = "";
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
	return str?.match(/TCIN:\ (\d+)/)?.[1] || null;
}
