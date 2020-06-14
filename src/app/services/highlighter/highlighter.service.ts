
export class Highlighter {
	constructor() {

	}

	select() {

	}

	queryNodes(selector: string): NodeListOf<Element> {
		return document.querySelectorAll(selector);
	}

	findSelectedRange() {
		const elements = this.queryNodes(selector);

	}
}
