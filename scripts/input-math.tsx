/**
 * @file Process and render math expressions from input fields.
 */

import * as React from "react";
import * as math from "mathjs";
import { Root, createRoot } from "react-dom/client";

let rootEl: HTMLElement | undefined;
let reactRoot: Root | undefined;

initMathWidget();

void new MutationObserver(initMathWidget)
	.observe(document.body, { childList: true, subtree: true });

function initMathWidget() {
	if (!rootEl) {
		rootEl = document.createElement("div");
		rootEl.id = "turtlemay__mathWidgetRoot";
	}
	if (!reactRoot) {
		reactRoot = createRoot(rootEl);
		reactRoot.render(React.createElement(MathWidget));
	}
	if (!document.body.contains(rootEl)) {
		document.body.append(rootEl);
	}
}

function MathWidget() {
	const [active, setActive] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const [mathResult, setMathResult] = React.useState("");
	const [renderValue, setRenderValue] = React.useState("");

	React.useEffect(mutationObserver, []);
	React.useEffect(focusInListener, [mathResult]);
	React.useEffect(focusOutListener, []);
	React.useEffect(changedInputValue, [inputValue]);
	React.useEffect(changedMathResult, [mathResult]);
	React.useEffect(updateParent, [active, inputValue]);

	return (
		<div className="turtlemay__mathWidgetContainer" tabIndex={-1} onClick={() => setActive(false)}>
			<div className="turtlemay__mathWidget" data-turtlemay-active={active}>
				<span className="turtlemay__mathWidgetEqualsSign">=</span>
				<span className="turtlemay__mathWidgetResult turtlemay__enterAnimation" key={renderValue}>
					{renderValue}
				</span>
			</div>
		</div>
	);

	function mutationObserver() {
		const observer = new MutationObserver(onMutation);
		observer.observe(document.body, { childList: true, subtree: true, attributes: true });
		return () => observer.disconnect();

		function onMutation(mutations: MutationRecord[]) {
			for (const v of mutations) {
				// Detect changed input value using our own attribute.
				const changedValue = (
					v.target.nodeName === "INPUT" &&
					v.target === document.activeElement &&
					v.attributeName === "data-turtlemay-value"
				);

				if (changedValue) {
					const inputEl = v.target as HTMLInputElement;
					setInputValue(inputEl.value || "");
					break;
				}
			}
		}
	}

	function focusInListener() {
		document.addEventListener("focusin", onFocusIn);
		return () => document.removeEventListener("focusin", onFocusIn);

		function onFocusIn(event: FocusEvent) {
			const inputEl = event.target instanceof HTMLInputElement ? event.target : null;

			if (!inputEl) {
				return;
			}

			updateParent();

			// Assign our input event callback to detect changed value.
			inputEl.addEventListener("input", onInputCallback);

			setInputValue(inputEl.value || "");

			if (mathResult) {
				setActive(true);
			}
		}
	}

	function focusOutListener() {
		document.addEventListener("focusout", onFocusOut);
		return () => document.removeEventListener("focusout", onFocusOut);

		function onFocusOut() {
			if (document.activeElement?.nodeName !== "INPUT") {
				setActive(false);
			}
		}
	}

	function updateParent() {
		const newParent = document.activeElement?.parentElement;
		if (rootEl && newParent && newParent !== rootEl.parentNode) {
			newParent.appendChild(rootEl);
		}
	}

	function changedInputValue() {
		setMathResult("");

		// Check if the string looks like a math expression.
		if (!inputValue.match(/\d+\D+\d+/)) {
			return;
		}

		let mathEval: unknown;
		try { mathEval = math.evaluate(inputValue); } catch (err) { }

		if (typeof mathEval === "string" || typeof mathEval === "number") {
			setMathResult(String(mathEval));
		}
	}

	function changedMathResult() {
		if (mathResult) {
			setActive(true);
			setRenderValue(mathResult);
		} else {
			setActive(false);
		}
		if (document.activeElement?.nodeName !== "INPUT") {
			setActive(false);
		}
	}

	/** Set value attribute on input elements to be used by mutation observer. */
	function onInputCallback(event: Event) {
		const inputEl = event.target as HTMLInputElement;
		inputEl.setAttribute("data-turtlemay-value", inputEl.value);
	}
}
