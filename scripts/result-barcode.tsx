/**
 * @file Render barcode for query on search result page.
 */

import * as React from "react";
import JsBarcode from "jsbarcode";
import { Root, createRoot } from "react-dom/client";

let rootEl: HTMLElement | undefined;
let reactRoot: Root | undefined;

if (isSearchResultPage())
	initUserBarcodeWidget();

void new MutationObserver(update)
	.observe(document.body, { childList: true, subtree: true });

function update() {
	if (isSearchResultPage())
		initUserBarcodeWidget();
}

function initUserBarcodeWidget() {
	if (!rootEl) {
		rootEl = document.createElement("div");
		rootEl.className = "turtlemay__userBarcodeWidgetRoot";
	}
	if (!reactRoot) {
		reactRoot = createRoot(rootEl);
		reactRoot.render(React.createElement(UserBarcodeWidget));
	}
	if (!document.body.contains(rootEl)) {
		const adjacentEl = document.querySelector(`[data-component-title="Product Grid"]`);
		adjacentEl?.insertAdjacentElement("beforebegin", rootEl);
	}
}

function UserBarcodeWidget() {
	const [query, setQuery] = React.useState(getURLQuery());
	const prevLocation = React.useRef(location.href);

	React.useEffect(mutationObserver, []);

	if (!query) {
		return null;
	}

	return (
		<div className="turtlemay__userBarcodeWidget">
			<div className="turtlemay__userBarcodeWidgetBarcodeContainer">
				<Barcode className="turtlemay__userBarcodeWidgetBarcode" value={query} />
			</div>
		</div>
	);

	function mutationObserver() {
		const observer = new MutationObserver(onMutation);
		observer.observe(document.body, { childList: true, subtree: true, attributes: true });
		return () => observer.disconnect();

		function onMutation(mutations: MutationRecord[]) {
			// Detect changed location.
			if (location.href !== prevLocation.current) {
				prevLocation.current = location.href;
				setQuery(getURLQuery());
			}
		}
	}

	function getURLQuery() {
		const params = new URLSearchParams(location.search);
		return params.get("searchTerm");
	}
}

function Barcode(props: { className?: string; value: string; }) {
	const elemRef = React.createRef<HTMLCanvasElement>();

	React.useEffect(update, [props.value]);

	return React.createElement("canvas", {
		className: `${props.className ?? ""} turtlemay__enterAnimation`,
		key: props.value,
		ref: elemRef,
	});

	function update() {
		let format = "code128";

		if (props.value.match(/(\d{12,13})/)?.[1]) {
			if (props.value.length === 12) format = "upc";
			if (props.value.length === 13) format = "ean13";
		}

		JsBarcode(elemRef.current as HTMLCanvasElement, props.value, {
			format: format,
			width: 2,
			height: 15,
			margin: 5,
			displayValue: true,
			fontSize: 15,
			background: "transparent",
		});
	}
}

function isSearchResultPage() {
	return Boolean(
		location.pathname.startsWith("/s") &&
		location.search
	);
}
