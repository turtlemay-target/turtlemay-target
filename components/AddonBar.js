import htm from "../web_modules/htm.js";
import { React } from "../web_modules/es-react.js";
import { Barcode } from "./Barcode.js";

const html = htm.bind(React.createElement);

export function AddonBar({ itemInfo }) {
	return html`
		<div className="turtlemay__addonBar">
			<${Barcode} itemInfo=${itemInfo} />
		</div>
	`;
}
