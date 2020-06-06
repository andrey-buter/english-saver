export class SelectionHandler {
	#selectionTimeout: NodeJS.Timeout | undefined;
	#runOnSelect = (): void => {}

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
			engSelection = new SelectionContext(selection);

			// highlighter = new Highlighter( selection );

			// highlighter.doHighlight();

			const sentence = engSelection.getSentence();
			const word = engSelection.getSelectionObject().word;

			this.#runOnSelect(engSelection);

			// if (saver.hasWord(word)) {
			// 	list.highlightItem(word);
			// }

			// toast.context(sentence);
			// toast.show();
		}, 1000);
	}

	onSelect(callback: () => void) {
		this.#runOnSelect = callback;
	}
}