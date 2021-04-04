/**
 * Classes
 * 1) Get context sentense
 * 2) get selection path to save it
 */

import { NodeCssPath } from "../node-css-path/node-css-path.service";
import { RawWord } from "../../models/word.model";
import { NodePath } from "../../models/node-path.model";
import { Tag } from "../../models/tag.model";

const nodepath = new NodeCssPath();

export class SelectWord {
	startOffset: number = 0;
	endOffset: number = 0;
	startContainer: Node | null = null;
	endContainer: Node | null = null;
	translation: string = '';
	tagIds: string[] = [];

	// TODO: format selection
	constructor(private selection: string, private range?: Range) {
		// skip range for google translator page
		if (this.range) {
			const { startOffset, endOffset, startContainer, endContainer } = this.range;

			this.startOffset = startOffset;
			this.endOffset = endOffset;
			this.startContainer = startContainer;
			this.endContainer = endContainer;
		}
	}

	addTranslation(text: string) {
		this.translation = text;
	}

	addTagIds(tagIds: string[]) {
		this.tagIds = tagIds;
	}

	getData(): RawWord {
		return {
			selection: this.selection,
			originWord: this.selection,
			context: '',
			startRange: this.getRange(this.startContainer),
			endRange: this.getRange(this.endContainer),
			translation: this.translation,
			uri: window.location.href,
			tagIds: this.tagIds,
			addedTimestamp: Date.now()
		}
	}

	private getRange(container: Node | null): NodePath {
		if (container) {
			return {
				...nodepath.getPath(container),
				offset: this.startOffset
			}
		}

		return {
			childrenNodesPaths: [],
			cssParentSelector: ''
		}
	}
}
