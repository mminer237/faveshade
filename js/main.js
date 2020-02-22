"use strict"

const preview = document.getElementById("preview");
const previewLogo = document.getElementById("preview-logo");
const altsContainer = document.getElementById("alts-container");

let mainColorPicker;

if (!Pickr) {
	const div = document.createElement('div');
	div.classList.add("subsection");
	div.innerText = "Error: Failed to load Pickr! Please loading the page again.";
	document.querySelector('.split').insertBefore(div);
}
else
	Array.from(document.querySelectorAll('.color-picker')).forEach(container => {
		const id = container.id;
		const opaque = container.classList.contains("opaque");
		const textBox = document.createElement('input');
		textBox.pattern = `#[A-Za-z0-9]{6}([A-Za-z0-9]{${opaque ? 0 : 2}})?`;
		textBox.maxLength = opaque ? 6 : 8;
		container.insertAdjacentElement('afterend', textBox);
		const copyButton = document.createElement('button');
		copyButton.innerHTML = '<img src="/assets/content_copy_white_18x18.png" alt="Copy">';
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
					input: false,
					clear: false,
					save: false
				}
			}
		});
		if (id === 'main-color-picker') {
			mainColorPicker = pickr;
		}
		textBox.addEventListener("input", (e => {
			pickr.setColor(e.target.value);
			if (id === 'main-color-picker') {
				AlternateColor.resetRange();
			}
		}));
		function pickrChanged(color, instance) {
			textBox.value = color.toHEXA().toString();
			if (id === 'background-color-picker') {
				preview.style.backgroundColor = color.toHEXA().toString();
			}
			else if (id === 'main-color-picker') {
				setMainColor(color.toHEXA().toString());
				AlternateColor.resetRange();
			}
		}
		pickr.on('init', instance => {
			pickrChanged(instance.getColor(), instance);
			refreshAlternates();
		});
		pickr.on('change', pickrChanged);
		pickr.on('changestop', instance => {
			refreshAlternates();
		});
		pickr.on('cancel', instance => {
			pickrChanged(instance.getSelectedColor(), instance);
		});
	});

function setMainColor(color, setEditors = false) {
	preview.style.color = color;
	previewLogo.style.fill = color;
	if (setEditors) {
		mainColorPicker.setColor(color);
	}
}

function getRandomColor() {
	const golden_ratio_conjugate = 0.618033988749895;
	let hue = Math.random();
	hue += golden_ratio_conjugate;
	hue %= 1;
	return rgbToHex(...hslToRgb(hue, 0.85, 0.55 + (Math.random() - 0.5) * 0.2));
}
document.getElementById("new-color").addEventListener("click", e => {
	setMainColor(getRandomColor(), true);
	AlternateColor.narrowRange();
	refreshAlternates();
});

class AlternateColor extends HTMLElement {
	// static range; // Firefox doesn't support static fields yet
	constructor() {
		super();
		this.innerHTML = `<div class="color-border"></div><div class="color-inside"></div>`;
		this.colorInsideElement = this.querySelector(".color-inside");
		this.addEventListener("click", e => {
			this.constructor.adjustRange(mainColorPicker.getColor().toHSLA(), rgbToHsl(...hexToRgb(this.color)));
			setMainColor(this.color, true);
			refreshAlternates();
		});
	}
	setColorNear(mainColor) {
		console.log(mainColor);
		let color = rgbToHsl(...hexToRgb(mainColor));
		console.log(color);
		console.log(this.constructor.range);
		for (let i = 0; i < 3; i++) {
			const base = color[i];
			color[i] = ((base - this.constructor.range[i][0] - 0.05 + Math.random() * (this.constructor.range[i][0] + this.constructor.range[i][1] + 0.1)) + 1) % 1;
		};
		console.log(color);
		this.color = rgbToHex(...hslToRgb(...color));
		console.log(this.color);
		this.colorInsideElement.style.backgroundColor = this.color;
	}
	static resetRange() {
		this.range = [[1, 1], [1, 1], [1, 1]];
	}
	static adjustRange(oldColor, newColor) {
		for (let i = 0; i < 3; i++) {
			let difference = oldColor[i] - newColor[i];
			if (i === 0 && (difference > 0.5 || difference < -0.5)) {
				if (difference > 0) {
					difference -= 1;
				}
				else {
					difference += 1;
				}
			}
			const side = difference < 0 ? 0 : 1;
			this.range[i][side] = Math.abs(difference);
		}
	}
	static narrowRange() {
		for (let i = 0; i < 3; i++) {
			color[i][0] /= 1.5;
			color[i][1] /= 1.5;
		};
	}
}
AlternateColor.resetRange();
customElements.define('alt-color', AlternateColor);

const alts = Array.from(document.querySelectorAll('alt-color'));
function refreshAlternates() {
	alts.forEach(x => x.setColorNear(mainColorPicker.getColor().toHEXA().toString()));
}
document.getElementById("refresh-alts").addEventListener("click", e => {
	refreshAlternates();
});

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
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
function hslToRgb(h, s, l) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
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