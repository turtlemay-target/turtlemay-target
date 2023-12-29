/** @file Enables long-pressing of DOM elements. */

/** @returns A "pointerdown" event listener. */
export function createLongPointerDownListener(args: {
	/** Predicate matching the long-pressable element. */
	longPressableEl: (elem: HTMLElement) => Boolean;

	onLongPressed: (elem: HTMLElement) => void;

	/** Class name applied to long-pressable elements. */
	longPressableClass: string;
	/** Class name applied while long-press is active. */
	longPressedClass: string;
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
		targetEl.addEventListener("contextmenu", contextMenuListener, { once: true });

		targetEl.classList.add(args.longPressableClass);

		function onLongPressTimeout() {
			targetEl.classList.add(args.longPressedClass);
		}

		function pointerUpListener(ev: PointerEvent) {
			clearTimeout(longPressTimeout);

			targetEl.classList.remove(args.longPressedClass);

			if (ev.target === targetEl) {
				if (Date.now() - pointerDownTime > longPressTime) {
					args.onLongPressed(targetEl);
				}
			}
		}

		function pointerOutListener(ev: PointerEvent) {
			if (ev.target === targetEl) {
				clearTimeout(longPressTimeout);

				targetEl.classList.remove(args.longPressedClass);
			}
		}

		function contextMenuListener(ev: MouseEvent) {
			// Prevent context menu initiated by touch or primary button.
			if (ev.button < 1) {
				ev.preventDefault();
			}
		}
	};
}
