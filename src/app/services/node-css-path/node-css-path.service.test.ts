import { NodeCssPath } from "./node-css-path.service";
import { NodeNumberInParent, ChildNodePath } from "../../models/node-number-in-parent.model";
import { NodePathPageObject } from "./node-css-path.service.po";
import { NodePath2 } from "../../models/node-path.model";

describe('Test class NodeCssPath', () => {
	const text = 'Some interesting text';
	const word = 'interesting';
	const startPosition = 5;
	const endPosition = startPosition + word.length;
	// let select;

	let nodePath: NodeCssPath;
	const po = new NodePathPageObject();

	beforeAll(() => {
		// select = new SelectWord();
		nodePath = new NodeCssPath();
	});

	it('should return correct start position', () => {
		const start = text.indexOf(word);

		expect(start).toBe(startPosition);
	})

	// it('should check node div', () => {
	// 	const div = document.createElement('div');
	// 	div.innerText = text;
	// 	const range = new Range();
	// 	range.setStart(div, startPosition);
	// 	range.setEnd(div, endPosition);;
	// 	const selection = window.getSelection();
	// });

	it('should check Html Elements has a text node', () => {
		const div = document.createElement('div');
		div.textContent = text;

		// @ts-ignore
		expect(nodePath.hasTextNote(div)).toBe(true);
	});

	it('should check Html Elements has NOT a text node', () => {
		const div = document.createElement('div');

		// @ts-ignore
		expect(nodePath.hasTextNote(div)).toBe(false);
	});

	it('should check Html Elements has NOT a text node 2', () => {
		const div = document.createElement('div');
		div.textContent = '';

		// @ts-ignore
		expect(nodePath.hasTextNote(div)).toBe(false);
	});

	it('should check DIV is parent block-type node', () => {
		const div = document.createElement('div');
		div.textContent = text;
		const textNode = div.childNodes[0];

		// @ts-ignore
		expect(nodePath.isParentBlockTag(textNode)).toBe(true);
	});

	it('should check SPAN is NOT parent block=type node', () => {
		const span = document.createElement('span');
		span.textContent = text;
		const textNode = span.childNodes[0];

		// @ts-ignore
		expect(nodePath.isParentBlockTag(textNode)).toBe(false);
	});

	it('should return element class css selector if element has ONE class', () => {
		const div = document.createElement('div');
		const oneClass = 'one-class';
		div.className = oneClass;

		// @ts-ignore
		expect(nodePath.getElementClassCssSelector(div)).toBe(`.${oneClass}`);
	});

	it('should return element class css selector if element has TWO classes', () => {
		const div = document.createElement('div');
		div.className = 'one-class two-class';

		// @ts-ignore
		expect(nodePath.getElementClassCssSelector(div)).toBe(`.one-class.two-class`);
	});

	it('should return element\'s ID css selector', () => {
		const div = document.createElement('div');
		div.id = 'id-selector';

		// @ts-ignore
		expect(nodePath.getElementCssSelector(div)).toBe('#id-selector');
	});

	it('should return element\s tagName', () => {
		const div = document.createElement('div');

		// @ts-ignore
		expect(nodePath.getElementCssSelector(div)).toBe('div');
	});

	// ? TODO: implement a case to calc tagName/className number
	// ! or in the case check then by text
	it('should hierarchy css selector', () => {
		const selectors = ['div', '.class', '#id'];

		// @ts-ignore
		const result = nodePath.getHierarchyCssSelector(selectors);

		expect(result).toBe('#id .class div');
	});

	it('should return css selector of 3 parents', () => {
		const tagName = 'textTag';

		document.body.innerHTML = `
			<div>
				<div>
					<div>
						<p ${tagName}>
							some text
						</p>
					</div>
				</div>
			</div>
		`;

		const textNode = document.querySelector(`[${tagName}]`)?.childNodes[0];

		let result;

		if (textNode) {
			// @ts-ignore
			result = nodePath.getParentCssSelector(textNode, 3);
		}

		expect(result).toBe('div div p');
	});

	it('should return css selector if first parent has ID', () => {
		const tagName = 'textTag';
		const id = 'test-id';

		document.body.innerHTML = `
			<div>
				<div>
					<div>
						<p id="${id}" ${tagName}>
							some text
						</p>
					</div>
				</div>
			</div>
		`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result;

		if (textNode) {
			// @ts-ignore
			result = nodePath.getParentCssSelector(textNode, 3);
		}

		expect(result).toBe(`#${id}`);
	});

	it('should return css selector if second parent has ID', () => {
		const tagName = 'textTag';
		const id = 'test-id';
		const className = 'test-class';

		document.body.innerHTML = `
			<div>
				<div>
					<div id="${id}">
						<span class="${className}" ${tagName}>
							some text
						</span>
					</div>
				</div>
			</div>
		`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result;

		if (textNode) {
			// @ts-ignore
			result = nodePath.getParentCssSelector(textNode, 3);
		}

		expect(result).toBe(`#${id} .${className}`);
	});

	it('should return child node path if parent has single text node', () => {
		const div = document.createElement('div');
		div.textContent = 'Single node';

		// @ts-ignore
		const result = nodePath.getChildPath(div.childNodes[0]);

		expect(result).toEqual({
			nodeName: '#text',
			index: 0
		} as ChildNodePath);
	});

	it('should return child node path if parent has several nodes', () => {
		const div = document.createElement('div');
		div.innerHTML = '0 node <span>1st node</span> 2d node';

		// @ts-ignore
		const result = nodePath.getChildPath(div.childNodes[2]);

		expect(result).toEqual({
			nodeName: '#text',
			index: 2
		} as ChildNodePath);
	});

	it('should return children nodes paths in div with single text node', () => {
		const div = document.createElement('div');
		div.textContent = 'Selection';

		// @ts-ignore
		const result = nodePath.getChildrenNodesPaths(div.childNodes[0]);

		expect(result).toEqual([
			{
				nodeName: '#text',
				index: 0
			}
		] as ChildNodePath[]);
	});

	it('should throw error if a text node has not parents block tag', () => {
		const tagName = 'textTag';

		document.body.innerHTML = `
			<span>
				<span>
					<span>
						<span ${tagName}>
							some text
						</span>
					</span>
				</span>
			</span>
		`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result;

		if (textNode) {
			// @ts-ignore
			result = nodePath.getChildrenNodesPaths.bind(nodePath, textNode, 4);
		}

		// see https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
		expect(result).toThrow(Error);
	});

	it('should return children nodes paths if text node has 2 parents: div > span', () => {
		const tagName = 'textTag';

		document.body.innerHTML = `<div><span ${tagName}>some text</span></div>`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result;

		if (textNode) {
			// @ts-ignore
			result = nodePath.getChildrenNodesPaths(textNode);
		}

		expect(result).toEqual([
			{
				nodeName: '#text',
				index: 0
			},
			{
				nodeName: 'span',
				index: 0
			}
		] as ChildNodePath[]);
	});

	it('should return children nodes paths if text node has <p> parent in path div > p', () => {
		const tagName = 'textTag';

		document.body.innerHTML = `<div><p ${tagName}>some text</p></div>`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result;

		if (textNode) {
			// @ts-ignore
			result = nodePath.getChildrenNodesPaths(textNode);
		}

		expect(result).toEqual([
			{
				nodeName: '#text',
				index: 0
			},
		] as ChildNodePath[]);
	});

	it('should return children nodes paths if text node has 3 parents: div > b > span', () => {
		const tagName = 'textTag';

		document.body.innerHTML = `
			<div>
				0 node
				<a>1st node</a>
				2d node
				<b>
					0 node
					<span ${tagName}>
						0 node
					</span>
				</b>
			</div>`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result;

		if (textNode) {
			// @ts-ignore
			result = nodePath.getChildrenNodesPaths(textNode);
		}

		expect(result).toEqual([
			{
				nodeName: '#text',
				index: 0
			},
			{
				nodeName: 'span',
				index: 1
			},
			{
				nodeName: 'b',
				index: 3
			},
		] as ChildNodePath[]);
	});

	it('should return node path data', () => {
		const tagName = 'textTag';

		document.body.innerHTML = `
			<div class="class">
				<div>
					<p>
						0 node
						<a>1st node</a>
						2d node
						<b>
							0 node
							<span ${tagName}>
								0 node
							</span>
						</b>
					</div>
				</div>
			</div>
		`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result: NodePath2 | null = null;

		if (textNode) {
			result = nodePath.getPath2(textNode);
		}

		expect(result).toEqual({
			childrenNodesPaths: [
				{
					nodeName: '#text',
					index: 0
				},
				{
					nodeName: 'span',
					index: 1
				},
				{
					nodeName: 'b',
					index: 3
				},
			],
			cssParentSelector: '.class div p'
		} as NodePath2);
	});

	it('should return node path data if parent <html>', () => {
		const tagName = 'textTag';

		document.children[0].innerHTML = `
			text
			<div ${tagName}>
				0 node
			</div>
		`;

		const textNode = document.querySelector('[textTag]')?.childNodes[0];

		let result: NodePath2 | null = null;

		if (textNode) {
			result = nodePath.getPath2(textNode);
		}

		expect(result).toEqual({
			childrenNodesPaths: [
				{
					nodeName: '#text',
					index: 0,
				}
			],
			cssParentSelector: 'html body div',
		} as NodePath2);
	});
});
