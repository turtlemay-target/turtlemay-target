import * as React from "react";
import JsBarcode from "jsbarcode";

export function Barcode(props: { className?: string; itemInfo: IItemInfo | null}) {
	const elemRef = React.createRef<HTMLCanvasElement>();

	React.useEffect(update, [
		props.itemInfo?.upc,
		props.itemInfo?.dpci,
		props.itemInfo?.tcin,
	]);

	function update() {
		let format = "code128";
		let value: string | undefined;

		if (props.itemInfo?.upc) {
			if (props.itemInfo.upc.length === 12) format = "upc";
			if (props.itemInfo.upc.length === 13) format = "ean13";
			value = props.itemInfo.upc;
		} else if (props.itemInfo?.dpci) {
			value = props.itemInfo.dpci;
		} else if (props.itemInfo?.tcin) {
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
				background: "transparent",
			});
		}
	}

	return React.createElement("canvas", {
		className: `${props.className} turtlemay__enterAnimation`,
		key: props.itemInfo?.upc ?? props.itemInfo?.dpci ?? props.itemInfo?.tcin,
		ref: elemRef,
	});
}
