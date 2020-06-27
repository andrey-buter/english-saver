import { NodeNumberInParent } from "../../models/node-number-in-parent.model";
import { Highlighter } from "./highlighter.service";

xdescribe('[Highlighter]', () => {
	let highlighter: Highlighter;

	beforeAll(() => {
		highlighter = new Highlighter();
	})

	fit('should find textNode in parent tag with single text node', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'div',
				number: 0,
			},
		];

		document.body.innerHTML = `
			<div>${text}<span>some text</span></div>
		`;

		const result = highlighter._getFoundNodesText(highlighter.findNodesWithSelection(text, path));

		expect(result).toEqual([text]);
	});

	fit('should find the same textNodes in parent tag with single text node', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'div',
				number: 0,
			},
		];

		document.body.innerHTML = `
			<div>${text}<span>some text</span></div>
			<div>${text}<span>some text</span></div>
		`;

		const result = highlighter._getFoundNodesText(highlighter.findNodesWithSelection(text, path));

		expect(result).toEqual([text, text]);
	});

	fit('should find textNode in parent tag with single text node', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'div',
				number: 2,
			},
		];

		document.body.innerHTML = `
			<div>${text}<span>some text</span></div>
			<div>Some text<span>some text</span>${text}</div>
		`;


		const result = highlighter._getFoundNodesText(highlighter.findNodesWithSelection(text, path));

		expect(result).toEqual([text]);
	});

	fit('should throw an error if path in parent didn\'t find', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'div',
				number: 2,
			},
		];

		document.body.innerHTML = `
			<div>${text}<span>some text</span></div>
		`;


		const result = highlighter.findNodesWithSelection.bind(highlighter, text, path);

		expect(result).toThrow(Error);
	});

	fit('should throw an error if parent didn\'t find', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'p',
				number: 0,
			},
		];

		document.body.innerHTML = `
			<div>${text}<span>some text</span></div>
		`;


		const result = highlighter.findNodesWithSelection.bind(highlighter, text, path);

		expect(result).toThrow(Error);
	});

	it('should find textNode in child tag ', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'span',
				number: 0,
			},
			{
				parentTag: 'div',
				number: 3,
			},
		];

		document.body.innerHTML = `<div>Some text<span>some text</span>other text <span>${text}</span></div>`;

		const result = highlighter.findNodesWithSelection(path);

		expect(result).toBe(text);
	});

	it('should find textNode if there is several the same parents', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'span',
				number: 0,
			},
			{
				parentTag: 'div',
				number: 0,
			},
		];

		document.body.innerHTML = `<div>some text</div><div><span>${text}</span></div>`;

		const result = highlighter.findNodesWithSelection(path);

		expect(result).toBe(text);
	});

	it('should find textNode in nested parent parent tag', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'p',
				number: 0,
			},
		];

		document.body.innerHTML = `<div><p>${text}<span>some text</span></p></div>`;

		const result = highlighter.findNodesWithSelection(path);

		expect(result).toBe(text);
	});

	it('should find textNode in nested child element', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'span',
				number: 3,
			},
			{
				parentTag: 'b',
				number: 1,
			},
			{
				parentTag: 'div',
				number: 0,
			},
		];

		document.body.innerHTML = `<div>some text<b>inner text<span>${text}</span></b></div>`;

		const result = highlighter.findNodesWithSelection(path);

		expect(result).toBe(text);
	});

	it('should trigger an error if path doesn\'t find', () => {
		const text = 'Selection';
		const path: NodeNumberInParent[] = [
			{
				parentTag: 'span',
				number: 0,
			},
			{
				parentTag: 'b',
				number: 1,
			},
			{
				parentTag: 'div',
				number: 3,
			},
		];

		document.body.innerHTML = `<div>some text<b>inner text</b></div>`;

		const result = highlighter.findNodesWithSelection.bind(highlighter, path);

		//should be error
		expect(result).toThrow(Error);
	});


});
