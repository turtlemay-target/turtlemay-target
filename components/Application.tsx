import * as React from "react";
import { AddonBar } from "./AddonBar";

export function Application() {
	const [itemInfo, setItemInfo] = React.useState<IItemInfo | null>(null);
	
	let searchInputElem: HTMLInputElement | null = null;

	React.useEffect(_initSearchInputElem, []);
	React.useEffect(_initItemInfo, []);
	React.useEffect(_initMutationObserver, []);
	React.useEffect(_initChromeChangedUrlListener, []);
	React.useEffect(_initFocusSearchInputKeyListener, []);

	if (itemInfo) {
		return <AddonBar itemInfo={itemInfo} />;
	} else {
		return null;
	}

	function _initSearchInputElem() {
		searchInputElem = document.querySelector("input#search");
	}

	function _initItemInfo() {
		setItemInfo(extractItemInfo(document.body.textContent));
	}

	function _initMutationObserver() {
		const observer = new MutationObserver((mutations) => {
			let foundItemInfo: IItemInfo = {};
			mutations.forEach((mutation) => {
				searchInputElem =
					searchInputElem ?? document.querySelector("input#search");
				mutation.addedNodes.forEach((addedNode) => {
					foundItemInfo.upc =
						foundItemInfo.upc || matchUPC(addedNode.textContent);
					foundItemInfo.dpci =
						foundItemInfo.dpci || matchDPCI(addedNode.textContent);
					foundItemInfo.tcin =
						foundItemInfo.tcin || matchTCIN(addedNode.textContent);
				});
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "aria-label" &&
					mutation.target instanceof HTMLElement &&
					mutation.target
						.getAttribute("aria-label")
						?.includes("checked")
				) {
					setItemInfo(extractItemInfo(document.body.textContent));
					return;
				}
			});
			if (foundItemInfo.upc || foundItemInfo.dpci || foundItemInfo.tcin) {
				setItemInfo(foundItemInfo);
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

	function _initChromeChangedUrlListener() {
		chrome.runtime.onMessage.addListener(_listener);
		return () => chrome.runtime.onMessage.removeListener(_listener);
		function _listener({ type }) {
			if (type === "CHANGED_URL")
				setItemInfo(extractItemInfo(document.body.textContent));
		}
	}

	function _initFocusSearchInputKeyListener() {
		addEventListener("keydown", _listener);
		return () => removeEventListener("keydown", _listener);
		function _listener(event: KeyboardEvent) {
			if (
				searchInputElem &&
				document.activeElement?.nodeName !== "INPUT" &&
				event.key.match(/^([a-zA-Z])$/)?.[1]
			) {
				searchInputElem.focus();
			}
		}
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
