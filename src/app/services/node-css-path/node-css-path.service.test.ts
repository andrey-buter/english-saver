import { NodeCssPath } from "./node-css-path.service";

describe('Test selection in single Node', () => {
	const text = 'Some interesting text';
	const word = 'interesting';
	const startPosition = 5;
	const endPosition = startPosition + word.length;
	// let select;

	let nodePath: NodeCssPath;

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
		expect(nodePath.isBlockParentNode(textNode)).toBe(true);
	});

	it('should check SPAN is NOT parent block=type node', () => {
		const span = document.createElement('span');
		span.textContent = text;
		const textNode = span.childNodes[0];

		// @ts-ignore
		expect(nodePath.isBlockParentNode(textNode)).toBe(false);
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

		if (textNode) {
			const result = nodePath.getParentCssSelector(textNode, 3);

			expect(result).toBe('div div p');
		}
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

		if (textNode) {
			const result = nodePath.getParentCssSelector(textNode, 3);

			expect(result).toBe(`#${id}`);
		}
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

		if (textNode) {
			const result = nodePath.getParentCssSelector(textNode, 3);

			expect(result).toBe(`#${id} .${className}`);
		}
	});

	it('should return index in parent block tag of a current text node', () => {
		const tagName = 'textTag';

		document.body.innerHTML = `<div ${tagName}>selection</div>`;
		document.body.innerHTML = `<span ${tagName}>selection</span>`;
		document.body.innerHTML = `<div><span ${tagName}>selection</span></div>`;
		document.body.innerHTML = `<div>Some text <a>link</a> then text <span ${tagName}>selection</span></div>`;
		
		// ---------------
		document.body.innerHTML = `
			<div>
				Some Text here
				<a>
					<b>Test text</b>
					Some Text Here
					<b>
						Some 
						<span ${tagName}>selection</span>
					</b>
				</a>
			</div>`;

		expect(result).toEqual([
			['span', null],
			['b', 1],
			['a', 2],
			['div', 1]
		])
	})
});
