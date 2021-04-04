import React, { useState } from 'react';
import { Tag } from '../../../models/tag.model';
import SaveButton from '../SaveButton/SaveButton';
import SelectTag from '../SelectTag/SelectTag';
import './PageActions.scss';

interface Props {
	selectedTags: Tag[],
	suggestionTags: Tag[],
	saveWord: (tags: Tag[]) => void
}

const PageActions = (props: Props) => {
	const { selectedTags, suggestionTags, saveWord } = props;

	const [tags, setTags] = useState<Tag[]>(selectedTags);

	const onUpdateTags = (tags: Tag[]) => {
		setTags(tags);
	}

	return <div className='eng-saver-google-page-actions'>
		<SaveButton saveWord={() => saveWord(tags)} />
		<SelectTag
			selectedTags={tags}
			suggestionTags={suggestionTags}
			handleTags={onUpdateTags}
		/>
	</div>;
}

export default PageActions;
