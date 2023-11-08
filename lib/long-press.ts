/** @file Enables long-pressing of DOM elements. */

/** @returns A "pointerdown" event listener. */
export function createLongPointerDownListener(args: {
	/** Predicate matching the long-pressable element. */
	longPressableEl: (elem: HTMLElement) => Boolean;

	onLongPressed: (elem: HTMLElement) => void;

	/** Attribute name applied to long-pressable elements. */
	longPressableAttr: string;
	/** Attribute name applied while long-press is active. */
	longPressedAttr: string;
},
	/** Minimum duration in milliseconds to qualify as long-press. */
	longPressTime = 500,
) {
	return (event: PointerEvent) => {
		const targetEl = event.target as HTMLElement;

		if (!args.longPressableEl(targetEl)) {
			return;
		}

		const pointerDownTime = Date.now();

		let longPressTimeout = setTimeout(onLongPressTimeout, longPressTime);

		targetEl.addEventListener("pointerup", pointerUpListener, { once: true });
		targetEl.addEventListener("pointerout", pointerOutListener, { once: true });

		targetEl.setAttribute(args.longPressableAttr, "");

		function onLongPressTimeout() {
			targetEl.setAttribute(args.longPressedAttr, "");
		}

		function pointerUpListener(ev: PointerEvent) {
			clearTimeout(longPressTimeout);

			targetEl.removeAttribute(args.longPressedAttr);

			if (ev.target === targetEl) {
				if (Date.now() - pointerDownTime > longPressTime) {
					args.onLongPressed(targetEl);
				}
			}
		}

		function pointerOutListener(ev: PointerEvent) {
			if (ev.target === targetEl) {
				clearTimeout(longPressTimeout);

				targetEl.removeAttribute(args.longPressedAttr);
			}
		}
	};
}
