import { NodeNumberInParent } from "../../models/node-number-in-parent.model";
import { Highlighter } from "./highlighter.service";

describe('[Highlighter]', () => {
	let highlighter: Highlighter;

	beforeAll(() => {
		highlighter = new Highlighter();
	})

	it('should find node in parent tag with single text node', () => {
		const path = [
			{
				parentTag: 'div',
				number: 0,
			},
		] as NodeNumberInParent[];

		document

		const result = highlighter.findNode(path);

		expect(result).toBe()
	});
});
