import React, { Component } from "react";
import { WordsList } from "./components/WordsList/WordsList";
import { Word, RawWord } from "./models/word.model";
import { SelectionToast } from "./components/SelectionToast/SelectionToast";
import { SelectionHandler } from "./services/selection-handler/selection-handler.service";
import { Highlighter } from "./services/highlighter/highlighter.service";
import { saver } from "./databases";

// import '../styles/App.css';


const selectionHandler = new SelectionHandler();
const highlighter = new Highlighter()

interface State {
	words: Word[];
	toast: string | null;
	hideLoadedMessage: boolean
}

export default class App extends Component<{}, State> {
	state: State = {
		words: [],
		toast: null,
		hideLoadedMessage: false
	};

	#word: RawWord | null = null;

	constructor(props: {}) {
		super(props);

		this.initDb();
		selectionHandler.onSelect((wordData: RawWord) => this.onSelectWord(wordData));
	}

	render() {
		const { words, toast, hideLoadedMessage } = this.state;

		return (
			<>
				<WordsList words={words} removeItem={this.removeItem}></WordsList>
				{toast ? <SelectionToast toast={toast} saveCloseToast={this.saveCloseToast} cancel={this.cancel}></SelectionToast> : null }
				{!hideLoadedMessage && this.runTimer() ? <span className="eng-saver__loaded">Loaded</span> : ''}
			</>
		);
	}

	runTimer() {
		setTimeout(() => {
			this.setState({
				hideLoadedMessage: true
			})
		}, 1000 * 20);

		return true;
	}

	saveCloseToast = (): void => {
		const rawWord = this.getWord();

		if (!rawWord) {
			alert('No selected word!');
			this.cancel();
			return;
		}

		console.log(`[AppSaver] selection is saving:`, rawWord);

		saver.addItem(rawWord)
			.then((word) => {
				this.setState({
					words: [
						...this.state.words,
						word,
					]
				});

				this.cancel();
				highlighter.highlight(word);
				console.log(`[AppSaver] selection saved and highlighted:` , rawWord);
			});
	}

	cancel = (): void => {
		this.setWord(null);

		this.setState({
			toast: null
		});
	}

	removeItem = (wordId: string): void => {
		saver.removeWord(wordId)
			.then(() => {
				this.setState({
					words: saver.getWords()
				});
			})
	}

	private initDb() {
		saver.init().then((data) => {
			this.setState({
				words: data
			});

			data.forEach((word) => {
				word?.id && highlighter.highlight(word);
			})
		});
	}

	private onSelectWord(wordData: RawWord) {
		this.setWord(wordData);

		this.saveCloseToast();

		// this.setState({
		// 	toast: wordData.selection
		// });
	}

	private getWord() {
		return this.#word;
	}

	private setWord(word: RawWord | null) {
		this.#word = word;
	}
}
