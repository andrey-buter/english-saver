import { SelectWord, SaveNodePath } from "./select-word.service";

describe('Test selection in single Node', () => {
	const text = 'Some interesting text';
	const word = 'interesting';
	const startPosition = 5;
	const endPosition = startPosition + word.length;
	// let select;

	let nodePath: SaveNodePath;

	beforeAll(() => {
		// select = new SelectWord();
		nodePath = new SaveNodePath();
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

		expect(nodePath.hasTextNote(div)).toBe(true);
	});

	it('should check Html Elements has NOT a text node', () => {
		const div = document.createElement('div');

		expect(nodePath.hasTextNote(div)).toBe(false);
	});

	it('should check Html Elements has NOT a text node 2', () => {
		const div = document.createElement('div');
		div.textContent = '';

		expect(nodePath.hasTextNote(div)).toBe(false);
	});

	it('should check DIV is parent block-type node', () => {
		const div = document.createElement('div');
		div.textContent = text;
		const textNode = div.childNodes[0];

		expect(nodePath.isBlockParentNode(textNode)).toBe(true);
	});

	it('should check SPAN is NOT parent block=type node', () => {
		const span = document.createElement('span');
		span.textContent = text;
		const textNode = span.childNodes[0];

		expect(nodePath.isBlockParentNode(textNode)).toBe(false);
	});

	it('should return element class css selector if element has ONE class', () => {
		const div = document.createElement('div');
		const oneClass = 'one-class';
		div.className = oneClass;

		expect(nodePath.getElementClassCssSelector(div)).toBe(`.${oneClass}`);
	});

	it('should return element class css selector if element has TWO classes', () => {
		const div = document.createElement('div');
		div.className = 'one-class two-class';

		expect(nodePath.getElementClassCssSelector(div)).toBe(`.one-class.two-class`);
	});

	it('should return element\'s ID css selector', () => {
		const div = document.createElement('div');
		div.id = 'id-selector';

		expect(nodePath.getElementCssSelector(div)).toBe('#id-selector');
	});

	it('should return element\s tagName', () => {
		const div = document.createElement('div');

		expect(nodePath.getElementCssSelector(div)).toBe('div');
	});

	// it('should check that TagName is element selector', () => {

	// });

	// <div>Some interesting text</div>
	// interesting

});
