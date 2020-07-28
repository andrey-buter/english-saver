import React, { Component } from "react";
import { Word } from "../../models/word.model";

import './WordsList.scss';
import { saver } from "../../databases";

export class WordsList extends Component<{words: Word[], removeItem: (wordId: string) => void, refresh: () => void}> {
	remove(id: string) {
		return () => {
			this.props.removeItem(id);
		}
	}

	refresh: () => void = () => this.refresh()

	render() {
		const { words, removeItem } = this.props;

		return (
			<ul className="eng-saver__words-list">
				{words.map((word) => {
					return (
						<li key={word.id}>
							<label htmlFor="word-{word.id}">
								<div className="eng-saver__words-list-selection">{word.selection}</div>
								<div className="eng-saver__words-list-translation">{word.translation}</div>
							</label>
							<button className="eng-saver__words-list-remove" type="button" onClick={this.remove(word.id || '')}>✕</button>
							<input type="checkbox" name="word-{word.id}" id="word-{word.id}"/>
							<div className="eng-saver__words-list-css-path">{word.startRange.cssParentSelector}</div>
						</li>
					);
				})}
				{words.length ? <li><button onClick={this.refresh}>Refresh</button></li> : ''}
			</ul>
		);
	}
}
