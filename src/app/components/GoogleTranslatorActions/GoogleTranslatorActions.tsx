import React, { useEffect } from 'react';
import { RawWord } from '../../models/word.model';
import { SelectWord } from '../../services/select-word/select-word.service';

interface Props {
	saveWord: (word: RawWord) => void
}

const GoogleTranslatorActions = (props: Props) => {
	const { saveWord } = props;
	const content = document.createTextNode("Save word");
	const saveButton = document.createElement('button');
	saveButton.appendChild(content);
	saveButton.setAttribute('style', `
		background: #fff;
		border: 1px solid var(--gm-hairlinebutton-outline-color,#dadce0);
		height: 34px;
		color: #1967d2;
		padding: 0 20px;
		cursor: pointer;
	`);

	saveButton.addEventListener('click', () => {
		const textareas = document.querySelectorAll<HTMLTextAreaElement>('c-wiz textarea');

		if (!isEnRuTranslation()) {
			alert('Sorry, I can save only en-ru/ru-en combination');
			return;
		}

		const langs = getLangs();

		const enIndex = langs.indexOf('en');
		const ruIndex = langs.indexOf('ru');

		// add possibility to add new SelectWord() without range
		// const rawWord: RawWord = {
		// 	selection: textareas[enIndex].value,
		// 	originWord: '',
		// 	context: '',
		// 	startRange: {
		// 		childrenNodesPaths: [],
		// 		cssParentSelector: ''
		// 	},
		// 	endRange: {
		// 		childrenNodesPaths: [],
		// 		cssParentSelector: ''
		// 	},
		// 	translation: textareas[ruIndex].value,
		// 	uri: window.location.href,
		// 	addedTimestamp: Date.now()
		// }

		const selectedWord = new SelectWord(textareas[enIndex].value);
		selectedWord.addTranslation(textareas[ruIndex].value);

		saveWord(selectedWord.getData());
	});

	const saveButtonDiv = document.createElement('div');
	saveButtonDiv.classList.add('eng-saver-save-button-wrapper');
	saveButtonDiv.appendChild(saveButton);

	useEffect(() => {
		const interval = setInterval(() => {
			const docsButton = getDocsButton();

			if (!docsButton) {
				return;
			}

			clearInterval(interval);

			const copyButtonDiv = docsButton.closest('div');
			copyButtonDiv?.parentNode?.appendChild(saveButtonDiv);
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

export default GoogleTranslatorActions;
