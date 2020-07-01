import React, { Component } from "react";
import { WordsList } from "./components/WordsList/WordsList";
import { Word } from "./models/word.model";
import { FirebaseService } from './services/firebase/firebase.service';
import { DataSaverService } from './services/saver/saver.service';
import { LocalDatabaseService } from './services/local-db/local-db.service';
import { SelectionToast } from "./components/SelectionToast/SelectionToast";
import { SelectionHandler } from "./services/selection-handler/selection-handler.service";
import { Highlighter } from "./services/highlighter/highlighter.service";

// import '../styles/App.css';

const remoteDb = new FirebaseService();
const localDb = new LocalDatabaseService();

const saver = new DataSaverService(localDb, remoteDb);
const selectionHandler = new SelectionHandler();
const highlighter = new Highlighter()

interface State {
	words: Word[];
	toast: string | null;
}

export default class App extends Component<{}, State> {
	state = {
		words: [],
		toast: null
	} as State;

	word: Word | null = null;

	constructor(props: {}) {
		super(props);

		this.initDb();
		selectionHandler.onSelect((wordData: Word) => this.onSelectWord(wordData));
	}

	render() {
		const { words, toast } = this.state;

		return (
			<>
				<WordsList words={words}></WordsList>
				{toast ? <SelectionToast toast={toast} saveCloseToast={this.saveCloseToast} cancel={this.cancel}></SelectionToast> : null }
				<span>Tadam</span>
			</>
		);
	}

	saveCloseToast = (): void => {
		if (!this.word) {
			alert('No selected word!');
			this.cancel();
			return;
		}

		const word = { ...this.word };

		saver.addItem(word)
			.then((id) => {
				word.id = id;

				this.setState({
					words: [
						...this.state.words,
						word,
					]
				});

				this.cancel();
				highlighter.highlight(word);
			});
	}

	cancel = (): void => {
		this.word = null;

		this.setState({
			toast: null
		});
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

	private onSelectWord(wordData: Word) {
		this.word = wordData;

		this.saveCloseToast();

		// this.setState({
		// 	toast: wordData.selection
		// });
	}
}
