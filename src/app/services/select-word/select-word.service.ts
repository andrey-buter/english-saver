/**
 * Classes
 * 1) Get context sentense
 * 2) get selection path to save it
 */

import { NodePath } from "../../models/node-path.model";
import { NodeCssPath } from "../node-css-path/node-css-path.service";

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

	getData(): WordData {
		return {
			selection: this.selection,
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

interface WordData {
	selection: string;
	context: string;
	startRange: NodePath;
	endRange: NodePath;
	translation: string;
	uri: string;
}
