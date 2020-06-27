import { ChildNodePath } from "../../models/node-number-in-parent.model";

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

	findNodes(lookedForText: string, selector: ChildNodePath, index: number, parentElement: Element) {
		let results: Node[] = [];
		const elements = parentElement.querySelectorAll(selector.parentTag);
		const nodeNumber = selector.number;

		if (!elements.length) {
			throw new Error(`[Highlighter.findTextNode] Selector doesn't exist: ${JSON.stringify(selector)}`);
		}

		elements.forEach((element) => {
			// if element has less children than selector in path
			if (element.childNodes.length < nodeNumber) {
				return;
			}

			const lookedForNode = element.childNodes[nodeNumber];

			if (!lookedForNode) {
				return;
			}

			if (!lookedForNode.textContent?.includes(lookedForText)) {
				return;
			}

			// skip text nodes
			if (Node.TEXT_NODE === lookedForNode.nodeType && index !== 0) {
				return;
			}

			results.push(lookedForNode);
		});

		if (!results.length) {
			throw new Error(`[Highlighter.findTextNode] Selector doesn't have a child with index: ${JSON.stringify(selector)}`);
		}

		return results;
	}

	findNodesWithSelection(lookedForText: string, path: ChildNodePath[]): Node[] {
		let results: Node[] = [];
		const key = 0;
		const parentElement = document;
		const index = path.length - key - 1;
		
		const selector = path[key];
		const elements = parentElement.querySelectorAll(selector.parentTag);
		const nodeNumber = selector.number;

		if (!elements.length) {
			throw new Error(`[Highlighter.findTextNode] Selector doesn't exist: ${JSON.stringify(selector)}`);
		}

		elements.forEach((element) => {
			// if element has less children than selector in path
			if (element.childNodes.length < nodeNumber) {
				return;
			}

			const lookedForNode = element.childNodes[nodeNumber];

			if (!lookedForNode) {
				return;
			}

			if (!lookedForNode.textContent?.includes(lookedForText)) {
				return;
			}

			// skip text nodes
			// if (index !== 0 && Node.TEXT_NODE === lookedForNode.nodeType) {
			// 	return;
			// }

			results.push(lookedForNode);
		});

		if (!results.length) {
			throw new Error(`[Highlighter.findTextNode] Selector doesn't have a child with index: ${JSON.stringify(selector)}`);
		}

		return results;
	}

	_getFoundNodesText(nodes: Node[]): Array<string | null> {
		return nodes.map((node) => node?.textContent);
	}

	findTextNodes2(lookedForText: string, path: ChildNodePath[]) {
		return path.reverse().map((selector, key) => {
			let results = [];
			const elements = document.querySelectorAll(selector.parentTag);
			const number = selector.number;
			const index = path.length - key - 1;

			if (!elements.length) {
				throw new Error(`[Highlighter.findTextNode] Selector doesn't exist: ${JSON.stringify(selector)}`);
			}

			elements.forEach((element) => {
				// if element has less children than selector in path
				if (element.childNodes.length < number) {
					return;
				}

				const child = element.childNodes[number];

				// skip text nodes
				if (index !== 0 && Node.TEXT_NODE === child.nodeType) {
					return;
				}

				results.push(child);
			});

			if (!results.length) {
				throw new Error(`[Highlighter.findTextNode] Selector doesn't have a child with index: ${JSON.stringify(selector)}`);
			}

			return results;

			// я сделал проход только по верхнему родителю
			// у нас есть results с children elements,
			// и теперь в каждом элементе!!! нужно делалть такой же поиск
			// вероятно придется что-то мнетья в функции
		});
	}
}
