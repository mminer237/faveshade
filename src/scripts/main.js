import Pickr from '@simonwep/pickr';
import betaincinv from '@stdlib/math-base-special-betaincinv';

const preview = document.getElementById("preview");
const previewLogo = document.getElementById("preview-logo");

class AlternateColor extends HTMLElement {
	static weights = {};
	static betaShape = 10;
	constructor() {
		super();
		this.innerHTML = `<div class="color-border"></div><div class="color-inside"></div>`;
		this.colorInsideElement = this.querySelector(".color-inside");
		this.addEventListener("click", e => {
			this.constructor.addWeight(this.dataset.for, rgbToHsl(...hexToRgb(this.color)));
			setPickerColor(this.dataset.for, this.color);
			refreshAlternates(this.dataset.for);
			this.constructor.shrinkCurve();
		});
	}
	rerollColor() {
		let color = ["h", "s", "l"].map(x => this.constructor.getNumber(this.constructor.weights[this.dataset.for][x]));
		this.color = rgbToHex(...hslToRgb(...color));
		this.colorInsideElement.style.backgroundColor = this.color;
	}
	static shrinkCurve() {
		this.betaShape *= 1.17;
	}
	static getNumber(weights) {
		let answer;
		while (answer === undefined || answer < 0 || answer > 1) {
			const weightIndex = Math.floor(Math.random() * (weights.length + 1)) - 1;
			if (weightIndex === -1) {
				return Math.random();
			}
			else {
				answer = betaincinv(Math.random(), this.betaShape, this.betaShape) + weights[weightIndex] - 0.5;
			}
		}
		return answer;
	}
	static resetWeights(id) {
		this.weights[id] = {
			"h": [],
			"s": [],
			"l": []
		};
	}
	static addWeight(id, newColor) {
		for (let i = 0; i < 3; i++) {
			this.weights[id][["h", "s", "l"][i]].push(newColor[i]);
		}
	}
}
customElements.define('alt-color', AlternateColor);

const pickers = {};
let mainColorPicker;
Array.from(document.querySelectorAll('.color-picker')).forEach(container => {
	const id = container.id;
	const opaque = container.classList.contains("opaque");
	const textBox = document.createElement('input');
	textBox.pattern = `#[A-Za-z0-9]{6}([A-Za-z0-9]{${opaque ? 0 : 2}})?`;
	textBox.maxLength = opaque ? 6 : 8;
	container.insertAdjacentElement('afterend', textBox);
	const copyButton = document.createElement('button');
	copyButton.innerHTML = '<img src="/assets/icons/content_copy_white_18x18.png" alt="Copy">';
	copyButton.addEventListener("click", e => {
		navigator.clipboard.writeText(textBox.value);
	});
	textBox.insertAdjacentElement('afterend', copyButton);
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
				input: true,
				clear: false,
				save: false
			}
		}
	});
	pickers[id] = pickr;
	if (id === 'main-color-picker') {
		mainColorPicker = pickr;
	}
	AlternateColor.resetWeights(id);
	textBox.addEventListener("input", (e => {
		pickr.setColor(e.target.value);
	}));
	function pickrChanged(color, instance) {
		textBox.value = color.toHEXA().toString();
		setPickerColor(id, color.toHEXA().toString());
	}
	pickr.on('init', instance => {
		pickrChanged(instance.getColor(), instance);
		refreshAlternates(id);
	});
	pickr.on('change', pickrChanged);
	pickr.on('changestop', instance => {
		refreshAlternates(id);
	});
	pickr.on('cancel', instance => {
		pickrChanged(instance.getSelectedColor(), instance);
	});
});

function setPickerColor(id, color) {
	pickers[id].setColor(color);
	if (id === 'main-color-picker') {
		preview.style.color = color;
		previewLogo.style.fill = color;
	}
	else if (id === 'background-color-picker') {
		preview.style.backgroundColor = color;
	}
}

function getRandomColor() {
	const golden_ratio_conjugate = 0.618033988749895;
	let hue = Math.random();
	hue += golden_ratio_conjugate;
	hue %= 1;
	return rgbToHex(...hslToRgb(hue, 0.85, 0.55 + (Math.random() - 0.5) * 0.2));
}

Array.from(document.querySelectorAll('.new-color')).forEach(b => b.addEventListener("click", e => {
	const id = b.dataset.for;
	setPickerColor(id, getRandomColor());
	AlternateColor.resetWeights(id);
	refreshAlternates(id);
}));

const alts = Object.groupBy(document.querySelectorAll('alt-color'), x => x.dataset.for);
function refreshAlternates(id) {
	alts[id]?.forEach(x => x.rerollColor());
}
Array.from(document.querySelectorAll('.refresh-alts')).forEach(b =>
	b.addEventListener("click", e => {
		AlternateColor.addWeight(b.dataset.for, rgbToHsl(...hexToRgb(pickers[b.dataset.for].getColor().toHEXA().toString())));
		refreshAlternates(b.dataset.for);
		AlternateColor.shrinkCurve();
	})
);

function hexToRgb(color) {
	return [
		parseInt(color.substr(1,2), 16),
		parseInt(color.substr(3,2), 16),
		parseInt(color.substr(5,2), 16)
	];
}
function rgbToHex(r, g, b) {
	return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
function rgbToHsl(r, g, b) {
    r /= 255;
	g /= 255;
	b /= 255;
    const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    }
	else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
			default: throw new Error("Max color not found");
        }
        h /= 6;
    }

    return [h, s, l];
}
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    }
	else {
        var hue2rgb = function hue2rgb(p, q, t){
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [
		Math.round(r * 255),
		Math.round(g * 255),
		Math.round(b * 255)
	];
}