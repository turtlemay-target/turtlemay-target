import * as React from "react";
import { Barcode } from "./Barcode";

export function BarcodeWidget(props: { itemInfo: IItemInfo | null }) {
	return (
		props.itemInfo && (
			<div className="turtlemay__barcodeWidget">
				<Barcode itemInfo={props.itemInfo} />
			</div>
		)
	);
}
