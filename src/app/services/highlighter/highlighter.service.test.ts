import { ChildNodePath } from "../../models/node-number-in-parent.model";
import { Highlighter } from "./highlighter.service";
import { HighlighterPO } from "./highlighter.po";

describe('[Highlighter]', () => {
	let highlighter: Highlighter;
	const po = new HighlighterPO();

	beforeAll(() => {
		highlighter = new Highlighter();
	})

	it('should find textNode in parent tag with single text node', () => {
		const text = 'Selection';
		const paths: ChildNodePath[] = [
			{
				nodeName: '#text',
				index: 0,
			},
		];
		const div = po.createDiv(`${text}<span>some text</span>`);

		// @ts-ignore
		const result = highlighter.findChildrenNodesWithSelection(div, paths);

		expect(result?.textContent).toBe(text);
	});

	it('should return NULL if there was not found a child', () => {
		const text = 'Selection';
		const path: ChildNodePath[] = [
			{
				nodeName: 'span',
				index: 100,
			},
			{
				nodeName: '#text',
				index: 0,
			},
		];

		const div = po.createDiv(`<span>${text}</span>`);

		// @ts-ignore
		const result = highlighter.findChildrenNodesWithSelection(div, path);

		expect(result).toBe(null);
	});

	it('should return NULL if there was found incorrect child', () => {
		const text = 'Selection';
		const path: ChildNodePath[] = [
			{
				nodeName: '#text',
				index: 0,
			},
		];

		const div = po.createDiv(`<span>First</span>${text}`);

		// @ts-ignore
		const result = highlighter.findChildrenNodesWithSelection(div, path);

		expect(result).toBe(null);
	});

	it('should find textNode in child tag ', () => {
		const text = 'Selection';
		const path: ChildNodePath[] = [
			{
				nodeName: 'span',
				index: 3,
			},
			{
				nodeName: '#text',
				index: 0,
			},
		];

		const div = po.createDiv(`Some text<span>some text</span>other text <span>${text}</span>`);

		// @ts-ignore
		const result = highlighter.findChildrenNodesWithSelection(div, path);

		expect(result?.textContent).toBe(text);
	});

	it('should find textNode in nested child element', () => {
		const text = 'Selection';
		const path: ChildNodePath[] = [
			{
				nodeName: 'b',
				index: 1,
			},
			{
				nodeName: 'span',
				index: 1,
			},
			{
				nodeName: '#text',
				index: 0,
			},
		];

		const div = po.createDiv(`some text<b>inner text<span>${text}</span></b>`);

		// @ts-ignore
		const result = highlighter.findChildrenNodesWithSelection(div, path);

		expect(result?.textContent).toBe(text);
	});

	// it('should return ', () => {
	// 	const start = 'Start';
	// 	const end = 'End';
	// 	const div = po.createDiv(`some text<b>${start}</b>some text<span>${end}</span>`);
	// 	const startNode = div.querySelector('b')?.childNodes[0];
	// 	const endNode = div.querySelector('span')?.childNodes[0];

	// 	const range = highlighter._createRange(
	// 		{
	// 			node: startNode,
	// 			offset: 0
	// 		},
	// 		{
	// 			node: endNode,
	// 			offset: end.length - 1
	// 		}
	// 	);

	// 	document.body.appendChild()


	// 	expect(result?.textContent).toBe(text);
	// });
});
