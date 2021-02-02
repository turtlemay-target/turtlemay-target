import { React } from "../web_modules/es-react.js";
import JsBarcode from "../web_modules/jsbarcode.js";

/**
 * @param {Object} props
 * @param {string | undefined} props.className
 * @param {IItemInfo} props.itemInfo
 */
export function Barcode({ className, itemInfo }) {
	/** @type {React.Ref<HTMLCanvasElement>} */
	const elemRef = React.createRef();

	React.useEffect(function _update() {
		let format = "code128";

		/** @type {string | undefined} */
		let value;

		if (itemInfo.upc) {
			if (itemInfo.upc.length === 12) format = "upc";
			if (itemInfo.upc.length === 13) format = "ean13";
			value = itemInfo.upc;
		} else if (itemInfo.dpci) {
			value = itemInfo.dpci;
		} else if (itemInfo.tcin) {
			value = itemInfo.tcin;
		}

		if (value) {
			JsBarcode(elemRef.current, value, {
				format: format,
				width: 2,
				height: 20,
				margin: 5,
				displayValue: true,
				fontSize: 15,
			});
		}
	});

	return React.createElement("canvas", {
		className: className,
		ref: elemRef,
	});
}
