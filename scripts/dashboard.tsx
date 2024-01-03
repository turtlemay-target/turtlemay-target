import * as React from "react";
import QRCode from "qrcode";
import { Root, createRoot } from "react-dom/client";

const RESET_KEY = "`";
const QUERY_SEPARATOR = ";";
const INPUT_DELAY = 800;

let rootEl: HTMLElement | undefined;
let reactRoot: Root | undefined;

initDashboard();

void new MutationObserver(initDashboard)
	.observe(document.body, { childList: true, subtree: true });

function initDashboard() {
	if (!rootEl) {
		rootEl = document.createElement("div");
		rootEl.id = "turtlemay__dashRoot";
	}
	if (!reactRoot) {
		reactRoot = createRoot(rootEl);
		reactRoot.render(React.createElement(Dashboard));
	}
	if (!document.body.contains(rootEl)) {
		document.body.prepend(rootEl);
	}
}

function Dashboard() {
	const [widgetActive, setWidgetActive] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const [commitedInputValue, setCommitedInputValue] = React.useState(inputValue);
	const [isTyping, setIsTyping] = React.useState(false);
	const [renderContent, setRenderContent] = React.useState<JSX.Element | null>(null);
	const widgetElRef = React.useRef<HTMLDivElement | null>(null);
	const inputElRef = React.useRef<HTMLInputElement | null>(null);
	const isTypingTimeout = React.useRef<number | undefined>();
	const commitInputTimeout = React.useRef<number | undefined>();

	React.useEffect(initKeyListener, [widgetActive, inputValue]);
	React.useEffect(onChangedWidgetActive, [widgetActive]);
	React.useEffect(onChangedInputValue, [inputValue]);
	React.useEffect(onCommitedInput, [commitedInputValue]);

	return (
		<React.Fragment>
			<DashboardOpener selector="[data-turtlemay-dashboard-opener]" onClick={openDashboard} />
			<div className="turtlemay__dash" ref={widgetElRef} data-turtlemay-active={widgetActive} tabIndex={1}>
				<div className="turtlemay__dashTopBar">
					<div className="turtlemay__dashTopBarInput turtlemay__dashInputSpinnerContainer">
						<div className="turtlemay__dashInputSpinner" data-turtlemay-active={isTyping}></div>
						<input type="text" ref={inputElRef} value={inputValue} onChange={handleChangeInput} placeholder="Enter query" spellCheck="false" />
					</div>
					<div className="turtlemay__dashTopBarButton" onClick={handleClickReset}>↺</div>
					<div className="turtlemay__dashTopBarButton" onClick={handleClickClose}>×</div>
				</div>
				<div className="turtlemay__dashContent">
					{renderContent}
				</div>
			</div>
		</React.Fragment>
	);

	function initKeyListener() {
		addEventListener("keydown", handleKey);
		return () => removeEventListener("keydown", handleKey);

		function handleKey(event: KeyboardEvent) {
			if (widgetActive && widgetElRef.current?.contains(document.activeElement)) {
				if (event.key === RESET_KEY) {
					resetInput(inputValue, inputElRef.current);
					return;
				}
				if (event.key === "Escape") {
					setWidgetActive(false);
					return;
				}
				if (document.activeElement instanceof HTMLInputElement) {
					if (event.key === "Enter") {
						setInputValue("");
						return;
					}
				}
			}
		}
	}

	function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
		setInputValue(event.target.value);
		setIsTyping(true);
		clearTimeout(isTypingTimeout.current);
		isTypingTimeout.current = window.setTimeout(finishTyping, INPUT_DELAY);
	}

	function handleClickReset() {
		resetInput(inputValue, inputElRef.current);
	}

	function handleClickClose() {
		setWidgetActive(false);
	}

	function onChangedWidgetActive() {
		if (widgetActive) {
			inputElRef.current?.select();
		}
	}

	function onChangedInputValue() {
		clearTimeout(commitInputTimeout.current);
		commitInputTimeout.current = window.setTimeout(commitInput, INPUT_DELAY);
	}

	function onCommitedInput() {
		if (commitedInputValue) {
			for (const v of [
				renderGuessDigitQuery(commitedInputValue),
				renderMultiQuery(commitedInputValue),
			]) {
				if (v) {
					setRenderContent(v);
					break;
				}
			}
		}
	}

	function openDashboard() {
		setWidgetActive(true);
		inputElRef.current?.scrollIntoView({ behavior: "smooth" });
		inputElRef.current?.select();
	}

	function resetInput(str: string, el: HTMLInputElement | null) {
		if (!str) setRenderContent(null);
		setInputValue("");
		setCommitedInputValue("");
		el?.scrollIntoView({ behavior: "smooth" });
		el?.select();
	}

	function finishTyping() {
		setIsTyping(false);
	}

	function commitInput() {
		setCommitedInputValue(inputValue);
	}
}

