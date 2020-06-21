/**
 * Classes
 * 1) Get context sentense
 * 2) get selection path to save it
 */

import { NodeCssPath } from "../node-css-path/node-css-path.service";
import { Word } from "../../models/word.model";

const nodepath = new NodeCssPath();

export class SelectWord {
	range: Range;
	startOffset: number;
	endOffset: number;
	startContainer: Node;
	endContainer: Node;
	selection: string;

	constructor(selection: Selection) {
		this.range = selection.getRangeAt(0);

		const { startOffset, endOffset, startContainer, endContainer } = this.range;

		this.startOffset = startOffset;
		this.endOffset = endOffset;
		this.startContainer = startContainer;
		this.endContainer = endContainer;

		// TODO: format selection
		this.selection = selection.toString();
	}

	getData(): Word {
		return {
			selection: this.selection,
			originWord: this.selection,
			context: '',
			startRange: {
				...nodepath.getPath(this.startContainer),
				offset: this.startOffset
			},
			endRange: {
				...nodepath.getPath(this.endContainer),
				offset: this.endOffset
			},
			translation: '',
			uri: window.location.href
		}
	}
}
