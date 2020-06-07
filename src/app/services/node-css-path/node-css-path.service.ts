
export class NodeCssPath {
	#blockTags = /^(div|li|p|body)$/ ; // start with (^) + end on ($)

	// startSelectionTextNodeNumber
	// endSelectionTextNodeNumber
	// startOffset
	// endOffset
	// parent selector

	getNumbersInParentsNodesUntilBLockTag() {

	}

	getParentCssSelector(node: Node, depth = 3, cssSelectors: string[] = []): string {
		const parent = this.getParentElement(node);
		const selector = this.getElementCssSelector(parent);

		cssSelectors.push(selector);

		if (parent.id) {
			return this.getHierarchyCssSelector(cssSelectors);
		}

		depth--;

		if (0 === depth) {
			return this.getHierarchyCssSelector(cssSelectors);
		}

		return this.getParentCssSelector(parent, depth, cssSelectors);
	}

	private hasTextNote(element: HTMLElement) {
		return element.childNodes.length > 0;
	}

	private isBlockParentNode(textNode: Node) {
		return this.#blockTags.test(this.getParentElement(textNode).tagName.toLowerCase() || 'noop');
	}

	private getElementCssSelector(element: HTMLElement): string {
		return this.getElementIdCssSelector(element) || this.getElementClassCssSelector(element) || element.tagName.toLowerCase();
	}

	private getElementIdCssSelector(element: HTMLElement): string | null {
		return element.id ? `#${element.id}` : null;
	}

	private getElementClassCssSelector(element: HTMLElement): string | null {
		const classes = element.className;

		return classes ? `.${classes.split(' ').join('.')}` : null;
	}

	// selector[0] - child
	// selector[1] - parent
	// expected queue: 'parent > child'
	private getHierarchyCssSelector(selectors: string[]): string {
		return selectors.reverse().join(' ');
	}
	
	// <html> doesn't have parent element
	// so to avoid checking of NULL every where
	// I will return body element if parentElement doesn't exist
	private getParentElement(node: Node): HTMLElement {
		return node.parentElement || document.body;
	}
}