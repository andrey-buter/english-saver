import { NodeNumberInParent } from "../../models/node-number-in-parent.model";

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

	findTextNode(path: NodeNumberInParent[]) {
		path.reverse().forEach((selector, key) => {
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

			// я сделал проход только по верхнему родителю
			// у нас есть results с children elements,
			// и теперь в каждом элементе!!! нужно делалть такой же поиск
			// dthjznyj ghbltncz xnj-nj vytnmz d aeyrwbb
		});
	}
}
