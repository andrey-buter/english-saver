/**
 * Classes
 * 1) Get context sentense
 * 2) get selection path to save it
 */

import { NodeCssPath } from "../node-css-path/node-css-path.service";
import { Word } from "../../models/word.model";

const nodepath = new NodeCssPath();

export class SelectWord {
	startOffset: number;
	endOffset: number;
	startContainer: Node;
	endContainer: Node;
	translation: string = '';

	// TODO: format selection
	constructor(private selection: string, private range: Range) {
		const { startOffset, endOffset, startContainer, endContainer } = this.range;

		this.startOffset = startOffset;
		this.endOffset = endOffset;
		this.startContainer = startContainer;
		this.endContainer = endContainer;
	}

	addTranslation(text: string) {
		this.translation = text;
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
			translation: this.translation,
			uri: window.location.href
		}
	}
}
