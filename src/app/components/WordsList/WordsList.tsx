import React, { Component } from "react";
import { Word } from "../../models/word.model";

import './WordsList.scss';

export class WordsList extends Component<{words: Word[]}> {
	render() {
		const { words } = this.props;

		return (
			<ul className="eng-saver__words-list">
				{words.map((word) => {
					return <li>{word.wordInContext}</li>;
				})}
			</ul>
		);
	}
}
