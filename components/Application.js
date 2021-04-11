import { React } from "../web_modules/es-react.js";
import { AddonBar } from "./AddonBar.js";

export function Application() {
	const [itemInfo, setItemInfo] = React.useState(null);

	/** @type {HTMLInputElement | null} */
	let searchInputElem = null;

	React.useEffect(_initExpandDetails, []);
	React.useEffect(_initSearchInputElem, []);
	React.useEffect(_initItemInfo, []);
	React.useEffect(_initMutationObserver, []);
	React.useEffect(_initChromeChangedUrlListener, []);
	React.useEffect(_initFocusSearchInputKeyListener, []);

	if (itemInfo) {
		return React.createElement(AddonBar, { itemInfo });
	} else {
		return null;
	}

	function _initExpandDetails() {
		const clickElem = document.querySelector(
			'[data-test="pdpBottomOfTheFoldContent"] button[data-test="toggleContentButton"]'
		);
		if (clickElem instanceof HTMLElement && clickElem?.textContent === "Show more")
			clickElem.click();
	}

	function _initSearchInputElem() {
		searchInputElem = document.querySelector("input#search");
	}

	function _initItemInfo() {
		setItemInfo(extractItemInfo(document.body.textContent));
	}

	function _initMutationObserver() {
		const observer = new MutationObserver((mutations) => {
			/** @type {IItemInfo} */
			let foundItemInfo = {};
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
			});
			if (foundItemInfo.upc || foundItemInfo.dpci || foundItemInfo.tcin) {
				setItemInfo(foundItemInfo);
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
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
		function _listener(event) {
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

/**
 * @param {string | null} str
 * @returns {string | null}
 */
function matchUPC(str) {
	return str?.match(/UPC:\ (\d{12,13})/)?.[1] || null;
}

/**
 * @param {string | null} str
 * @returns {string | null}
 */
function matchDPCI(str) {
	return str?.match(/\(?DPCI\)?:\ (\d+-\d+-\d+)/)?.[1] || null;
}

/**
 * @param {string | null} str
 * @returns {string | null}
 */
function matchTCIN(str) {
	return str?.match(/TCIN:\ (\d{8})/)?.[1] || null;
}

/**
 * @param {string | null} str
 * @returns {IItemInfo | null}
 */
function extractItemInfo(str) {
	/** @type {IItemInfo} */
	const foundItemInfo = {
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
