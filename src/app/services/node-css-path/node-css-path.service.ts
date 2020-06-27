import { NodeNumberInParent, ChildNodePath } from "../../models/node-number-in-parent.model";
import { NodePath, NodePath2 } from "../../models/node-path.model";

export class NodeCssPath {
	#blockTags = /^(div|li|p|body)$/ ; // start with (^) + end on ($)
	#nonBlockTagsLimit = 10;
	#cssSelectorDepth = 3;
	#cssSelectorsDivider = ' ';

	// startSelectionTextNodeNumber
	// endSelectionTextNodeNumber
	// startOffset
	// endOffset
	// parent selector

	getPath(node: Node): NodePath {
		const pathInFirstParent = this.getNumbersInParentsNodesUntilBlockTag(node);
		const innerElements = pathInFirstParent.length - 1;
		const cssParentSelector = this.getParentCssSelector(node, innerElements + this.#cssSelectorDepth);

		const cssAncestorsArray = cssParentSelector.split(this.#cssSelectorsDivider);
		const selectors = cssAncestorsArray
			.slice(0, cssAncestorsArray.length - innerElements)
			.join(this.#cssSelectorsDivider);

		return {
			pathInParent: pathInFirstParent,
			cssParentSelector: selectors
		}
	}

	getPath2(node: Node): NodePath2 {
		const childrenNodesPaths = this.getChildrenNodesPaths(node);
		const innerElements = childrenNodesPaths.length - 1; // minus #text
		const cssParentSelector = this.getParentCssSelector(node, innerElements + this.#cssSelectorDepth);

		const cssAncestorsArray = cssParentSelector.split(this.#cssSelectorsDivider);
		const selectors = cssAncestorsArray
			.slice(0, cssAncestorsArray.length - innerElements)
			.join(this.#cssSelectorsDivider);

		return {
			childrenNodesPaths,
			cssParentSelector: selectors
		}
	}

	private getNumbersInParentsNodesUntilBlockTag(originNode: Node, limit = this.#nonBlockTagsLimit): NodeNumberInParent[] {
		let node = originNode;
		let result = [];

		while (true) {
			result.push(this.getNumberNodeInParent(node));
			limit--;

			if (this.isParentBlockTag(node)) {
				break;
			}

			if (0 === limit) {
				throw new Error(`[NodeCssPath.getNumbersInParentsNodesUntilBlockTag] There isn't block tags in ${limit} ancestors`);
			}

			node = this.getParentElement(node);
		}

		return result;
	}

	private getChildrenNodesPaths(originNode: Node, limit = this.#nonBlockTagsLimit): ChildNodePath[] {
		let node = originNode;
		let result = [];

		while (true) {
			if (this.isBlockTag(node)) {
				break;
			}

			result.push(this.getChildPath(node));
			limit--;

			if (0 === limit) {
				throw new Error(`[NodeCssPath.getNumbersInParentsNodesUntilBlockTag] There isn't block tags in ${limit} ancestors`);
			}

			node = this.getParentElement(node);
		}

		return result;
	}

	private getChildPath(childNode: Node): ChildNodePath {
		let counter = 0;
		let node = childNode;

		while (true) {
			if (!node.previousSibling) {
				break;
			}

			node = node.previousSibling;
			counter++;
		}

		return {
			// ! I don't know about that all browsers have the same nodeName of TEXT_NODE
			// ! in FireFox and Chrome it's #text
			nodeName: childNode.nodeName.toLowerCase(),
			index: counter
		}
	}

	private getNumberNodeInParent(originNode: Node): NodeNumberInParent {
		let counter = 0;
		let node = originNode;

		while(true) {
			if (!node.previousSibling) {
				break;
			}

			node = node.previousSibling;
			counter++;
		}

		return {
			parentTag: this.getParentElement(originNode).tagName.toLowerCase(),
			number: counter
		}
	}

	private getParentCssSelector(node: Node, depth = this.#cssSelectorDepth, cssSelectors: string[] = []): string {
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

	private isBlockTag(node: Node) {
		return this.#blockTags.test(node.nodeName.toLowerCase() || 'noop');
	}

	private isParentBlockTag(textNode: Node) {
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
		return selectors.reverse().join(this.#cssSelectorsDivider);
	}

	// <html> doesn't have parent element
	// so to avoid checking of NULL every where
	// I will return body element if parentElement doesn't exist
	private getParentElement(node: Node): HTMLElement {
		return node.parentElement || document.body;
	}
}
