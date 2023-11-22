/**
 * @file Render barcode for query on search result page.
 */

import * as React from "react";
import QRCode from "qrcode";
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
		rootEl.id = "turtlemay__userBarcodeWidgetRoot";
	}
	if (!reactRoot) {
		reactRoot = createRoot(rootEl);
		reactRoot.render(React.createElement(UserBarcodeWidget));
	}
	if (!document.body.contains(rootEl)) {
		const adjacentEl = document.querySelector(`#pageBodyContainer, main, [data-component-title="Product Grid"]`);
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
				<div className="turtlemay__userBarcodeWidgetQrResult">
					<QrcodeCanvas className="turtlemay__userBarcodeWidgetQrCanvas turtlemay__enterAnimation" value={query} />
					<div className="turtlemay__userBarcodeWidgetQrDetail">
						<div className="turtlemay__userBarcodeWidgetQrDetailHeader">QR generated for your search:</div>
						<div className="turtlemay__userBarcodeWidgetQrDetailValue">{query}</div>
					</div>
				</div>
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

function QrcodeCanvas(props: { className?: string; value: string; }) {
	const elemRef = React.createRef<HTMLCanvasElement>();

	React.useEffect(update, [props.value]);

	return React.createElement("canvas", {
		className: props.className,
		width: 0, height: 0,
		key: props.value,
		ref: elemRef,
	});

	function update() {
		QRCode.toCanvas(elemRef.current, props.value, {
			color: { dark: "#000", light: "#0000" },
			margin: 0,
			scale: 3,
		});
	}
}

function isSearchResultPage() {
	return Boolean(
		location.pathname.startsWith("/s") &&
		location.search
	);
}
