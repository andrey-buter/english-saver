import React, { Component } from "react";
import { WordsList } from "./components/WordsList/WordsList";
import { Word } from "./models/word.model";
import { FirebaseService } from './services/firebase/firebase.service';
import { DataSaverService } from './services/saver/saver.service';
import { LocalDatabaseService } from './services/local-db/local-db.service';

// import '../styles/App.css';

const remoteDb = new FirebaseService();
const localDb = new LocalDatabaseService();

const saver = new DataSaverService(localDb, remoteDb);

export default class App extends Component {
	render() {
		let words = [] as Word[];

		// saver.init().then((data) => {
		// 	words = data;
		// });

		return (
			<>
				<WordsList words={words}></WordsList>
				<span>Tadam</span>
			</>
		);
	}
}
