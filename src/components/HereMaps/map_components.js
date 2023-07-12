export const MarkerTemplate = (options = {textColor:"bleu", text: "", fillColor:"red"}) => {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px">' +
		'<path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" ' +
		'fill="#000" fill-opacity=".2"/><path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8' +
		' 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/> ' +
		'<path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C 22.9 ' +
		`18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="${options.fillColor}"/>` +
		`<text x="13" y="19" font-size="12pt" font-weight="bold" text-anchor="middle" fill="${options.textColor}">${options.text}</text></svg>`
}


export const roundIcon = (options = {textColor:"bleu", text: "", fillColor:"rgb(250, 127, 0)"}) => {
	return `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="10px" height="10px">` +
		`<circle cx="5" cy="5" r="4" fill="${options.fillColor}" stroke-width="1" stroke="black" opacity="1"/></svg>`
}



