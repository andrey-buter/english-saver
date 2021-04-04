import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Tag } from '../../models/tag.model';
import { RawWord } from '../../models/word.model';
import { SelectWord } from '../../services/select-word/select-word.service';
import PageActions from './PageActions/PageActions';

interface Props {
	tags: Tag[],
	selectedTagIds: string[];
	saveTagsAndWord: (tags: Tag[], word: SelectWord) => void;
}

const GoogleTranslatorIntegration = (props: Props) => {
	const { saveTagsAndWord, tags: allTags, selectedTagIds } = props;

	const saveButtonDiv = document.createElement('div');

	const onClickSaveWord = (tags: Tag[]) => {
		const textareas = document.querySelectorAll<HTMLTextAreaElement>('c-wiz textarea');

		if (!isEnRuTranslation()) {
			alert('Sorry, I can save only en-ru/ru-en combination');
			return;
		}

		const langs = getLangs();

		const enIndex = langs.indexOf('en');
		const ruIndex = langs.indexOf('ru');

		const selectedWord = new SelectWord(textareas[enIndex].value);
		selectedWord.addTranslation(textareas[ruIndex].value);

		saveTagsAndWord(tags, selectedWord);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			const docsButton = getDocsButton();

			if (!docsButton) {
				return;
			}

			clearInterval(interval);

			const copyButtonDiv = docsButton.closest('div');
			copyButtonDiv?.parentNode?.appendChild(saveButtonDiv);

			const selectedTags = allTags.filter((tag) => selectedTagIds.includes(tag.id));

			ReactDOM.render(<PageActions
				selectedTags={selectedTags}
				suggestionTags={allTags}
				saveWord={onClickSaveWord}
			/>, saveButtonDiv);
		}, 1000);
	}, []);

	return <>
		<div />
	</>;
}

function getCopyButton() {
	return Array.from(document.querySelectorAll('button > i.material-icons-extended'))
		.filter((el) => el?.textContent?.includes('content_copy')).shift();
}

function getDocsButton() {
	return Array.from(document.querySelectorAll('c-wiz nav .material-icons-extended'))
		.filter((el) => el?.textContent?.includes('insert_drive_file')).shift();
}

function getLangs() {
	const urlParams = new URLSearchParams(window.location.search);
	const from = urlParams.get('sl');
	const to = urlParams.get('tl');

	return [from, to];
}

function isEnRuTranslation() {
	const langs = getLangs();

	return langs.includes('en') && langs.includes('ru');
}

export default GoogleTranslatorIntegration;
