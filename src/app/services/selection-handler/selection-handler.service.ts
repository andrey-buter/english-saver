import { SelectWord } from "../select-word/select-word.service";
import { Word } from "../../models/word.model";

type RunOnSelect = (wordData: Word) => void;

export class SelectionHandler {
	#selectionTimeout: number | undefined;
	#runOnSelect = (wordData: Word): void => {}

	private selection: SelectWord | undefined;

	constructor() {
		document.addEventListener('selectionchange', () => {
			this.handleEvent()
		})
	}

	private handleEvent() {
		const selection = window.getSelection();

		if (!selection) {
			return;
		}

		if ('Range' !== selection.type) {
			return;
		}

		const range = selection.getRangeAt(0);

		if (!(range.commonAncestorContainer as Element).classList?.contains('jfk-bubble-content-id')) {
			this.selection = new SelectWord(selection.toString(), range);
			return;
		}

		if (this.#selectionTimeout) {
			clearTimeout(this.#selectionTimeout);
		}

		// ! TODO: Find a solution to resolve typings conflict for setTimeout()
		// ! I don't know how to resolve .d.ts conflict between dom.d.ts and @node
		// ! They have different declaration of setTimeout
		// ! Check branch jest-1!
		// @ts-ignore
		// this.#selectionTimeout = setTimeout(() => {
		if (this.selection) {
			this.selection.addTranslation(selection.toString());

			this.#runOnSelect(this.selection.getData());
		}

			// const sentence = engSelection.getSentence();
			// const word = engSelection.getSelectionObject().word;


			// if (saver.hasWord(word)) {
			// 	list.highlightItem(word);
			// }

			// toast.context(sentence);
			// toast.show();
		// }, 1000);
	}

	onSelect(callback: RunOnSelect) {
		this.#runOnSelect = callback;
	}
}
