import React from 'react';
import './SaveButton.scss';

interface Props {
	saveWord: () => void
}

const SaveButton = (props: Props) => {
	const { saveWord } = props;

	return <>
		<button className='eng-saver-google-save-button' onClick={saveWord}>Save Word</button>
	</>;
}

export default SaveButton;
