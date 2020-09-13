import { ChildNodePath } from "../../models/node-number-in-parent.model";
import { NodePath } from "../../models/node-path.model";
import { Word } from "../../models/word.model";

interface ValidNode {
	startNode: Node;
	endNode: Node;
}

interface RangeNodeData {
	node: Node;
	offset: number;
}

export class Highlighter {
	private getValidNodes(startPath: NodePath, endPath: NodePath): ValidNode[] | null {
		const startNodes = this.queryTextNodes(startPath.cssParentSelector, startPath.childrenNodesPaths);
		const endNodes = this.queryTextNodes(endPath.cssParentSelector, endPath.childrenNodesPaths);

		if (startNodes.length !== endNodes.length) {
			console.warn('[Highlighter.getValidNodes] startNodes.length !== endNodes.length');
			return null;
		}

		const results = startNodes
			.map((startNode, key) => {
				const endNode = endNodes[key];

				if (!startNode) {
					return;
				}

				if (!endNode) {
					return;
				}

				return { startNode, endNode } as ValidNode;
			})
			.filter(Boolean);

		return results as ValidNode[];
	}

	// ! не работает для iframes
	// ! т.к. не сохраняется путь для iframe
	// ! см https://learningapps.org/watch?v=pku7kxxgk20

	highlight(word: Word) {
		const { id: _id, translation, startRange, endRange } = word;
		const validNodes = this.getValidNodes(startRange, endRange);

		const id = _id as string;

		if (!validNodes) {
			return;
		}

		// ! TODO: test startRange.offset = 0
		validNodes.forEach(({ startNode, endNode }) => {
			// ts doesn't react on condition outside the loop
			if (!startRange.offset && startRange.offset != 0) {
				console.warn('[Highlighter.highlight] startRange.offset is undefined');
				return null;
			}

			if (!endRange.offset && endRange.offset != 0) {
				console.warn('[Highlighter.highlight] endRange.offset is undefined');
				return null;
			}

			if (startNode.nodeValue && startNode.nodeValue.length < startRange.offset) {
				console.warn('[Highlighter.highlight] startOffest > nodeValue.length');
				return;
			}

			const start: RangeNodeData = {
				node: startNode,
				offset: startRange.offset
			};
			const end: RangeNodeData = {
				node: endNode,
				// ts doesn't react on condition above about offset so I set unreal offset
				offset: endRange.offset || 9999
			};
			const range = this._createRange(start, end);

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

			// if ((startNode.nodeValue?.length || 0) < startRange.offset) {
			// 	return;
			// }

			// ! surroundContents() оборачивает только текстовые ноды.
			// ! если выделение содержит несколько nodes, тогда метод выдает ошибку
			// ! doesn't work - range.surroundContents(this.getWrapper());


			// @see https://developer.mozilla.org/ru/docs/Web/API/Range/surroundContents
			const newNode = this.getWrapper(id, translation);
			newNode.appendChild(range.extractContents());
			range.insertNode(newNode)
		});
	}

	_createRange(start: RangeNodeData, end: RangeNodeData): Range {
		const range = new Range();

		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);

		return range;
	}

	// private matchRangeWithSelectedText(selection: string, range: Range): boolean {

	// }

	private getWrapper(id: string, translation: string) {
		const span = document.createElement('span');
		span.style.backgroundColor = '#ff9632';
		span.id = id;
		span.dataset.translation = translation;
		span.classList.add('eng-saver__highlight-word');

		return span;
	}

	// ! TODO: add a test with unusual Id, such as on medium.com "#33rd"
	private queryTextNodes(parentCssSelector: string, childrenPaths: ChildNodePath[]) {
		let parents: Element[] = [];
		if (this.isId(parentCssSelector)) {
			const el = document.getElementById(parentCssSelector.replace('#', ''));

			if (el) {
				parents = [el];
			} else {
				console.warn(`[Highlighter.queryTextNodes] Id isn't correct "${parentCssSelector}"`);
			}
		} else {
			parents = Array.from(document.querySelectorAll(parentCssSelector));
		}

		return parents.map((parent) => this.findChildrenNodesWithSelection(parent, childrenPaths));
	}

	// TODO: should be tested
	private isId(string: string) {
		if (string.split(' ').length > 1) {
			return false;
		}
		return string.includes('#');
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
