import React, { Component } from "react";
import { WordsList } from "./components/WordsList/WordsList";
import { Word } from "./models/word.model";
import { FirebaseService } from './services/firebase/firebase.service';
import { DataSaverService } from './services/saver/saver.service';
import { LocalDatabaseService } from './services/local-db/local-db.service';
import { SelectionToast } from "./components/SelectionToast/SelectionToast";
import { SelectionHandler } from "./services/selection-handler/selection-handler.service";

// import '../styles/App.css';

const remoteDb = new FirebaseService();
const localDb = new LocalDatabaseService();

const saver = new DataSaverService(localDb, remoteDb);
const selectionHandler = new SelectionHandler();

export default class App extends Component<{}, { words: Word[], toast: string | null }> {
	state = {
		words: [],
		toast: null
	}

	constructor(props: {}) {
		super(props);

		this.initDb();
		selectionHandler.onSelect((selector) => {
			this.onSelectWord()
		});
	}
	render() {
		const { words, toast } = this.state;

		return (
			<>
				<WordsList words={words}></WordsList>
				{toast ?? <SelectionToast toast={toast} saveCloseToast={this.saveCloseToast} cancel={this.cancel}></SelectionToast> }
				<span>Tadam</span>
			</>
		);
	}

	saveCloseToast = (): void => {
		// saver.addItem({
		// 	originWord: null,
		// 	wordInContext: wordObj.word,
		// 	translation: wordObj.translation,
		// 	context: wordObj.context,
		// 	contextOffset: wordObj.offset,
		// 	contextSelector: wordObj.selector,
		// 	uri: wordObj.url
		// }))

		// do highlight

		this.cancel();
	}

	cancel = (): void => {
		this.setState({
			toast: null
		})
	}

	private initDb() {
		saver.init().then((data) => {
			this.setState({
				words: data
			})
		});
	}

	private onSelectWord() {

	}
}
