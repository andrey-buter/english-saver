import { SelectWord } from "../select-word/select-word.service";
import { Word } from "../../models/word.model";

type RunOnSelect = (wordData: Word) => void;

export class SelectionHandler {
	#selectionTimeout: number | undefined;
	#runOnSelect = (wordData: Word): void => {}

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

		// const cls = selection.focusNode?.className;

		//     if ('jfk-bubble-content-id' !== cls) {
		//         return;
		//     }

		if (this.#selectionTimeout) {
			clearTimeout(this.#selectionTimeout);
		}

		// ! TODO: Find a solition to resoleve typings conflict for setTimeout()
		// ! I don't know how to resolve .d.ts conflict between dom.d.ts and @node
		// ! They have different decloration of setTimeout
		// ! Check branch jest-1!
		// @ts-ignore
		this.#selectionTimeout = setTimeout(() => {
			const selectedWord = new SelectWord(selection);

			// highlighter = new Highlighter( selection );

			// highlighter.doHighlight();

			// const sentence = engSelection.getSentence();
			// const word = engSelection.getSelectionObject().word;

			this.#runOnSelect(selectedWord.getData());

			// if (saver.hasWord(word)) {
			// 	list.highlightItem(word);
			// }

			// toast.context(sentence);
			// toast.show();
		}, 1000);
	}

	onSelect(callback: RunOnSelect) {
		this.#runOnSelect = callback;
	}
}
