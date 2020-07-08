import React, { Component } from "react";
import { Word } from "../../models/word.model";

import './WordsList.scss';
import { saver } from "../../databases";

export class WordsList extends Component<{words: Word[], removeItem: (wordId: string) => void}> {
	remove(id: string) {
		return () => {
			this.props.removeItem(id);
		}
	}
	render() {
		const { words, removeItem } = this.props;

		return (
			<ul className="eng-saver__words-list">
				{words.map((word) => {
					return (
						<li key={word.id}>
							<div>
								<div className="eng-saver__words-list-selection">{word.selection}</div>
								<div className="eng-saver__words-list-translation">{word.translation}</div>
							</div>
							<button type="button" onClick={this.remove(word.id || '')}>✕</button>
						</li>
					);
				})}
			</ul>
		);
	}
}
