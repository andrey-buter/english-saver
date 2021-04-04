import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { Tag } from '../../../models/tag.model';

import './SelectTag.scss';

interface Props {
	selectedTags: Tag[];
	suggestionTags: Tag[];
	handleTags: (tags: Tag[]) => void
}

const SelectTag = (props: Props) => {
	const { handleTags, suggestionTags, selectedTags } = props;

	const handleDelete = (i: number) => {
		handleTags(selectedTags.filter((tag, index) => index !== i));
	}

	const handleAddition = (tag: Tag) => {
		handleTags([...selectedTags, tag]);
	}

	return <>
		<ReactTags
			minQueryLength={0}
			autocomplete={1}
			allowDragDrop={false}
			autofocus={false}
			tags={selectedTags}
			suggestions={suggestionTags}
			handleDelete={handleDelete}
			handleAddition={handleAddition}
		/>
	</>;
}

export default SelectTag;