function renderGuessDigitQuery(str: string) {
	const matchGuessDigitQuery = str.match(/^(\d*)\?(\d)*$/);

	if (!matchGuessDigitQuery) {
		return null;
	}

	const possibleItemValues: string[] = [];

	for (let i = 0; i <= 9; i++) {
		const subStr1 = matchGuessDigitQuery[1] ?? "";
		const subStr2 = matchGuessDigitQuery[2] ?? "";
		possibleItemValues.push(`${subStr1}${i}${subStr2}`);
	}

	return (
		<React.Fragment>
			<div className="turtlemay__dashContentTip" key={str}>
				Rendering all possible values for your missing digit.
			</div>
			{...possibleItemValues.map((v, i) => (
				<DashResult key={`${v}#${i}`} value={v} ordinal={i} />
			))}
		</React.Fragment>
	);
}

function renderMultiQuery(str: string) {
	const splitInputs = (
		str.split(QUERY_SEPARATOR)
			.map(v => v.trim())
			.filter(v => v.length > 0)
	);
	return (
		<React.Fragment>
			{splitInputs.map((v, i) => (
				<DashResult key={`${v}#${i}`} value={v} ordinal={splitInputs.length > 1 ? i : undefined} />
			))}
		</React.Fragment>
	);
}

function DashResult(props: { className?: string; value: string; ordinal?: number; }) {
	const canvasElRef = React.createRef<HTMLCanvasElement>();

	React.useEffect(update, [props.value]);

	return (
		<div className="turtlemay__dashResult turtlemay__enterAnimation">
			<div className="turtlemay__dashResultInfo turtlemay__dashResultOrdinalContainer">
				<div className="turtlemay__dashResultInfoValue">{props.value}</div>
				<ul>
					<li><a href={getTargetSearchUrl(props.value)} target="_blank">Search Target</a></li>
					<li><a href={getGoogleSearchUrl(props.value)} target="_blank">Search Google</a></li>
				</ul>
				<div className="turtlemay__dashResultOrdinal">
					{props.ordinal !== undefined ? props.ordinal + 1 : "#"}
				</div>
			</div>
			<canvas className="turtlemay__dashResultDatabarCanvas" width={0} height={0} key={props.value} ref={canvasElRef} />
		</div>
	);

	function update() {
		QRCode.toCanvas(canvasElRef.current, props.value, {
			color: { dark: "#000", light: "#0000" },
			margin: 0,
			scale: 3,
		});
	}
}

function DashboardOpener(props: {
	selector: string,
	onClick: VoidFunction,
}) {
	React.useEffect(initClickListener, []);

	return null;

	function initClickListener() {
		addEventListener("click", handleClick);
		return () => removeEventListener("click", handleClick);
	}

	function handleClick(event: MouseEvent) {
		const clickedEl = event.target as HTMLElement;
		if (clickedEl.closest(props.selector)) {
			props.onClick();
		}
	}
}

function getGoogleSearchUrl(str: string) {
	const s = encodeURIComponent(str);
	return `https://www.google.com/search?q=${s}`;
}

function getTargetSearchUrl(str: string) {
	const s = encodeURIComponent(str);
	return `https://www.target.com/s?searchTerm=${s}`;
}
