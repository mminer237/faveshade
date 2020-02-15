"use strict"

Array.from(document.querySelectorAll('.color-picker')).forEach(container => {
	const opacity = !container.classList.contains("opaque");
	const pickr = Pickr.create({
		el: container,
		theme: 'classic',
		lockOpacity: !opacity,
		adjustableNumbers: false,
		default: container.dataset.default,

		components: {
			// Main components
			preview: true,
			opacity: opacity,
			hue: true,

			// Input / output Options
			interaction: {
				hex: true,
				rgba: true,
				hsla: true,
				hsva: true,
				cmyk: true,
				input: true,
				clear: true,
				save: true
			}
		}
	});
});