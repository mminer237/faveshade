"use strict"

const preview = document.getElementById("preview");
const previewLogo = document.getElementById("preview-logo");
const altsContainer = document.getElementById("alts-container");

let mainColor;

Array.from(document.querySelectorAll('.color-picker')).forEach(container => {
	const id = container.id;
	const opaque = container.classList.contains("opaque");
	const textBox = document.createElement('input');
	textBox.pattern = `#[A-Za-z0-9]{6}([A-Za-z0-9]{${opaque ? 0 : 2}})?`;
	textBox.maxLength = opaque ? 6 : 8;
	container.insertAdjacentElement('afterend', textBox);
	const pickr = Pickr.create({
		el: container,
		theme: 'classic',
		lockOpacity: opaque,
		comparison: false,
		adjustableNumbers: false,
		default: container.dataset.default || getRandomColor(),

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
		else if (id === 'main-color-picker') {
			setMainColor(color.toHEXA().toString());
		}
	}
	pickr.on('init', instance => {
		pickrChanged(instance.getColor(), instance);
		refreshAlternates();
	});
	pickr.on('change', pickrChanged);
	pickr.on('cancel', instance => {
		pickrChanged(instance.getSelectedColor(), instance);
	});
});

function setMainColor(color) {
	mainColor = color;
	preview.style.color = color;
	previewLogo.style.fill = color;
}

function getRandomColor() {
	return '#FFFFFF'; // Guaranteed random
}

class AlternateColor extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `<div class="color-border"></div><div class="color-inside"></div>`;
	}
	setColorNear(mainColor) {
		mainColor = mainColor.substring(1);
		return `#${mainColor}`;
	}
}
customElements.define('alt-color', AlternateColor);

const alts = Array.from(document.querySelectorAll('alt-color'));
function refreshAlternates() {
	alts.forEach(x => x.setColorNear(mainColor));
}
document.getElementById("refresh-alts").addEventListener("click", e => {
	refreshAlternates();
});

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}