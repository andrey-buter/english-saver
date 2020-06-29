import { ChildNodePath } from "../../models/node-number-in-parent.model";
import { NodePath } from "../../models/node-path.model";
import { Word } from "../../models/word.model";

export class Highlighter {
	highlight(id: string, startPath: NodePath, endPath: NodePath) {
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
			// ! Если начинать с чистой базы и добавлять новые слова,
			// ! тогда следующие слова запоминают свою позицию с учетом уже подсвеченых слов.
			// ! Соответственно ничего больше делать не нужно,
			// ! т.к. слова записываются в базу в нужно порядке!!!
			// ! НО! есть проблема при удалении, нужно будет пересчитвыать позицию для nextSiblings
			// ! т.к. их начальная позиция изменится при удалении выделения.
			//

			// if ((startNode.nodeValue?.length || 0) < startPath.offset) {
			// 	return;
			// }

			range.setStart(startNode, startPath.offset);
			range.setEnd(endNode, endPath.offset);

			// ! surroundContents() оборачивает только текстовые ноды.
			// ! если выделение содержит несколько nodes, тогда метод выдает ошибку
			// ! doesn't work - range.surroundContents(this.getWrapper());


			// @see https://developer.mozilla.org/ru/docs/Web/API/Range/surroundContents
			const newNode = this.getWrapper(id);
			newNode.appendChild(range.extractContents());
			range.insertNode(newNode)
		});
	}

	private getWrapper(id: string) {
		const span = document.createElement('eng-word');
		// span.style.backgroundColor = '#ff9632';
		span.id = id;
		// span.classList.add('eng-saver__highlight');

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
