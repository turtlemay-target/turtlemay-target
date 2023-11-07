/**
 * @file Toggle input mode between number and text.
 */

export { };

const LONG_PRESS_TIME = 500;

addEventListener("pointerdown", pointerDownListener);

function pointerDownListener(event: PointerEvent) {
	const pointedVoiceButton = (
		event.target instanceof HTMLButtonElement && (
			event.target.getAttribute("aria-label") === "search by voice" ||
			event.target.getAttribute("data-test") === "@web/Search/Microphone")
	);

	if (pointedVoiceButton) {
		const voiceButtonEl = event.target as HTMLElement;

		const inputEl = voiceButtonEl.closest(`form[action="/s"]`)?.querySelector("input");

		if (!inputEl) {
			return;
		}

		const pointerDownTime = Date.now();

		let longPressTimeout = setTimeout(onLongPressTimeout, LONG_PRESS_TIME);

		voiceButtonEl.addEventListener("pointerup", onPointerUp, { once: true });
		voiceButtonEl.addEventListener("pointerout", onPointerOut, { once: true });

		voiceButtonEl.setAttribute("data-turtlemay-inputButtonLongPressable", "");

		function onLongPressTimeout() {
			voiceButtonEl.setAttribute("data-turtlemay-inputButtonLongPressed", "");
		}

		function onPointerUp(event: PointerEvent) {
			clearTimeout(longPressTimeout);

			voiceButtonEl.removeAttribute("data-turtlemay-inputButtonLongPressed");

			if (event.target === voiceButtonEl && inputEl) {
				if (Date.now() - pointerDownTime > LONG_PRESS_TIME) {
					toggleInputMode(inputEl);
					inputEl.select();

					// Prevent activating button.
					voiceButtonEl.setAttribute("disabled", "");
					requestAnimationFrame(() => voiceButtonEl.removeAttribute("disabled"));
				}
			}
		}

		function onPointerOut(event: PointerEvent) {
			if (event.target === voiceButtonEl) {
				clearTimeout(longPressTimeout);

				voiceButtonEl.removeAttribute("data-turtlemay-inputButtonLongPressed");
			}
		}
	}
}

function toggleInputMode(el: HTMLInputElement) {
	if (el.inputMode !== "numeric") {
		el.inputMode = "numeric"
	} else {
		el.inputMode = "text";
	}
}
