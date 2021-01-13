import * as React from "react";
import { Barcode } from "./Barcode";

export function AddonBar(props: { itemInfo: IItemInfo; }) {
	return (
		<div className="turtlemay__addonBar">
			<Barcode itemInfo={props.itemInfo} />
		</div>
	);
}
