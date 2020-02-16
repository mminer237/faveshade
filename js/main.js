"use strict"

Array.from(document.querySelectorAll('.color-picker')).forEach(container => {
	const opaque = container.classList.contains("opaque");
	const textBox = document.createElement('input');
	textBox.pattern = `#[A-Za-z0-9]{${opaque ? 6 : 8}}`;
	container.insertAdjacentElement('afterend', textBox);
	const pickr = Pickr.create({
		el: container,
		theme: 'classic',
		lockOpacity: opaque,
		adjustableNumbers: false,
		default: container.dataset.default,

		components: {
			// Main components
			preview: true,
			opacity: !opaque,
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
	textBox.addEventListener("input", (e => {
		pickr.setColor(e.target.value);
	}));
	pickr.on('change', (color, instance) => {
		textBox.value = color.toHEXA().toString();
	});
});