import * as React from "react";
import * as JsBarcode from "jsbarcode";

export function Barcode(props: { className?: string; itemInfo: IItemInfo }) {
	const elemRef = React.createRef<HTMLCanvasElement>();

	React.useEffect(function _update() {
		let format = "code128";
		let value: string | undefined;

		if (props.itemInfo.upc) {
			if (props.itemInfo.upc.length === 12) format = "upc";
			if (props.itemInfo.upc.length === 13) format = "ean13";
			value = props.itemInfo.upc;
		} else if (props.itemInfo.dpci) {
			value = props.itemInfo.dpci;
		} else if (props.itemInfo.tcin) {
			value = props.itemInfo.tcin;
		}

		if (value) {
			JsBarcode(elemRef.current as HTMLCanvasElement, value, {
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
		className: props.className,
		ref: elemRef,
	});
}
