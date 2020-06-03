import React, { Component } from "react";
import WordsList from "./components/WordsList/WordsList";

// import '../styles/App.css';

export default class App extends Component {
	render() {
		const words: string[] = [];

		return (
			<>
				<WordsList words={words}></WordsList>
			</>
		);
	}
}