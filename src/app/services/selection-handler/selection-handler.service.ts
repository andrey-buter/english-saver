import { SelectWord } from "../select-word/select-word.service";
import { WordData } from "../../models/word-data.model";

type RunOnSelect = (wordData: WordData) => void;

export class SelectionHandler {
	#selectionTimeout: NodeJS.Timeout | undefined;
	#runOnSelect = (wordData: WordData): void => {}

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
