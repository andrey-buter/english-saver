export class SelectWord {
	range: Range;

	constructor(selection: Selection) {
		this.range = selection.getRangeAt(0);
	}


}

export class SaveNodePath {
	#blockNodes = /^(div|li|p|body)$/ ; // start with (^) and end ($)
	constructor() {

	}

	hasTextNote(element: HTMLElement) {
		return element.childNodes.length > 0;
	}

	isBlockParentNode(textNode: Node) {
		return this.#blockNodes.test(this.getParentElement(textNode).tagName.toLowerCase() || 'noop');
	}

	getElementCssSelector(element: HTMLElement): string {
		return this.getElementIdCssSelector(element) || this.getElementClassCssSelector(element) || element.tagName.toLowerCase();
	}

	getElementIdCssSelector(element: HTMLElement): string | null {
		return element.id ? `#${element.id}` : null;
	}

	getElementClassCssSelector(element: HTMLElement): string | null {
		const classes = element.className;

		return classes ? `.${classes.split(' ').join('.')}` : null;
	}

	getParentCssSelector(node: Node, depth = 3, selector = ''){
		const parent = this.getParentElement(node);

		if (parent.id) {
			return this.getElementIdCssSelector(parent);
		}
	}

	// findParentWithId(node: Node, depth = 3): null | string {
	// 	const id = this.getParentElement(node).id;

	// 	if (id) {
	// 		return id;
	// 	}

	// 	depth--;

	// 	if (0 === depth) {
	// 		return null;
	// 	}

	// 	return this.findParentWithId(node, depth);
	// }
	
	// <html> doesn't have parent element
	// so to avoid checking of NULL every where
	// I will return body element if parentElement doesn't exist
	private getParentElement(node: Node): HTMLElement {
		return node.parentElement || document.body;
	}
}