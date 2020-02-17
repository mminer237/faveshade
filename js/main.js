"use strict"

const preview = document.getElementById("preview");
const previewLogo = document.getElementById("preview-logo");

Array.from(document.querySelectorAll('.color-picker')).forEach(container => {
	const id = container.id;
	const opaque = container.classList.contains("opaque");
	const textBox = document.createElement('input');
	textBox.pattern = `#[A-Za-z0-9]{${opaque ? 6 : 8}}`;
	container.insertAdjacentElement('afterend', textBox);
	const pickr = Pickr.create({
		el: container,
		theme: 'classic',
		lockOpacity: opaque,
		comparison: false,
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
				hsva: false,
				cmyk: true,
				input: false,
				clear: false,
				save: false
			}
		}
	});
	textBox.addEventListener("input", (e => {
		pickr.setColor(e.target.value);
	}));
	function pickrChanged(color, instance) {
		textBox.value = color.toHEXA().toString();
		if (id === 'background-color-picker') {
			preview.style.backgroundColor = color.toHEXA().toString();
		}
	}
	pickr.on('init', instance => {
		pickrChanged(instance.getColor(), instance);
	});
	pickr.on('change', pickrChanged);
	pickr.on('cancel', instance => {
		pickrChanged(instance.getSelectedColor(), instance);
	});
});

function setPreviewColor(color) {
	preview.style.color = color;
	previewLogo.style.fill = color;
}