export class HighlighterPO {
	createDiv(html?: string) {
		const div = document.createElement('div');
		document.body.appendChild(div);

		if (html) {
			div.innerHTML = html;
		}

		return div;
	}
}