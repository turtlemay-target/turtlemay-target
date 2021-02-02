import { React, ReactDOM } from "../web_modules/es-react.js";
import { Application } from "../components/Application.js";

applyStyles("styles/style.css");

const elem = document.createElement("div");
elem.className = "turtlemay__root";
document.body.append(elem);

ReactDOM.render(React.createElement(Application), elem);

/**
 * @param {string} path
 */
async function applyStyles(path) {
	const url = chrome.extension.getURL(path);
	const res = await fetch(url);
	const text = await res.text();
	const elem = document.createElement("style");
	elem.append(text);
	document.head.appendChild(elem);
}
