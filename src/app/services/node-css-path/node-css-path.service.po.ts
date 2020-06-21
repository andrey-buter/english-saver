export class NodePathPageObject {
	constructor() {

	}

	getDiv(text = 'Selection') {
		const div = document.createElement('div');
		div.textContent = text;

		return div;
	}

	getDivFirstChild(text?: string) {
		return this.getDiv(text).childNodes[0];
	}
}
