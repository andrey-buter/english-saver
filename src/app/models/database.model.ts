import { RawTagsDatabase } from './tags-database.model';
import { RawWordsDatabase } from './words-database.model';

export interface RawDatabase {
	words: RawWordsDatabase,
	tags: RawTagsDatabase
}
