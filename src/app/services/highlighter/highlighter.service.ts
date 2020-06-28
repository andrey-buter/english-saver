import { ChildNodePath } from "../../models/node-number-in-parent.model";
import { NodePath } from "../../models/node-path.model";

export class Highlighter {
	highlight(startPath: NodePath, endPath: NodePath) {
		const startNodes = this.queryTextNodes(startPath.cssParentSelector, startPath.childrenNodesPaths);
		const endNodes = this.queryTextNodes(endPath.cssParentSelector, endPath.childrenNodesPaths);

		if (startNodes.length !== endNodes.length) {
			console.warn('[Highlighter.highlight] startNodes.length !== endNodes.length');
		}

		startNodes.forEach((startNode, key) => {
			const endNode = endNodes[key];

			if (!startNode) {
				return;
			}

			if (!endNode) {
				return;
			}

			if (!startPath.offset) {
				console.warn('[Highlighter.highlight] startPath.offset is undefined');
				return;
			}

			if (!endPath.offset) {
				console.warn('[Highlighter.highlight] endPath.offset is undefined');
				return;
			}

			const range = new Range();

			// есть ошибка со словами, которые должны выделиться, когда они стоят после УЖЕ выделенного слова
			// Один вариант решения - сортировать по одинаковым нодам и начинать выделение с конца,
			// т.е. последнего потенциально выжеденного слова в текстовой ноде
			// Второй вариант - делать пересчет оффсетов при выделении слов в одной и той же ноде
			// Плюс возникнет проблема при сохранении, т.к. если уже есть выделенные ноды,
			// то оффсеты будут высчитываться относительно проапдейченого контента с выделениями,
			// что НЕ есть гуд.
			// Возможно нужно как-то сохранять копию оригинального контента???
			// Или при ручном добавлении нового выделения - делать пересчет
			// А при загрузке контента - начинать с конца - или тоже делать пересчет, 
			// если будет работать одинаково

			// if ((startNode.nodeValue?.length || 0) < startPath.offset) {
			// 	return;
			// }

			range.setStart(startNode, startPath.offset);
			range.setEnd(endNode, endPath.offset);
			range.surroundContents(this.getWrapper());
			window?.getSelection()?.removeAllRanges();
		});
	}

	private getWrapper() {
		const span = document.createElement('span');
		span.style.backgroundColor = 'blue';

		return span;
	}

	private queryTextNodes(parentCssSelector: string, childrenPaths: ChildNodePath[]) {
		const parents = Array.from(document.querySelectorAll(parentCssSelector));

		return parents.map((parent) => this.findChildrenNodesWithSelection(parent, childrenPaths));
	}

	private findChildrenNodesWithSelection(parentElement: Node, originPaths: ChildNodePath[]): Node | null {
		const paths = [...originPaths];
		const selector = paths.shift();

		if (!selector) {
			return parentElement;
		}

		const node = parentElement.childNodes[selector.index];

		if (!node) {
			return null;
		}

		if (selector.nodeName !== node.nodeName.toLowerCase()) {
			return null;
		}

		return this.findChildrenNodesWithSelection(node, paths);
	}
}
